import { Router } from "express";
import { db } from "@workspace/db";
import { quizzesTable, quizAttemptsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middlewares/auth.js";

const router = Router();

router.get("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { schoolId, classId, teacherId } = req.query;
    const effectiveSchoolId = schoolId ? Number(schoolId) : req.user?.schoolId;
    if (!effectiveSchoolId) return res.status(400).json({ error: "Bad request", message: "schoolId required" });
    const conditions: any[] = [eq(quizzesTable.schoolId, effectiveSchoolId)];
    if (classId) conditions.push(eq(quizzesTable.classId, Number(classId)));
    if (teacherId) conditions.push(eq(quizzesTable.teacherId, Number(teacherId)));
    const role = req.user?.role;
    if (role === "student") conditions.push(eq(quizzesTable.isPublished, true));
    const quizzes = await db.select().from(quizzesTable).where(and(...conditions)).orderBy(quizzesTable.createdAt);
    return res.json({ quizzes: quizzes.reverse() });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error", message: "Failed to get quizzes" });
  }
});

router.post("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { schoolId, classId, teacherId, title, subject, description, questions, isPublished, timeLimit } = req.body;
    const effectiveSchoolId = schoolId || req.user?.schoolId;
    if (!effectiveSchoolId || !classId || !title) {
      return res.status(400).json({ error: "Bad request", message: "Missing required fields: schoolId, classId, title" });
    }
    const [quiz] = await db.insert(quizzesTable).values({
      schoolId: effectiveSchoolId,
      classId: Number(classId),
      teacherId: teacherId ? Number(teacherId) : null,
      title,
      subject: subject || null,
      description: description || null,
      questions: questions || [],
      isPublished: isPublished || false,
      timeLimit: timeLimit ? Number(timeLimit) : null,
    }).returning();
    return res.status(201).json(quiz);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error", message: "Failed to create quiz" });
  }
});

router.patch("/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { title, subject, description, questions, isPublished, timeLimit } = req.body;
    const updates: any = {};
    if (title !== undefined) updates.title = title;
    if (subject !== undefined) updates.subject = subject;
    if (description !== undefined) updates.description = description;
    if (questions !== undefined) updates.questions = questions;
    if (isPublished !== undefined) updates.isPublished = isPublished;
    if (timeLimit !== undefined) updates.timeLimit = Number(timeLimit);
    const [quiz] = await db.update(quizzesTable).set(updates).where(eq(quizzesTable.id, Number(req.params.id))).returning();
    return res.json(quiz);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error", message: "Failed to update quiz" });
  }
});

router.delete("/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    await db.delete(quizAttemptsTable).where(eq(quizAttemptsTable.quizId, Number(req.params.id)));
    await db.delete(quizzesTable).where(eq(quizzesTable.id, Number(req.params.id)));
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error", message: "Failed to delete quiz" });
  }
});

router.post("/:id/attempt", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { studentId, schoolId, answers, score, total } = req.body;
    const effectiveSchoolId = schoolId || req.user?.schoolId;
    const [attempt] = await db.insert(quizAttemptsTable).values({
      quizId: Number(req.params.id),
      studentId: Number(studentId),
      schoolId: effectiveSchoolId,
      answers: answers || {},
      score: score !== undefined ? Number(score) : null,
      total: total !== undefined ? Number(total) : null,
    }).returning();
    return res.status(201).json(attempt);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error", message: "Failed to record attempt" });
  }
});

router.get("/:id/attempts", requireAuth, async (req: AuthRequest, res) => {
  try {
    const attempts = await db.select().from(quizAttemptsTable).where(eq(quizAttemptsTable.quizId, Number(req.params.id)));
    return res.json({ attempts });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error", message: "Failed to get attempts" });
  }
});

export default router;
