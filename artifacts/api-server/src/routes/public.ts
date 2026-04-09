import { Router } from "express";
import { db } from "@workspace/db";
import { schoolsTable, eventsTable, reviewsTable, jobsTable, studentsTable, teachersTable } from "@workspace/db";
import { eq, and, like, count, sql } from "drizzle-orm";

const router = Router();

router.get("/schools", async (req, res) => {
  try {
    const { q, city, board, page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const conditions: any[] = [eq(schoolsTable.status, "approved")];
    if (q) conditions.push(like(schoolsTable.name, `%${q}%`));
    if (city) conditions.push(like(schoolsTable.city, `%${city}%`));
    if (board) conditions.push(like(schoolsTable.board, `%${board}%`));

    const [schools, [{ total }]] = await Promise.all([
      db.select().from(schoolsTable).where(and(...conditions)).limit(Number(limit)).offset(offset),
      db.select({ total: count() }).from(schoolsTable).where(and(...conditions)),
    ]);

    return res.json({ schools, total: Number(total), page: Number(page), limit: Number(limit) });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error", message: "Failed to search schools" });
  }
});

router.get("/schools/:slug", async (req, res) => {
  try {
    const [school] = await db.select().from(schoolsTable).where(eq(schoolsTable.slug, req.params.slug)).limit(1);
    if (!school) return res.status(404).json({ error: "Not found", message: "School not found" });

    const [events, reviews, jobs, [{ totalStudents }], [{ totalTeachers }]] = await Promise.all([
      db.select().from(eventsTable).where(and(eq(eventsTable.schoolId, school.id), eq(eventsTable.isPublic, true))).limit(5),
      db.select().from(reviewsTable).where(and(eq(reviewsTable.schoolId, school.id), eq(reviewsTable.approved, true))).limit(10),
      db.select().from(jobsTable).where(and(eq(jobsTable.schoolId, school.id), eq(jobsTable.isActive, true))).limit(5),
      db.select({ totalStudents: count() }).from(studentsTable).where(eq(studentsTable.schoolId, school.id)),
      db.select({ totalTeachers: count() }).from(teachersTable).where(eq(teachersTable.schoolId, school.id)),
    ]);

    const approvedReviews = reviews.map(r => ({ ...r, overallRating: Number(r.overallRating) }));
    const avgRating = approvedReviews.length > 0
      ? approvedReviews.reduce((s, r) => s + r.overallRating, 0) / approvedReviews.length
      : 0;

    return res.json({
      school,
      events: events.map(e => ({ ...e, schoolName: school.name, schoolLogoUrl: school.logoUrl })),
      reviews: approvedReviews,
      jobs: jobs.map(j => ({ ...j, schoolName: school.name, schoolCity: school.city, schoolLogoUrl: school.logoUrl })),
      stats: { totalStudents: Number(totalStudents), totalTeachers: Number(totalTeachers), averageRating: avgRating },
    });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error", message: "Failed to get school profile" });
  }
});

router.get("/feed", async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const [events, [{ total }], schools] = await Promise.all([
      db.select().from(eventsTable)
        .where(eq(eventsTable.isPublic, true))
        .orderBy(eventsTable.createdAt)
        .limit(Number(limit)).offset((Number(page) - 1) * Number(limit)),
      db.select({ total: count() }).from(eventsTable).where(eq(eventsTable.isPublic, true)),
      db.select({ id: schoolsTable.id, name: schoolsTable.name, logoUrl: schoolsTable.logoUrl }).from(schoolsTable),
    ]);

    const schoolMap = new Map(schools.map(s => [s.id, s]));
    const enriched = events.map(e => ({
      ...e,
      schoolName: schoolMap.get(e.schoolId)?.name || null,
      schoolLogoUrl: schoolMap.get(e.schoolId)?.logoUrl || null,
    })).reverse();

    return res.json({ events: enriched, total: Number(total) });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error", message: "Failed to get feed" });
  }
});

export default router;
