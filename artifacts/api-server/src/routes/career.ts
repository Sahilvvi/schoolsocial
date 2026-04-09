import { Router } from "express";
import { db } from "@workspace/db";
import { savedJobsTable, jobSeekerProfilesTable, jobsTable, schoolsTable } from "@workspace/db";
import { eq, and, inArray } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middlewares/auth.js";

const router = Router();

router.get("/profile", requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.userId;
    const [profile] = await db.select().from(jobSeekerProfilesTable).where(eq(jobSeekerProfilesTable.userId, userId));
    return res.json({ profile: profile || null });
  } catch (err) { console.error(err); return res.status(500).json({ error: "Failed to get profile" }); }
});

router.put("/profile", requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.userId;
    const { phone, subject, experience, qualification, bio, location, resumeUrl } = req.body;
    const [existing] = await db.select().from(jobSeekerProfilesTable).where(eq(jobSeekerProfilesTable.userId, userId));
    if (existing) {
      const [updated] = await db.update(jobSeekerProfilesTable)
        .set({ phone, subject, experience, qualification, bio, location, resumeUrl, updatedAt: new Date() })
        .where(eq(jobSeekerProfilesTable.userId, userId)).returning();
      return res.json({ profile: updated });
    } else {
      const [created] = await db.insert(jobSeekerProfilesTable)
        .values({ userId, phone, subject, experience, qualification, bio, location, resumeUrl }).returning();
      return res.json({ profile: created });
    }
  } catch (err) { console.error(err); return res.status(500).json({ error: "Failed to update profile" }); }
});

router.get("/saved-jobs", requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.userId;
    const saved = await db.select().from(savedJobsTable).where(eq(savedJobsTable.userId, userId));
    const jobIds = saved.map(s => s.jobId);
    if (!jobIds.length) return res.json({ jobs: [], savedIds: [] });
    const jobs = await db.select().from(jobsTable).where(inArray(jobsTable.id, jobIds));
    const schoolIds = [...new Set(jobs.map(j => j.schoolId).filter(Boolean))];
    let schoolMap = new Map();
    if (schoolIds.length) {
      const schools = await db.select({ id: schoolsTable.id, name: schoolsTable.name }).from(schoolsTable).where(inArray(schoolsTable.id, schoolIds as number[]));
      schools.forEach(s => schoolMap.set(s.id, s.name));
    }
    const enriched = jobs.map(j => ({ ...j, schoolName: schoolMap.get(j.schoolId) || null }));
    return res.json({ jobs: enriched, savedIds: jobIds });
  } catch (err) { console.error(err); return res.status(500).json({ error: "Failed to get saved jobs" }); }
});

router.post("/saved-jobs/:jobId", requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.userId;
    const jobId = Number(req.params.jobId);
    const [existing] = await db.select().from(savedJobsTable).where(and(eq(savedJobsTable.userId, userId), eq(savedJobsTable.jobId, jobId)));
    if (!existing) await db.insert(savedJobsTable).values({ userId, jobId });
    return res.json({ saved: true });
  } catch (err) { console.error(err); return res.status(500).json({ error: "Failed to save job" }); }
});

router.delete("/saved-jobs/:jobId", requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.userId;
    const jobId = Number(req.params.jobId);
    await db.delete(savedJobsTable).where(and(eq(savedJobsTable.userId, userId), eq(savedJobsTable.jobId, jobId)));
    return res.json({ saved: false });
  } catch (err) { console.error(err); return res.status(500).json({ error: "Failed to unsave job" }); }
});

export default router;
