import { Router } from "express";
import { db } from "@workspace/db";
import { ptmSlotsTable, teachersTable, studentsTable } from "@workspace/db";
import { eq, and } from "@workspace/db";
import { requireAuth, AuthRequest } from "../middlewares/auth";

const router = Router();

router.get("/", requireAuth, async (req: AuthRequest, res) => {
  const schoolId = Number(req.query.schoolId) || req.user?.schoolId;
  const { teacherId } = req.query;
  try {
    const slots = await db.select({
      id: ptmSlotsTable.id, teacherId: ptmSlotsTable.teacherId, date: ptmSlotsTable.date,
      startTime: ptmSlotsTable.startTime, endTime: ptmSlotsTable.endTime, status: ptmSlotsTable.status,
      parentId: ptmSlotsTable.parentId, studentId: ptmSlotsTable.studentId, notes: ptmSlotsTable.notes,
      teacherName: teachersTable.name, studentName: studentsTable.name,
    }).from(ptmSlotsTable)
      .leftJoin(teachersTable, eq(ptmSlotsTable.teacherId, teachersTable.id))
      .leftJoin(studentsTable, eq(ptmSlotsTable.studentId, studentsTable.id))
      .where(eq(ptmSlotsTable.schoolId, schoolId!));
    return res.json({ slots: teacherId ? slots.filter(s => s.teacherId === Number(teacherId)) : slots });
  } catch { return res.status(500).json({ error: "Failed" }); }
});

router.post("/", requireAuth, async (req: AuthRequest, res) => {
  const schoolId = req.user?.schoolId;
  try {
    const [slot] = await db.insert(ptmSlotsTable).values({ ...req.body, schoolId }).returning();
    return res.json({ slot });
  } catch { return res.status(500).json({ error: "Failed" }); }
});

router.patch("/:id/book", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { parentId, studentId, notes } = req.body;
    const [slot] = await db.update(ptmSlotsTable).set({ status: "booked", parentId, studentId, notes, bookedBy: req.user?.userId }).where(eq(ptmSlotsTable.id, Number(req.params.id))).returning();
    return res.json({ slot });
  } catch { return res.status(500).json({ error: "Failed" }); }
});

router.patch("/:id/cancel", requireAuth, async (req: AuthRequest, res) => {
  try {
    const [slot] = await db.update(ptmSlotsTable).set({ status: "cancelled", parentId: null, studentId: null, bookedBy: null }).where(eq(ptmSlotsTable.id, Number(req.params.id))).returning();
    return res.json({ slot });
  } catch { return res.status(500).json({ error: "Failed" }); }
});

router.delete("/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    await db.delete(ptmSlotsTable).where(eq(ptmSlotsTable.id, Number(req.params.id)));
    return res.json({ success: true });
  } catch { return res.status(500).json({ error: "Failed" }); }
});

export default router;
