import { Router } from "express";
import { db } from "@workspace/db";
import { examsTable, examResultsTable, studentsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middlewares/auth.js";

const router = Router();

router.get("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { schoolId, classId } = req.query;
    const effectiveSchoolId = schoolId ? Number(schoolId) : req.user?.schoolId;
    if (!effectiveSchoolId) return res.status(400).json({ error: "Bad request", message: "schoolId required" });

    const conditions: any[] = [eq(examsTable.schoolId, effectiveSchoolId)];
    if (classId) conditions.push(eq(examsTable.classId, Number(classId)));

    const exams = await db.select().from(examsTable).where(and(...conditions)).orderBy(examsTable.examDate);
    return res.json({ exams });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error", message: "Failed to get exams" });
  }
});

router.post("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { schoolId, classId, subject, examName, examType, examDate, maxMarks, passingMarks } = req.body;
    const effectiveSchoolId = schoolId || req.user?.schoolId;
    if (!effectiveSchoolId || !classId || !subject || !examName || !examDate) {
      return res.status(400).json({ error: "Bad request", message: "Missing required fields" });
    }
    const [exam] = await db.insert(examsTable).values({
      schoolId: effectiveSchoolId, classId, subject, examName,
      examType: examType || "unit_test", examDate,
      maxMarks: maxMarks || 100, passingMarks: passingMarks || 35,
    }).returning();
    return res.status(201).json(exam);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error", message: "Failed to create exam" });
  }
});

router.delete("/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    await db.delete(examResultsTable).where(eq(examResultsTable.examId, Number(req.params.id)));
    await db.delete(examsTable).where(eq(examsTable.id, Number(req.params.id)));
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error", message: "Failed to delete exam" });
  }
});

router.get("/marks", requireAuth, async (req: AuthRequest, res) => {
  try {
    const schoolId = Number(req.query.schoolId) || req.user?.schoolId;
    if (!schoolId) return res.status(400).json({ error: "Bad request", message: "schoolId required" });
    const marks = await db.select().from(examResultsTable).where(eq(examResultsTable.schoolId, schoolId));
    return res.json({ marks });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error", message: "Failed to get marks" });
  }
});

router.get("/:examId/results", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { examId } = req.params;
    const results = await db.select().from(examResultsTable).where(eq(examResultsTable.examId, Number(examId)));
    const students = await db.select().from(studentsTable);
    const studentMap = new Map(students.map(s => [s.id, s]));
    const enriched = results.map(r => ({ ...r, student: studentMap.get(r.studentId) }));
    return res.json({ results: enriched });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error", message: "Failed to get results" });
  }
});

router.post("/:examId/results", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { examId } = req.params;
    const { results } = req.body;
    const exam = await db.select().from(examsTable).where(eq(examsTable.id, Number(examId))).limit(1);
    if (!exam.length) return res.status(404).json({ error: "Not found", message: "Exam not found" });

    for (const r of results) {
      const grade = calcGrade(r.marksObtained, exam[0].maxMarks);
      const existing = await db.select().from(examResultsTable).where(and(eq(examResultsTable.examId, Number(examId)), eq(examResultsTable.studentId, r.studentId))).limit(1);
      if (existing.length) {
        await db.update(examResultsTable).set({ marksObtained: r.marksObtained, grade, remarks: r.remarks }).where(eq(examResultsTable.id, existing[0].id));
      } else {
        await db.insert(examResultsTable).values({ examId: Number(examId), studentId: r.studentId, schoolId: exam[0].schoolId, marksObtained: r.marksObtained, grade, remarks: r.remarks });
      }
    }
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error", message: "Failed to save results" });
  }
});

router.get("/results/student/:studentId", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { studentId } = req.params;
    const { schoolId } = req.query;
    const effectiveSchoolId = schoolId ? Number(schoolId) : req.user?.schoolId;
    const results = await db.select().from(examResultsTable).where(and(eq(examResultsTable.studentId, Number(studentId)), eq(examResultsTable.schoolId, effectiveSchoolId!)));
    const examIds = [...new Set(results.map(r => r.examId))];
    const exams = examIds.length ? await db.select().from(examsTable).where(eq(examsTable.schoolId, effectiveSchoolId!)) : [];
    const examMap = new Map(exams.map(e => [e.id, e]));
    const enriched = results.map(r => ({ ...r, exam: examMap.get(r.examId) }));
    return res.json({ results: enriched });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error", message: "Failed to get student results" });
  }
});

function calcGrade(marks: number, maxMarks: number): string {
  const pct = (marks / maxMarks) * 100;
  if (pct >= 90) return "A+";
  if (pct >= 80) return "A";
  if (pct >= 70) return "B+";
  if (pct >= 60) return "B";
  if (pct >= 50) return "C+";
  if (pct >= 40) return "C";
  if (pct >= 35) return "D";
  return "F";
}

export default router;
