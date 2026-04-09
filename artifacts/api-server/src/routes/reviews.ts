import { Router } from "express";
import { db } from "@workspace/db";
import { reviewsTable, schoolsTable } from "@workspace/db";
import { eq, and, avg, count } from "drizzle-orm";
import { requireAuth, requireRole, type AuthRequest } from "../middlewares/auth.js";

const router = Router();

router.get("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { schoolId, approved } = req.query;
    const isSuperAdmin = req.user?.role === "super_admin";

    if (!schoolId && !isSuperAdmin) {
      return res.status(400).json({ error: "Bad request", message: "schoolId required" });
    }

    const conditions: any[] = [];
    if (schoolId) conditions.push(eq(reviewsTable.schoolId, Number(schoolId)));
    if (approved !== undefined) conditions.push(eq(reviewsTable.approved, approved === "true"));

    const reviews = await db.select().from(reviewsTable).where(conditions.length ? and(...conditions) : undefined);

    const schools = await db.select({ id: schoolsTable.id, name: schoolsTable.name }).from(schoolsTable);
    const schoolMap = new Map(schools.map(s => [s.id, s.name]));

    const enriched = reviews.map(r => ({
      ...r, overallRating: Number(r.overallRating), schoolName: schoolMap.get(r.schoolId) || null,
    }));

    const approvedReviews = enriched.filter(r => r.approved);
    const averageRating = approvedReviews.length > 0
      ? approvedReviews.reduce((s, r) => s + r.overallRating, 0) / approvedReviews.length : 0;

    return res.json({ reviews: enriched, total: enriched.length, averageRating });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error", message: "Failed to list reviews" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { schoolId, reviewerName, reviewerEmail, teachingRating, infrastructureRating, safetyRating, communicationRating, overallRating: providedRating, comment } = req.body;
    if (!schoolId || !reviewerName) return res.status(400).json({ error: "Bad request", message: "schoolId and reviewerName required" });

    const tR = Number(teachingRating) || 0;
    const iR = Number(infrastructureRating) || 0;
    const sR = Number(safetyRating) || 0;
    const cR = Number(communicationRating) || 0;
    const subRatingsCount = [tR, iR, sR, cR].filter(r => r > 0).length;
    const overallRating = providedRating
      ? Number(providedRating).toFixed(2)
      : subRatingsCount > 0
        ? ((tR + iR + sR + cR) / subRatingsCount).toFixed(2)
        : "0.00";

    const [review] = await db.insert(reviewsTable).values({
      schoolId: Number(schoolId),
      reviewerName,
      reviewerEmail: reviewerEmail || null,
      teachingRating: tR || null,
      infrastructureRating: iR || null,
      safetyRating: sR || null,
      communicationRating: cR || null,
      overallRating,
      comment: comment || null,
    }).returning();
    return res.status(201).json({ ...review, overallRating: Number(review.overallRating) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error", message: "Failed to create review" });
  }
});

router.post("/:reviewId/approve", requireAuth, requireRole("super_admin"), async (req, res) => {
  try {
    const [review] = await db.update(reviewsTable)
      .set({ approved: true })
      .where(eq(reviewsTable.id, Number(req.params.reviewId)))
      .returning();
    return res.json({ ...review, overallRating: Number(review.overallRating) });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error", message: "Failed to approve review" });
  }
});

export default router;
