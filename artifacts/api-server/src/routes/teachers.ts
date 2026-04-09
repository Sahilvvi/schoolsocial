import { Router } from "express";
import { db } from "@workspace/db";
import { teachersTable, usersTable, classesTable } from "@workspace/db";
import { eq, and, like, count } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middlewares/auth.js";
import crypto from "crypto";

const router = Router();

function hashPassword(p: string): string {
  return crypto.createHash("sha256").update(p + "myschool_salt").digest("hex");
}

router.get("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { schoolId, search, page = 1, limit = 50 } = req.query;
    const effectiveSchoolId = schoolId ? Number(schoolId) : req.user?.schoolId;
    if (!effectiveSchoolId) return res.status(400).json({ error: "Bad request", message: "schoolId required" });

    const conditions: any[] = [eq(teachersTable.schoolId, effectiveSchoolId)];
    if (search) conditions.push(like(teachersTable.name, `%${search}%`));

    const [teachers, [{ total }], classes] = await Promise.all([
      db.select().from(teachersTable).where(and(...conditions)).limit(Number(limit)).offset((Number(page) - 1) * Number(limit)),
      db.select({ total: count() }).from(teachersTable).where(and(...conditions)),
      db.select().from(classesTable).where(eq(classesTable.schoolId, effectiveSchoolId)),
    ]);

    const enriched = teachers.map(t => ({
      ...t,
      subjects: t.subjects ? t.subjects.split(",") : [],
      assignedClasses: classes.filter(c => c.teacherId === t.id).map(c => `${c.name}${c.section ? "-" + c.section : ""}`),
    }));

    return res.json({ teachers: enriched, total: Number(total), page: Number(page), limit: Number(limit) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error", message: "Failed to list teachers" });
  }
});

router.post("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { schoolId, name, email, phone, subjects, qualification, experience, password } = req.body;
    const effectiveSchoolId = schoolId || req.user?.schoolId;
    if (!effectiveSchoolId || !name || !password) return res.status(400).json({ error: "Bad request", message: "Missing required fields" });

    const user = await db.insert(usersTable).values({
      name, email, phone,
      passwordHash: hashPassword(password),
      role: "teacher",
      schoolId: effectiveSchoolId,
    }).returning();

    const [teacher] = await db.insert(teachersTable).values({
      schoolId: effectiveSchoolId,
      userId: user[0].id,
      name, email, phone,
      subjects: Array.isArray(subjects) ? subjects.join(",") : subjects,
      qualification, experience,
    }).returning();

    return res.status(201).json({ ...teacher, subjects: teacher.subjects ? teacher.subjects.split(",") : [], assignedClasses: [] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error", message: "Failed to create teacher" });
  }
});

router.get("/:teacherId", requireAuth, async (req: AuthRequest, res) => {
  try {
    const [teacher] = await db.select().from(teachersTable).where(eq(teachersTable.id, Number(req.params.teacherId))).limit(1);
    if (!teacher) return res.status(404).json({ error: "Not found", message: "Teacher not found" });
    return res.json({ ...teacher, subjects: teacher.subjects ? teacher.subjects.split(",") : [], assignedClasses: [] });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error", message: "Failed to get teacher" });
  }
});

router.patch("/:teacherId", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { name, email, phone, subjects, qualification, experience, photoUrl } = req.body;
    const [teacher] = await db.update(teachersTable)
      .set({
        name, email, phone,
        subjects: Array.isArray(subjects) ? subjects.join(",") : subjects,
        qualification, experience, photoUrl,
      })
      .where(eq(teachersTable.id, Number(req.params.teacherId)))
      .returning();
    return res.json({ ...teacher, subjects: teacher.subjects ? teacher.subjects.split(",") : [], assignedClasses: [] });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error", message: "Failed to update teacher" });
  }
});

router.delete("/:teacherId", requireAuth, async (req: AuthRequest, res) => {
  try {
    const [teacher] = await db.select({ userId: teachersTable.userId }).from(teachersTable).where(eq(teachersTable.id, Number(req.params.teacherId))).limit(1);
    await db.delete(teachersTable).where(eq(teachersTable.id, Number(req.params.teacherId)));
    if (teacher?.userId) {
      await db.delete(usersTable).where(eq(usersTable.id, teacher.userId));
    }
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error", message: "Failed to delete teacher" });
  }
});

export default router;
