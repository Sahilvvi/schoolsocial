import { Router } from "express";
import { db } from "@workspace/db";
import { homeworkTable, homeworkSubmissionsTable, studentsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middlewares/auth.js";

const router = Router();

router.get("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { schoolId, classId, teacherId } = req.query;
    const effectiveSchoolId = schoolId ? Number(schoolId) : req.user?.schoolId;
    if (!effectiveSchoolId) return res.status(400).json({ error: "Bad request", message: "schoolId required" });

    const conditions: any[] = [eq(homeworkTable.schoolId, effectiveSchoolId)];
    if (classId) conditions.push(eq(homeworkTable.classId, Number(classId)));
    if (teacherId) conditions.push(eq(homeworkTable.teacherId, Number(teacherId)));

    const hw = await db.select().from(homeworkTable).where(and(...conditions)).orderBy(homeworkTable.createdAt);
    return res.json({ homework: hw.reverse() });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error", message: "Failed to get homework" });
  }
});

router.post("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { schoolId, classId, teacherId, subject, title, description, dueDate } = req.body;
    const effectiveSchoolId = schoolId || req.user?.schoolId;
    if (!effectiveSchoolId || !classId || !subject || !title || !dueDate) {
      return res.status(400).json({ error: "Bad request", message: "Missing required fields" });
    }
    const [hw] = await db.insert(homeworkTable).values({
      schoolId: effectiveSchoolId, classId, teacherId: teacherId || null, subject, title, description: description || null, dueDate,
    }).returning();
    return res.status(201).json(hw);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error", message: "Failed to create homework" });
  }
});

router.delete("/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    await db.delete(homeworkSubmissionsTable).where(eq(homeworkSubmissionsTable.homeworkId, Number(req.params.id)));
    await db.delete(homeworkTable).where(eq(homeworkTable.id, Number(req.params.id)));
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error", message: "Failed to delete homework" });
  }
});

router.get("/:homeworkId/submissions", requireAuth, async (req: AuthRequest, res) => {
  try {
    const subs = await db.select().from(homeworkSubmissionsTable).where(eq(homeworkSubmissionsTable.homeworkId, Number(req.params.homeworkId)));
    const students = await db.select().from(studentsTable);
    const studentMap = new Map(students.map(s => [s.id, s]));
    return res.json({ submissions: subs.map(s => ({ ...s, student: studentMap.get(s.studentId) })) });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error", message: "Failed to get submissions" });
  }
});

router.post("/:homeworkId/submit", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { studentId, schoolId, note } = req.body;
    const effectiveSchoolId = schoolId || req.user?.schoolId;
    const existing = await db.select().from(homeworkSubmissionsTable).where(and(eq(homeworkSubmissionsTable.homeworkId, Number(req.params.homeworkId)), eq(homeworkSubmissionsTable.studentId, studentId))).limit(1);
    if (existing.length) {
      const [updated] = await db.update(homeworkSubmissionsTable).set({ status: "submitted", note, submittedAt: new Date() }).where(eq(homeworkSubmissionsTable.id, existing[0].id)).returning();
      return res.json(updated);
    }
    const [sub] = await db.insert(homeworkSubmissionsTable).values({ homeworkId: Number(req.params.homeworkId), studentId, schoolId: effectiveSchoolId, status: "submitted", note, submittedAt: new Date() }).returning();
    return res.status(201).json(sub);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error", message: "Failed to submit homework" });
  }
});

export default router;
