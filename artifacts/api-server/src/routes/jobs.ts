import { Router } from "express";
import { db } from "@workspace/db";
import { jobsTable, jobApplicationsTable, schoolsTable, usersTable } from "@workspace/db";
import { eq, and, like, count } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middlewares/auth.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { schoolId, subject, location, page = 1, limit = 20 } = req.query;
    const conditions: any[] = [eq(jobsTable.isActive, true)];
    if (schoolId) conditions.push(eq(jobsTable.schoolId, Number(schoolId)));
    if (subject) conditions.push(like(jobsTable.subject, `%${subject}%`));
    if (location) conditions.push(like(jobsTable.location, `%${location}%`));

    const [jobs, [{ total }], schools] = await Promise.all([
      db.select().from(jobsTable).where(and(...conditions))
        .limit(Number(limit)).offset((Number(page) - 1) * Number(limit)),
      db.select({ total: count() }).from(jobsTable).where(and(...conditions)),
      db.select({ id: schoolsTable.id, name: schoolsTable.name, city: schoolsTable.city, logoUrl: schoolsTable.logoUrl }).from(schoolsTable),
    ]);

    const schoolMap = new Map(schools.map(s => [s.id, s]));
    const enriched = jobs.map(j => ({
      ...j,
      schoolName: schoolMap.get(j.schoolId)?.name || null,
      schoolCity: schoolMap.get(j.schoolId)?.city || null,
      schoolLogoUrl: schoolMap.get(j.schoolId)?.logoUrl || null,
    }));

    return res.json({ jobs: enriched, total: Number(total) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error", message: "Failed to list jobs" });
  }
});

router.post("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { schoolId, title, subject, description, requirements, salary, jobType, experienceRequired, location, deadline } = req.body;
    const effectiveSchoolId = schoolId || req.user?.schoolId;
    if (!effectiveSchoolId || !title || !subject || !jobType) {
      return res.status(400).json({ error: "Bad request", message: "Missing required fields" });
    }
    const [job] = await db.insert(jobsTable).values({
      schoolId: effectiveSchoolId, title, subject, description, requirements,
      salary, jobType, experienceRequired, location, deadline,
    }).returning();
    return res.status(201).json({ ...job, schoolName: null, schoolCity: null, schoolLogoUrl: null });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error", message: "Failed to create job" });
  }
});

router.post("/:jobId/apply", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { coverLetter, resumeUrl } = req.body;
    if (!coverLetter) return res.status(400).json({ error: "Bad request", message: "coverLetter required" });
    const [application] = await db.insert(jobApplicationsTable).values({
      jobId: Number(req.params.jobId),
      applicantId: req.user!.userId,
      coverLetter, resumeUrl,
    }).returning();
    await db.update(jobsTable).set({ applicationCount: db.$count(jobApplicationsTable, eq(jobApplicationsTable.jobId, Number(req.params.jobId))) as any })
      .where(eq(jobsTable.id, Number(req.params.jobId)));
    return res.status(201).json({ ...application, applicantName: null });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error", message: "Failed to apply" });
  }
});

router.get("/applications", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { jobId, applicantId } = req.query;
    const conditions: any[] = [];
    if (jobId) conditions.push(eq(jobApplicationsTable.jobId, Number(jobId)));
    if (applicantId) conditions.push(eq(jobApplicationsTable.applicantId, Number(applicantId)));
    else conditions.push(eq(jobApplicationsTable.applicantId, req.user!.userId));

    const applications = await db.select().from(jobApplicationsTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    const userIds = [...new Set(applications.map(a => a.applicantId))];
    const users = userIds.length > 0 ? await db.select({ id: usersTable.id, name: usersTable.name }).from(usersTable) : [];
    const userMap = new Map(users.map(u => [u.id, u.name]));

    const enriched = applications.map(a => ({ ...a, applicantName: userMap.get(a.applicantId) || null }));
    return res.json({ applications: enriched, total: enriched.length });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error", message: "Failed to list applications" });
  }
});

router.get("/:jobId/applications", requireAuth, async (req: AuthRequest, res) => {
  try {
    const jobId = Number(req.params.jobId);
    const applications = await db.select().from(jobApplicationsTable).where(eq(jobApplicationsTable.jobId, jobId));
    const userIds = [...new Set(applications.map(a => a.applicantId))];
    const users = userIds.length > 0 ? await db.select({ id: usersTable.id, name: usersTable.name }).from(usersTable) : [];
    const userMap = new Map(users.map(u => [u.id, u.name]));
    const enriched = applications.map(a => ({ ...a, applicantName: userMap.get(a.applicantId) || null }));
    return res.json({ applications: enriched, total: enriched.length });
  } catch (err) { console.error(err); return res.status(500).json({ error: "Failed to list applications" }); }
});

router.patch("/applications/:appId", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "reviewed", "shortlisted", "rejected"];
    if (!validStatuses.includes(status)) return res.status(400).json({ error: "Invalid status" });
    const [updated] = await db.update(jobApplicationsTable).set({ status }).where(eq(jobApplicationsTable.id, Number(req.params.appId))).returning();
    if (!updated) return res.status(404).json({ error: "Application not found" });
    return res.json(updated);
  } catch (err) { console.error(err); return res.status(500).json({ error: "Failed to update application status" }); }
});

router.patch("/:jobId/applications/:appId/status", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "reviewed", "shortlisted", "rejected"];
    if (!validStatuses.includes(status)) return res.status(400).json({ error: "Invalid status" });
    const [updated] = await db.update(jobApplicationsTable).set({ status }).where(eq(jobApplicationsTable.id, Number(req.params.appId))).returning();
    if (!updated) return res.status(404).json({ error: "Application not found" });
    return res.json(updated);
  } catch (err) { console.error(err); return res.status(500).json({ error: "Failed to update application status" }); }
});

export default router;
