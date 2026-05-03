import { Router } from "express";
import { db } from "@workspace/db";
import { payrollTable, teachersTable } from "@workspace/db";
import { eq, and } from "@workspace/db";
import { requireAuth, AuthRequest } from "../middlewares/auth";

const router = Router();

router.get("/", requireAuth, async (req: AuthRequest, res) => {
  const schoolId = Number(req.query.schoolId) || req.user?.schoolId;
  const { month, year } = req.query;
  try {
    let q = db.select({
      id: payrollTable.id, teacherId: payrollTable.teacherId, month: payrollTable.month,
      year: payrollTable.year, basicSalary: payrollTable.basicSalary, allowances: payrollTable.allowances,
      deductions: payrollTable.deductions, netSalary: payrollTable.netSalary,
      paidDate: payrollTable.paidDate, status: payrollTable.status, notes: payrollTable.notes,
      teacherName: teachersTable.name, qualification: teachersTable.qualification,
    }).from(payrollTable).leftJoin(teachersTable, eq(payrollTable.teacherId, teachersTable.id))
      .where(eq(payrollTable.schoolId, schoolId!));
    const records = await q;
    return res.json({ records: month ? records.filter(r => r.month === month && (!year || r.year === Number(year))) : records });
  } catch { return res.status(500).json({ error: "Failed" }); }
});

router.post("/", requireAuth, async (req: AuthRequest, res) => {
  const schoolId = req.user?.schoolId;
  try {
    const net = Number(req.body.basicSalary) + Number(req.body.allowances || 0) - Number(req.body.deductions || 0);
    const [record] = await db.insert(payrollTable).values({ ...req.body, schoolId, netSalary: String(net) }).returning();
    return res.json({ record });
  } catch { return res.status(500).json({ error: "Failed" }); }
});

router.patch("/:id/pay", requireAuth, async (req: AuthRequest, res) => {
  try {
    const [record] = await db.update(payrollTable).set({ status: "paid", paidDate: new Date().toISOString().split("T")[0] }).where(eq(payrollTable.id, Number(req.params.id))).returning();
    return res.json({ record });
  } catch { return res.status(500).json({ error: "Failed" }); }
});

router.delete("/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    await db.delete(payrollTable).where(eq(payrollTable.id, Number(req.params.id)));
    return res.json({ success: true });
  } catch { return res.status(500).json({ error: "Failed" }); }
});

export default router;
