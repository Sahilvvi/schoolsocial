import { Router } from "express";
import { db } from "@workspace/db";
import { disciplineRecordsTable, studentsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth, AuthRequest } from "../middlewares/auth";

const router = Router();

router.get("/", requireAuth, async (req: AuthRequest, res) => {
  const schoolId = Number(req.query.schoolId) || req.user?.schoolId;
  try {
    const records = await db.select({
      id: disciplineRecordsTable.id, studentId: disciplineRecordsTable.studentId,
      incidentType: disciplineRecordsTable.incidentType, description: disciplineRecordsTable.description,
      severity: disciplineRecordsTable.severity, status: disciplineRecordsTable.status,
      actionTaken: disciplineRecordsTable.actionTaken, incidentDate: disciplineRecordsTable.incidentDate,
      createdAt: disciplineRecordsTable.createdAt, studentName: studentsTable.name,
    }).from(disciplineRecordsTable)
      .leftJoin(studentsTable, eq(disciplineRecordsTable.studentId, studentsTable.id))
      .where(eq(disciplineRecordsTable.schoolId, schoolId!));
    return res.json({ records });
  } catch { return res.status(500).json({ error: "Failed" }); }
});

router.post("/", requireAuth, async (req: AuthRequest, res) => {
  const schoolId = req.user?.schoolId;
  try {
    const [record] = await db.insert(disciplineRecordsTable).values({ ...req.body, schoolId, reportedBy: req.user?.userId }).returning();
    return res.json({ record });
  } catch { return res.status(500).json({ error: "Failed" }); }
});

router.patch("/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const [record] = await db.update(disciplineRecordsTable).set(req.body).where(eq(disciplineRecordsTable.id, Number(req.params.id))).returning();
    return res.json({ record });
  } catch { return res.status(500).json({ error: "Failed" }); }
});

router.delete("/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    await db.delete(disciplineRecordsTable).where(eq(disciplineRecordsTable.id, Number(req.params.id)));
    return res.json({ success: true });
  } catch { return res.status(500).json({ error: "Failed" }); }
});

export default router;
