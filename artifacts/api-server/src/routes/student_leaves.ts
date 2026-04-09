import { Router } from "express";
import { db } from "@workspace/db";
import { studentLeavesTable, studentsTable } from "@workspace/db";
import { eq, and } from "@workspace/db";
import { requireAuth, type AuthRequest } from "../middlewares/auth.js";

const router = Router();

router.get("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { schoolId, studentId, status } = req.query;
    const effectiveSchoolId = schoolId ? Number(schoolId) : req.user?.schoolId;
    const conditions: any[] = [eq(studentLeavesTable.schoolId, effectiveSchoolId!)];
    if (studentId) conditions.push(eq(studentLeavesTable.studentId, Number(studentId)));
    if (status) conditions.push(eq(studentLeavesTable.status, status as any));
    const leaves = await db.select().from(studentLeavesTable).where(and(...conditions)).orderBy(studentLeavesTable.createdAt);
    const students = await db.select({ id: studentsTable.id, name: studentsTable.name }).from(studentsTable).where(eq(studentsTable.schoolId, effectiveSchoolId!));
    const studentMap = new Map(students.map(s => [s.id, s.name]));
    const enriched = leaves.map(l => ({ ...l, studentName: studentMap.get(l.studentId) || "Unknown" })).reverse();
    return res.json({ leaves: enriched });
  } catch (err) { return res.status(500).json({ error: "Failed" }); }
});

router.post("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const effectiveSchoolId = req.body.schoolId || req.user?.schoolId;
    const { studentId, leaveType, fromDate, toDate, reason, appliedBy } = req.body;
    if (!studentId || !fromDate || !toDate || !reason) return res.status(400).json({ error: "Missing required fields" });
    const [leave] = await db.insert(studentLeavesTable).values({ schoolId: effectiveSchoolId, studentId, leaveType: leaveType || "sick", fromDate, toDate, reason, appliedBy: appliedBy || "student" }).returning();
    return res.status(201).json({ leave });
  } catch (err) { return res.status(500).json({ error: "Failed" }); }
});

router.put("/:id/status", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { status, adminNote } = req.body;
    const [updated] = await db.update(studentLeavesTable).set({ status, adminNote }).where(eq(studentLeavesTable.id, Number(req.params.id))).returning();
    return res.json({ leave: updated });
  } catch (err) { return res.status(500).json({ error: "Failed" }); }
});

export default router;
