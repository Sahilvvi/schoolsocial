import { Router } from "express";
import { db } from "@workspace/db";
import { schoolsTable, usersTable, studentsTable, teachersTable, classesTable, attendanceTable, feesTable, noticesTable, eventsTable } from "@workspace/db";
import { eq, and, like, count, sql, inArray } from "drizzle-orm";
import { requireAuth, requireRole, type AuthRequest } from "../middlewares/auth.js";
import { generateToken } from "./auth.js";
import crypto from "crypto";

const router = Router();

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "myschool_salt").digest("hex");
}

router.get("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const conditions: any[] = [];
    const validStatuses = ["pending", "approved", "suspended"];
    if (status && validStatuses.includes(status as string)) conditions.push(eq(schoolsTable.status, status as any));
    if (search) conditions.push(like(schoolsTable.name, `%${search}%`));

    const query = db.select().from(schoolsTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .limit(Number(limit)).offset(offset);

    const [schools, [{ total }]] = await Promise.all([
      query,
      db.select({ total: count() }).from(schoolsTable).where(conditions.length > 0 ? and(...conditions) : undefined),
    ]);
    return res.json({ schools, total: Number(total), page: Number(page), limit: Number(limit) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error", message: "Failed to list schools" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, email, phone, address, city, state, pincode, board, type, adminName, adminEmail, adminPassword } = req.body;
    if (!name || !email || !adminEmail || !adminPassword) {
      return res.status(400).json({ error: "Bad request", message: "Missing required fields" });
    }
    const slug = slugify(name) + "-" + Math.floor(Math.random() * 1000);
    const [school] = await db.insert(schoolsTable).values({
      name, slug, email, phone, address, city, state, pincode, board, type: type || "private",
    }).returning();

    const hashedPassword = hashPassword(adminPassword);
    await db.insert(usersTable).values({
      name: adminName,
      email: adminEmail,
      passwordHash: hashedPassword,
      role: "school_admin",
      schoolId: school.id,
    });
    return res.status(201).json(school);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error", message: "Failed to create school" });
  }
});

router.get("/:schoolId", requireAuth, async (req: AuthRequest, res) => {
  try {
    const schoolId = Number(req.params.schoolId);
    const [school] = await db.select().from(schoolsTable).where(eq(schoolsTable.id, schoolId)).limit(1);
    if (!school) return res.status(404).json({ error: "Not found", message: "School not found" });
    return res.json(school);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error", message: "Failed to get school" });
  }
});

router.patch("/:schoolId", requireAuth, async (req: AuthRequest, res) => {
  try {
    const schoolId = Number(req.params.schoolId);
    const { name, phone, address, city, state, pincode, board, website, description, facilities, logoUrl, coverUrl } = req.body;
    const [school] = await db.update(schoolsTable)
      .set({ name, phone, address, city, state, pincode, board, website, description, facilities: Array.isArray(facilities) ? facilities.join(",") : (facilities || null), logoUrl, coverUrl, updatedAt: new Date() })
      .where(eq(schoolsTable.id, schoolId))
      .returning();
    return res.json(school);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error", message: "Failed to update school" });
  }
});

router.post("/:schoolId/approve", requireAuth, requireRole("super_admin"), async (req, res) => {
  try {
    const [school] = await db.update(schoolsTable)
      .set({ status: "approved", updatedAt: new Date() })
      .where(eq(schoolsTable.id, Number(req.params.schoolId)))
      .returning();
    return res.json(school);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error", message: "Failed to approve school" });
  }
});

router.post("/:schoolId/suspend", requireAuth, requireRole("super_admin"), async (req, res) => {
  try {
    const [school] = await db.update(schoolsTable)
      .set({ status: "suspended", updatedAt: new Date() })
      .where(eq(schoolsTable.id, Number(req.params.schoolId)))
      .returning();
    return res.json(school);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error", message: "Failed to suspend school" });
  }
});

router.get("/:schoolId/stats", requireAuth, async (req: AuthRequest, res) => {
  try {
    const schoolId = Number(req.params.schoolId);
    const today = new Date().toISOString().split("T")[0];

    const [[{ totalStudents }], [{ totalTeachers }], [{ totalClasses }], attendanceToday, [{ feePending }], [{ noticesSent }], [{ upcomingEvents }]] = await Promise.all([
      db.select({ totalStudents: count() }).from(studentsTable).where(eq(studentsTable.schoolId, schoolId)),
      db.select({ totalTeachers: count() }).from(teachersTable).where(eq(teachersTable.schoolId, schoolId)),
      db.select({ totalClasses: count() }).from(classesTable).where(eq(classesTable.schoolId, schoolId)),
      db.select({ status: attendanceTable.status, cnt: count() }).from(attendanceTable)
        .where(and(eq(attendanceTable.schoolId, schoolId), eq(attendanceTable.date, today)))
        .groupBy(attendanceTable.status),
      db.select({ feePending: sql<number>`COALESCE(SUM(CAST(amount AS NUMERIC)), 0)` }).from(feesTable)
        .where(and(eq(feesTable.schoolId, schoolId), eq(feesTable.status, "pending"))),
      db.select({ noticesSent: count() }).from(noticesTable).where(eq(noticesTable.schoolId, schoolId)),
      db.select({ upcomingEvents: count() }).from(eventsTable)
        .where(and(eq(eventsTable.schoolId, schoolId), sql`event_date > NOW()`)),
    ]);

    const presentCount = attendanceToday.find(a => a.status === "present")?.cnt || 0;
    const absentCount = attendanceToday.find(a => a.status === "absent")?.cnt || 0;
    const attendancePct = totalStudents > 0 ? Math.round((Number(presentCount) / Number(totalStudents)) * 100) : 0;

    return res.json({
      totalStudents: Number(totalStudents),
      totalTeachers: Number(totalTeachers),
      totalClasses: Number(totalClasses),
      attendanceToday: attendancePct,
      feePending: Number(feePending),
      feeDefaulters: 0,
      noticesSent: Number(noticesSent),
      upcomingEvents: Number(upcomingEvents),
      absentToday: Number(absentCount),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error", message: "Failed to get stats" });
  }
});

router.delete("/:schoolId", requireAuth, requireRole("super_admin"), async (req: AuthRequest, res) => {
  try {
    const schoolId = Number(req.params.schoolId);
    await db.delete(schoolsTable).where(eq(schoolsTable.id, schoolId));
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error", message: "Failed to delete school" });
  }
});

router.post("/:schoolId/impersonate", requireAuth, requireRole("super_admin"), async (req: AuthRequest, res) => {
  try {
    const schoolId = Number(req.params.schoolId);
    const [admin] = await db.select().from(usersTable)
      .where(and(eq(usersTable.schoolId, schoolId), eq(usersTable.role, "school_admin")))
      .limit(1);
    if (!admin) {
      const [school] = await db.select().from(schoolsTable).where(eq(schoolsTable.id, schoolId)).limit(1);
      if (!school) return res.status(404).json({ error: "School not found" });
      const token = generateToken(-1, "school_admin", schoolId);
      return res.json({ token, user: { id: -1, name: `${school.name} Admin`, role: "school_admin", schoolId } });
    }
    const token = generateToken(admin.id, "school_admin", schoolId);
    return res.json({ token, user: { id: admin.id, name: admin.name, email: admin.email, role: "school_admin", schoolId } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error", message: "Failed to impersonate" });
  }
});

export default router;
