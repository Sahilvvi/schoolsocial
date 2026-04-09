import { Router } from "express";
import { db } from "@workspace/db";
import { schoolsTable, studentsTable, teachersTable, usersTable, jobsTable, reviewsTable, feesTable, auditLogsTable } from "@workspace/db";
import { count, eq, sql, sum } from "drizzle-orm";
import { requireAuth, requireRole, type AuthRequest } from "../middlewares/auth.js";

const router = Router();

router.get("/stats", requireAuth, requireRole("super_admin"), async (_req, res) => {
  try {
    const [[{ totalSchools }], [{ pendingSchools }], [{ totalStudents }], [{ totalTeachers }], [{ totalJobs }], [{ totalReviews }], [{ activeParents }], [{ totalRevenue }]] = await Promise.all([
      db.select({ totalSchools: count() }).from(schoolsTable),
      db.select({ pendingSchools: count() }).from(schoolsTable).where(eq(schoolsTable.status, "pending")),
      db.select({ totalStudents: count() }).from(studentsTable),
      db.select({ totalTeachers: count() }).from(teachersTable),
      db.select({ totalJobs: count() }).from(jobsTable),
      db.select({ totalReviews: count() }).from(reviewsTable),
      db.select({ activeParents: count() }).from(usersTable).where(eq(usersTable.role, "parent")),
      db.select({ totalRevenue: sum(feesTable.amount) }).from(feesTable).where(eq(feesTable.status, "paid")),
    ]);

    return res.json({
      totalSchools: Number(totalSchools),
      pendingSchools: Number(pendingSchools),
      totalStudents: Number(totalStudents),
      totalTeachers: Number(totalTeachers),
      activeParents: Number(activeParents),
      totalRevenue: Number(totalRevenue) || 0,
      monthlyGrowth: 12.5,
      totalJobs: Number(totalJobs),
      totalReviews: Number(totalReviews),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error", message: "Failed to get platform stats" });
  }
});

router.get("/users", requireAuth, requireRole("super_admin"), async (req: AuthRequest, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const users = await db.select({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
      role: usersTable.role,
      schoolId: usersTable.schoolId,
      createdAt: usersTable.createdAt,
      schoolName: schoolsTable.name,
    }).from(usersTable)
      .leftJoin(schoolsTable, eq(usersTable.schoolId, schoolsTable.id))
      .limit(Number(limit)).offset(offset)
      .orderBy(usersTable.createdAt);

    const [{ total }] = await db.select({ total: count() }).from(usersTable);
    const roleCounts = await db.select({ role: usersTable.role, cnt: count() }).from(usersTable).groupBy(usersTable.role);
    const roleStats = Object.fromEntries(roleCounts.map(r => [r.role, Number(r.cnt)]));

    return res.json({
      users: users.reverse().map(u => ({ ...u, status: "active" })),
      total: Number(total),
      roleStats,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error", message: "Failed to get users" });
  }
});

router.get("/revenue", requireAuth, requireRole("super_admin"), async (_req, res) => {
  try {
    const result = await db.execute(sql`
      SELECT 
        TO_CHAR(created_at, 'Mon') as month,
        EXTRACT(MONTH FROM created_at)::int as month_num,
        EXTRACT(YEAR FROM created_at)::int as year,
        COALESCE(SUM(CASE WHEN status = 'paid' THEN amount::numeric ELSE 0 END), 0) as revenue,
        COUNT(*) as transactions
      FROM fees
      GROUP BY TO_CHAR(created_at, 'Mon'), EXTRACT(MONTH FROM created_at), EXTRACT(YEAR FROM created_at)
      ORDER BY year DESC, month_num DESC
      LIMIT 12
    `);

    const rows = (result as any).rows || [];
    const chartData = rows.reverse().map((r: any) => ({
      month: r.month,
      revenue: Number(r.revenue) || 0,
      transactions: Number(r.transactions) || 0,
    }));

    const [{ totalCollected }] = await db.select({ totalCollected: sum(feesTable.amount) }).from(feesTable).where(eq(feesTable.status, "paid"));
    const [{ totalPending }] = await db.select({ totalPending: sum(feesTable.amount) }).from(feesTable).where(eq(feesTable.status, "pending"));
    const planCounts = await db.select({ plan: schoolsTable.subscriptionPlan, cnt: count() }).from(schoolsTable).groupBy(schoolsTable.subscriptionPlan);

    return res.json({
      chartData,
      totalCollected: Number(totalCollected) || 0,
      totalPending: Number(totalPending) || 0,
      planData: planCounts.map(p => ({ plan: p.plan, count: Number(p.cnt) })),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error", message: "Failed to get revenue" });
  }
});

router.get("/growth", requireAuth, requireRole("super_admin"), async (_req, res) => {
  try {
    const schoolResult = await db.execute(sql`
      SELECT TO_CHAR(created_at, 'Mon') as month,
             EXTRACT(MONTH FROM created_at)::int as month_num,
             EXTRACT(YEAR FROM created_at)::int as year,
             COUNT(*) as schools
      FROM schools
      WHERE created_at >= NOW() - INTERVAL '9 months'
      GROUP BY TO_CHAR(created_at, 'Mon'), EXTRACT(MONTH FROM created_at), EXTRACT(YEAR FROM created_at)
      ORDER BY year ASC, month_num ASC
    `);
    const studentResult = await db.execute(sql`
      SELECT TO_CHAR(created_at, 'Mon') as month,
             EXTRACT(MONTH FROM created_at)::int as month_num,
             EXTRACT(YEAR FROM created_at)::int as year,
             COUNT(*) as students
      FROM students
      WHERE created_at >= NOW() - INTERVAL '9 months'
      GROUP BY TO_CHAR(created_at, 'Mon'), EXTRACT(MONTH FROM created_at), EXTRACT(YEAR FROM created_at)
      ORDER BY year ASC, month_num ASC
    `);
    const schoolRows = (schoolResult as any).rows || [];
    const studentRows = (studentResult as any).rows || [];
    const monthMap = new Map<string, any>();
    for (const r of schoolRows) monthMap.set(r.month, { month: r.month, schools: Number(r.schools), students: 0 });
    for (const r of studentRows) {
      if (monthMap.has(r.month)) monthMap.get(r.month)!.students = Number(r.students);
      else monthMap.set(r.month, { month: r.month, schools: 0, students: Number(r.students) });
    }
    return res.json({ chartData: Array.from(monthMap.values()) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error", message: "Failed to get growth data" });
  }
});

router.get("/audit-logs", requireAuth, requireRole("super_admin"), async (req: AuthRequest, res) => {
  try {
    const { page = "1", limit = "50", search = "" } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const allLogs = await db.select().from(auditLogsTable).orderBy(auditLogsTable.createdAt);
    const allUsers = await db.select({ id: usersTable.id, name: usersTable.name, email: usersTable.email, role: usersTable.role }).from(usersTable);
    const userMap = new Map(allUsers.map(u => [u.id, u]));
    let logs = allLogs.reverse().map(l => ({ ...l, user: userMap.get(l.userId) || null }));
    if (search) {
      const q = (search as string).toLowerCase();
      logs = logs.filter(l => l.action?.toLowerCase().includes(q) || l.entity?.toLowerCase().includes(q) || l.user?.name?.toLowerCase().includes(q));
    }
    const total = logs.length;
    return res.json({ logs: logs.slice(offset, offset + Number(limit)), total, page: Number(page), limit: Number(limit) });
  } catch (err) { console.error(err); return res.status(500).json({ error: "Failed to get audit logs" }); }
});

export default router;
