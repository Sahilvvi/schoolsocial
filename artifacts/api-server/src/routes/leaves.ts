import { Router } from "express";
import { db } from "@workspace/db";
import { teacherLeavesTable, teachersTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middlewares/auth.js";

const router = Router();

router.get("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { schoolId, teacherId, status } = req.query;
    const effectiveSchoolId = schoolId ? Number(schoolId) : req.user?.schoolId;
    if (!effectiveSchoolId) return res.status(400).json({ error: "Bad request", message: "schoolId required" });

    const conditions: any[] = [eq(teacherLeavesTable.schoolId, effectiveSchoolId)];
    if (teacherId) conditions.push(eq(teacherLeavesTable.teacherId, Number(teacherId)));
    if (status) conditions.push(eq(teacherLeavesTable.status, status as any));

    const leaves = await db.select().from(teacherLeavesTable).where(and(...conditions)).orderBy(teacherLeavesTable.createdAt);
    const teachers = await db.select().from(teachersTable).where(eq(teachersTable.schoolId, effectiveSchoolId));
    const teacherMap = new Map(teachers.map(t => [t.id, t.name]));
    const enriched = leaves.map(l => ({ ...l, teacherName: teacherMap.get(l.teacherId) || "Unknown" })).reverse();
    return res.json({ leaves: enriched });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error", message: "Failed to get leaves" });
  }
});

router.post("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { schoolId, teacherId, leaveType, fromDate, toDate, reason } = req.body;
    const effectiveSchoolId = schoolId || req.user?.schoolId;
    if (!effectiveSchoolId || !teacherId || !fromDate || !toDate || !reason) {
      return res.status(400).json({ error: "Bad request", message: "Missing required fields" });
    }
    const [leave] = await db.insert(teacherLeavesTable).values({
      schoolId: effectiveSchoolId, teacherId, leaveType: leaveType || "casual", fromDate, toDate, reason,
    }).returning();
    return res.status(201).json(leave);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error", message: "Failed to create leave request" });
  }
});

router.put("/:id/status", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { status, adminNote } = req.body;
    const [updated] = await db.update(teacherLeavesTable).set({ status, adminNote }).where(eq(teacherLeavesTable.id, Number(req.params.id))).returning();
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error", message: "Failed to update leave status" });
  }
});

export default router;
