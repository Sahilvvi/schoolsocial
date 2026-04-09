import { Router } from "express";
import { db } from "@workspace/db";
import { noticesTable, usersTable } from "@workspace/db";
import { eq, and, count } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middlewares/auth.js";

const router = Router();

router.get("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { schoolId, classId, page = 1, limit = 20 } = req.query;
    const effectiveSchoolId = schoolId ? Number(schoolId) : req.user?.schoolId;
    if (!effectiveSchoolId) return res.status(400).json({ error: "Bad request", message: "schoolId required" });

    const conditions: any[] = [eq(noticesTable.schoolId, effectiveSchoolId)];
    if (classId) conditions.push(eq(noticesTable.classId, Number(classId)));

    const [notices, [{ total }]] = await Promise.all([
      db.select().from(noticesTable).where(and(...conditions))
        .orderBy(noticesTable.createdAt)
        .limit(Number(limit)).offset((Number(page) - 1) * Number(limit)),
      db.select({ total: count() }).from(noticesTable).where(and(...conditions)),
    ]);

    const userIds = [...new Set(notices.map(n => n.postedBy).filter(Boolean))] as number[];
    let userMap = new Map<number, string>();
    if (userIds.length > 0) {
      const users = await db.select({ id: usersTable.id, name: usersTable.name }).from(usersTable);
      userMap = new Map(users.map(u => [u.id, u.name]));
    }

    const enriched = notices.map(n => ({
      ...n,
      postedByName: n.postedBy ? (userMap.get(n.postedBy) || "Admin") : "Admin",
    }));

    return res.json({ notices: enriched.reverse(), total: Number(total) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error", message: "Failed to list notices" });
  }
});

router.post("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { schoolId, classId, title, content, type } = req.body;
    const effectiveSchoolId = schoolId || req.user?.schoolId;
    if (!effectiveSchoolId || !title || !content || !type) {
      return res.status(400).json({ error: "Bad request", message: "Missing required fields" });
    }
    const [notice] = await db.insert(noticesTable).values({
      schoolId: effectiveSchoolId,
      classId: classId || null,
      title, content, type,
      postedBy: req.user?.userId,
    }).returning();
    return res.status(201).json({ ...notice, postedByName: "Admin" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error", message: "Failed to create notice" });
  }
});

router.patch("/:noticeId", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { title, content, type, classId } = req.body;
    const [notice] = await db.update(noticesTable)
      .set({ title, content, type, classId: classId || null })
      .where(eq(noticesTable.id, Number(req.params.noticeId)))
      .returning();
    return res.json({ ...notice, postedByName: "Admin" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error", message: "Failed to update notice" });
  }
});

router.delete("/:noticeId", requireAuth, async (req: AuthRequest, res) => {
  try {
    await db.delete(noticesTable).where(eq(noticesTable.id, Number(req.params.noticeId)));
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error", message: "Failed to delete notice" });
  }
});

export default router;
