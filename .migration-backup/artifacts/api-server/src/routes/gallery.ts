import { Router } from "express";
import { db } from "@workspace/db";
import { schoolGalleryTable } from "@workspace/db";
import { eq } from "@workspace/db";
import { requireAuth, type AuthRequest } from "../middlewares/auth.js";

const router = Router();

router.get("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { schoolId } = req.query;
    const effectiveSchoolId = schoolId ? Number(schoolId) : req.user?.schoolId;
    if (!effectiveSchoolId) return res.status(400).json({ error: "Bad request", message: "schoolId required" });
    const images = await db.select().from(schoolGalleryTable).where(eq(schoolGalleryTable.schoolId, effectiveSchoolId)).orderBy(schoolGalleryTable.createdAt);
    return res.json({ images: images.reverse() });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error", message: "Failed to get gallery" });
  }
});

router.post("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { schoolId, imageUrl, caption } = req.body;
    const effectiveSchoolId = schoolId || req.user?.schoolId;
    if (!effectiveSchoolId || !imageUrl) return res.status(400).json({ error: "Bad request", message: "imageUrl required" });
    const [img] = await db.insert(schoolGalleryTable).values({ schoolId: effectiveSchoolId, imageUrl, caption, uploadedBy: req.user?.userId }).returning();
    return res.status(201).json(img);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error", message: "Failed to add image" });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    await db.delete(schoolGalleryTable).where(eq(schoolGalleryTable.id, Number(req.params.id)));
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error", message: "Failed to delete image" });
  }
});

export default router;
