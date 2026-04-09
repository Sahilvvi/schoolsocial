import { Router } from "express";
import { db } from "@workspace/db";
import { assignmentsTable, assignmentSubmissionsTable, studentsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth, AuthRequest } from "../middlewares/auth";

const router = Router();

router.get("/", requireAuth, async (req: AuthRequest, res) => {
  const schoolId = Number(req.query.schoolId) || req.user?.schoolId;
  const { classId } = req.query;
  try {
    let assignments = await db.select().from(assignmentsTable).where(eq(assignmentsTable.schoolId, schoolId!));
    if (classId) assignments = assignments.filter(a => a.classId === Number(classId));
    return res.json({ assignments });
  } catch { return res.status(500).json({ error: "Failed" }); }
});

router.post("/", requireAuth, async (req: AuthRequest, res) => {
  const schoolId = req.user?.schoolId;
  try {
    const [assignment] = await db.insert(assignmentsTable).values({ ...req.body, schoolId }).returning();
    return res.json({ assignment });
  } catch { return res.status(500).json({ error: "Failed" }); }
});

router.delete("/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    await db.delete(assignmentsTable).where(eq(assignmentsTable.id, Number(req.params.id)));
    return res.json({ success: true });
  } catch { return res.status(500).json({ error: "Failed" }); }
});

router.get("/:assignmentId/submissions", requireAuth, async (req: AuthRequest, res) => {
  try {
    const subs = await db.select({
      id: assignmentSubmissionsTable.id, studentId: assignmentSubmissionsTable.studentId,
      note: assignmentSubmissionsTable.note, marksObtained: assignmentSubmissionsTable.marksObtained,
      feedback: assignmentSubmissionsTable.feedback, status: assignmentSubmissionsTable.status,
      submittedAt: assignmentSubmissionsTable.submittedAt, studentName: studentsTable.name,
    }).from(assignmentSubmissionsTable)
      .leftJoin(studentsTable, eq(assignmentSubmissionsTable.studentId, studentsTable.id))
      .where(eq(assignmentSubmissionsTable.assignmentId, Number(req.params.assignmentId)));
    return res.json({ submissions: subs });
  } catch { return res.status(500).json({ error: "Failed" }); }
});

router.post("/:assignmentId/submit", requireAuth, async (req: AuthRequest, res) => {
  const { studentId, note, schoolId } = req.body;
  try {
    const [sub] = await db.insert(assignmentSubmissionsTable).values({ assignmentId: Number(req.params.assignmentId), studentId, schoolId, note, status: "submitted" }).returning();
    return res.json({ submission: sub });
  } catch { return res.status(500).json({ error: "Failed" }); }
});

router.patch("/:assignmentId/submissions/:subId/grade", requireAuth, async (req: AuthRequest, res) => {
  try {
    const [sub] = await db.update(assignmentSubmissionsTable).set({ marksObtained: req.body.marks, feedback: req.body.feedback, status: "graded" }).where(eq(assignmentSubmissionsTable.id, Number(req.params.subId))).returning();
    return res.json({ submission: sub });
  } catch { return res.status(500).json({ error: "Failed" }); }
});

export default router;
