import { Router } from "express";
import { db } from "@workspace/db";
import { admissionInquiriesTable, schoolBlogTable, feeStructuresTable, schoolPlansTable, schoolsTable } from "@workspace/db";
import { eq, desc } from "@workspace/db";
import { requireAuth, AuthRequest } from "../middlewares/auth";

const router = Router();

router.post("/inquiry", async (req, res) => {
  const { schoolId, parentName, parentEmail, parentPhone, studentName, gradeApplying, message } = req.body;
  try {
    const [inq] = await db.insert(admissionInquiriesTable).values({ schoolId, parentName, parentEmail, parentPhone, studentName, gradeApplying, message }).returning();
    return res.json({ inquiry: inq });
  } catch { return res.status(500).json({ error: "Failed" }); }
});

router.get("/inquiry", requireAuth, async (req: AuthRequest, res) => {
  const schoolId = Number(req.query.schoolId) || req.user?.schoolId;
  try {
    const inquiries = await db.select().from(admissionInquiriesTable).where(eq(admissionInquiriesTable.schoolId, schoolId!)).orderBy(desc(admissionInquiriesTable.createdAt));
    return res.json({ inquiries });
  } catch { return res.status(500).json({ error: "Failed" }); }
});

router.patch("/inquiry/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const [inq] = await db.update(admissionInquiriesTable).set(req.body).where(eq(admissionInquiriesTable.id, Number(req.params.id))).returning();
    return res.json({ inquiry: inq });
  } catch { return res.status(500).json({ error: "Failed" }); }
});

router.get("/blog", async (req, res) => {
  const { schoolId, slug } = req.query;
  try {
    let resolvedSchoolId = schoolId ? Number(schoolId) : undefined;
    if (!resolvedSchoolId && slug) {
      const [school] = await db.select({ id: schoolsTable.id, name: schoolsTable.name }).from(schoolsTable).where(eq(schoolsTable.slug, String(slug))).limit(1);
      if (school) resolvedSchoolId = school.id;
    }
    let posts = await db.select().from(schoolBlogTable).orderBy(desc(schoolBlogTable.createdAt));
    if (resolvedSchoolId) posts = posts.filter(p => p.schoolId === resolvedSchoolId);
    const school = resolvedSchoolId ? await db.select({ name: schoolsTable.name }).from(schoolsTable).where(eq(schoolsTable.id, resolvedSchoolId)).limit(1).then(r => r[0]) : null;
    return res.json({ posts, schoolName: school?.name || "" });
  } catch { return res.status(500).json({ error: "Failed" }); }
});

router.post("/blog", requireAuth, async (req: AuthRequest, res) => {
  const schoolId = req.user?.schoolId;
  try {
    const [post] = await db.insert(schoolBlogTable).values({ ...req.body, schoolId, authorId: req.user?.userId }).returning();
    return res.json({ post });
  } catch { return res.status(500).json({ error: "Failed" }); }
});

router.delete("/blog/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    await db.delete(schoolBlogTable).where(eq(schoolBlogTable.id, Number(req.params.id)));
    return res.json({ success: true });
  } catch { return res.status(500).json({ error: "Failed" }); }
});

router.get("/fee-structures", async (req, res) => {
  const { schoolId } = req.query;
  try {
    const structures = await db.select().from(feeStructuresTable).where(eq(feeStructuresTable.schoolId, Number(schoolId)));
    return res.json({ structures });
  } catch { return res.status(500).json({ error: "Failed" }); }
});

router.post("/fee-structures", requireAuth, async (req: AuthRequest, res) => {
  const schoolId = req.user?.schoolId;
  try {
    const [s] = await db.insert(feeStructuresTable).values({ ...req.body, schoolId }).returning();
    return res.json({ structure: s });
  } catch { return res.status(500).json({ error: "Failed" }); }
});

router.delete("/fee-structures/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    await db.delete(feeStructuresTable).where(eq(feeStructuresTable.id, Number(req.params.id)));
    return res.json({ success: true });
  } catch { return res.status(500).json({ error: "Failed" }); }
});

router.get("/plans", requireAuth, async (req: AuthRequest, res) => {
  try {
    const plans = await db.select({
      id: schoolPlansTable.id, schoolId: schoolPlansTable.schoolId, plan: schoolPlansTable.plan,
      maxStudents: schoolPlansTable.maxStudents, maxTeachers: schoolPlansTable.maxTeachers,
      features: schoolPlansTable.features, startDate: schoolPlansTable.startDate, endDate: schoolPlansTable.endDate,
      monthlyFee: schoolPlansTable.monthlyFee, status: schoolPlansTable.status,
      schoolName: schoolsTable.name,
    }).from(schoolPlansTable).leftJoin(schoolsTable, eq(schoolPlansTable.schoolId, schoolsTable.id));
    return res.json({ plans });
  } catch { return res.status(500).json({ error: "Failed" }); }
});

router.post("/plans", requireAuth, async (req: AuthRequest, res) => {
  try {
    const [plan] = await db.insert(schoolPlansTable).values(req.body).returning();
    return res.json({ plan });
  } catch { return res.status(500).json({ error: "Failed" }); }
});

router.patch("/plans/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const [plan] = await db.update(schoolPlansTable).set(req.body).where(eq(schoolPlansTable.id, Number(req.params.id))).returning();
    return res.json({ plan });
  } catch { return res.status(500).json({ error: "Failed" }); }
});

export default router;
