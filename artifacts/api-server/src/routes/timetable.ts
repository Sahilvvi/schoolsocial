import { Router } from "express";
import { db } from "@workspace/db";
import { timetableTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middlewares/auth.js";

const router = Router();

router.get("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { schoolId, classId } = req.query;
    const effectiveSchoolId = schoolId ? Number(schoolId) : req.user?.schoolId;
    if (!effectiveSchoolId) return res.status(400).json({ error: "Bad request", message: "schoolId required" });

    const conditions: any[] = [eq(timetableTable.schoolId, effectiveSchoolId)];
    if (classId) conditions.push(eq(timetableTable.classId, Number(classId)));

    const entries = await db.select().from(timetableTable).where(and(...conditions)).orderBy(timetableTable.dayOfWeek, timetableTable.periodNumber);
    return res.json({ timetable: entries });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error", message: "Failed to get timetable" });
  }
});

router.post("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { schoolId, classId, teacherId, dayOfWeek, periodNumber, subject, startTime, endTime } = req.body;
    const effectiveSchoolId = schoolId || req.user?.schoolId;
    if (!effectiveSchoolId || !classId || !dayOfWeek || !periodNumber || !subject || !startTime || !endTime) {
      return res.status(400).json({ error: "Bad request", message: "Missing required fields" });
    }
    const [entry] = await db.insert(timetableTable).values({
      schoolId: effectiveSchoolId, classId, teacherId: teacherId || null,
      dayOfWeek, periodNumber, subject, startTime, endTime,
    }).returning();
    return res.status(201).json(entry);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error", message: "Failed to create timetable entry" });
  }
});

router.put("/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { subject, teacherId, startTime, endTime } = req.body;
    const [updated] = await db.update(timetableTable).set({ subject, teacherId, startTime, endTime }).where(eq(timetableTable.id, Number(id))).returning();
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error", message: "Failed to update timetable entry" });
  }
});

router.delete("/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    await db.delete(timetableTable).where(eq(timetableTable.id, Number(req.params.id)));
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error", message: "Failed to delete timetable entry" });
  }
});

export default router;
