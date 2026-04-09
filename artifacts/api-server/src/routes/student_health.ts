import { Router } from "express";
import { db } from "@workspace/db";
import { studentHealthTable, studentsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middlewares/auth.js";

const router = Router();

router.get("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { schoolId, studentId } = req.query;
    const effectiveSchoolId = schoolId ? Number(schoolId) : req.user?.schoolId;
    const conditions: any[] = [eq(studentHealthTable.schoolId, effectiveSchoolId!)];
    if (studentId) conditions.push(eq(studentHealthTable.studentId, Number(studentId)));
    const records = await db.select().from(studentHealthTable)
      .where(and(...conditions)).orderBy(studentHealthTable.createdAt);
    const students = await db.select({ id: studentsTable.id, name: studentsTable.name, admissionNo: studentsTable.admissionNo })
      .from(studentsTable).where(eq(studentsTable.schoolId, effectiveSchoolId!));
    const studentMap = new Map(students.map(s => [s.id, s]));
    const enriched = records.map(r => ({ ...r, studentName: studentMap.get(r.studentId)?.name || "Unknown", admissionNo: studentMap.get(r.studentId)?.admissionNo || "" })).reverse();
    return res.json({ records: enriched });
  } catch (err) { console.error(err); return res.status(500).json({ error: "Failed" }); }
});

router.post("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const effectiveSchoolId = req.body.schoolId || req.user?.schoolId;
    const { studentId, recordDate, height, weight, bloodPressure, vision, hearing, allergies, medications, conditions, notes, recordedBy } = req.body;
    if (!studentId || !recordDate) return res.status(400).json({ error: "studentId and recordDate required" });
    const [record] = await db.insert(studentHealthTable).values({ schoolId: effectiveSchoolId, studentId, recordDate, height, weight, bloodPressure, vision, hearing, allergies, medications, conditions, notes, recordedBy }).returning();
    return res.status(201).json({ record });
  } catch (err) { return res.status(500).json({ error: "Failed" }); }
});

router.patch("/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { height, weight, bloodPressure, vision, hearing, allergies, medications, conditions, notes, recordedBy } = req.body;
    const [updated] = await db.update(studentHealthTable).set({ height, weight, bloodPressure, vision, hearing, allergies, medications, conditions, notes, recordedBy }).where(eq(studentHealthTable.id, Number(req.params.id))).returning();
    return res.json({ record: updated });
  } catch (err) { return res.status(500).json({ error: "Failed" }); }
});

router.delete("/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    await db.delete(studentHealthTable).where(eq(studentHealthTable.id, Number(req.params.id)));
    return res.json({ success: true });
  } catch (err) { return res.status(500).json({ error: "Failed" }); }
});

export default router;
