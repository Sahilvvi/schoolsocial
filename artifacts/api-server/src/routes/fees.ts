import { Router } from "express";
import { db } from "@workspace/db";
import { feesTable, studentsTable, classesTable } from "@workspace/db";
import { eq, and, count, sql } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middlewares/auth.js";

const router = Router();

router.get("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { schoolId, studentId, status } = req.query;
    const effectiveSchoolId = schoolId ? Number(schoolId) : req.user?.schoolId;
    if (!effectiveSchoolId) return res.status(400).json({ error: "Bad request", message: "schoolId required" });

    const conditions: any[] = [eq(feesTable.schoolId, effectiveSchoolId)];
    if (studentId) conditions.push(eq(feesTable.studentId, Number(studentId)));
    if (status) conditions.push(eq(feesTable.status, status as any));

    const [fees, students, classes] = await Promise.all([
      db.select().from(feesTable).where(and(...conditions)),
      db.select({ id: studentsTable.id, name: studentsTable.name, classId: studentsTable.classId }).from(studentsTable)
        .where(eq(studentsTable.schoolId, effectiveSchoolId)),
      db.select().from(classesTable).where(eq(classesTable.schoolId, effectiveSchoolId)),
    ]);

    const studentMap = new Map(students.map(s => [s.id, s]));
    const classMap = new Map(classes.map(c => [c.id, c]));

    const enriched = fees.map(f => {
      const student = studentMap.get(f.studentId);
      const cls = student?.classId ? classMap.get(student.classId) : null;
      return {
        ...f,
        amount: Number(f.amount),
        studentName: student?.name || null,
        className: cls ? `${cls.name}${cls.section ? "-" + cls.section : ""}` : null,
      };
    });

    const totalPending = enriched.filter(f => f.status === "pending").reduce((s, f) => s + f.amount, 0);
    const totalPaid = enriched.filter(f => f.status === "paid").reduce((s, f) => s + f.amount, 0);

    return res.json({ fees: enriched, total: enriched.length, totalPending, totalPaid });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error", message: "Failed to list fees" });
  }
});

router.post("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { schoolId, studentId, amount, feeType, dueDate, description } = req.body;
    const effectiveSchoolId = schoolId || req.user?.schoolId;
    if (!effectiveSchoolId || !studentId || !amount || !feeType || !dueDate) {
      return res.status(400).json({ error: "Bad request", message: "Missing required fields" });
    }
    const [fee] = await db.insert(feesTable).values({
      schoolId: effectiveSchoolId, studentId, amount: String(amount), feeType, dueDate, description,
    }).returning();
    return res.status(201).json({ ...fee, amount: Number(fee.amount), studentName: null, className: null });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error", message: "Failed to create fee" });
  }
});

router.patch("/:feeId", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { amount, feeType, dueDate, description, status } = req.body;
    const [fee] = await db.update(feesTable)
      .set({ amount: amount ? String(amount) : undefined, feeType, dueDate, description, status })
      .where(eq(feesTable.id, Number(req.params.feeId)))
      .returning();
    return res.json({ ...fee, amount: Number(fee.amount), studentName: null, className: null });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error", message: "Failed to update fee" });
  }
});

router.post("/:feeId/pay", requireAuth, async (req: AuthRequest, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const [fee] = await db.update(feesTable)
      .set({ status: "paid", paidDate: today })
      .where(eq(feesTable.id, Number(req.params.feeId)))
      .returning();
    return res.json({ ...fee, amount: Number(fee.amount), studentName: null, className: null });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error", message: "Failed to pay fee" });
  }
});

router.delete("/:feeId", requireAuth, async (req: AuthRequest, res) => {
  try {
    await db.delete(feesTable).where(eq(feesTable.id, Number(req.params.feeId)));
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error", message: "Failed to delete fee" });
  }
});

export default router;
