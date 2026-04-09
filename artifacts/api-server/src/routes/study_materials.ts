import { Router } from "express";
import { db } from "@workspace/db";
import { studyMaterialsTable, syllabusTable, classesTable } from "@workspace/db";
import { eq, and } from "@workspace/db";
import { requireAuth, AuthRequest } from "../middlewares/auth";

const router = Router();

router.get("/", requireAuth, async (req: AuthRequest, res) => {
  const schoolId = Number(req.query.schoolId) || req.user?.schoolId;
  const { classId } = req.query;
  try {
    let mats = await db.select().from(studyMaterialsTable).where(eq(studyMaterialsTable.schoolId, schoolId!));
    if (classId) mats = mats.filter(m => m.classId === Number(classId));
    return res.json({ materials: mats });
  } catch { return res.status(500).json({ error: "Failed" }); }
});

router.post("/", requireAuth, async (req: AuthRequest, res) => {
  const schoolId = req.user?.schoolId;
  try {
    const [mat] = await db.insert(studyMaterialsTable).values({ ...req.body, schoolId }).returning();
    return res.json({ material: mat });
  } catch { return res.status(500).json({ error: "Failed" }); }
});

router.delete("/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    await db.delete(studyMaterialsTable).where(eq(studyMaterialsTable.id, Number(req.params.id)));
    return res.json({ success: true });
  } catch { return res.status(500).json({ error: "Failed" }); }
});

router.get("/syllabus", requireAuth, async (req: AuthRequest, res) => {
  const schoolId = Number(req.query.schoolId) || req.user?.schoolId;
  const { classId } = req.query;
  try {
    let items = await db.select().from(syllabusTable).where(eq(syllabusTable.schoolId, schoolId!));
    if (classId) items = items.filter(s => s.classId === Number(classId));
    return res.json({ syllabus: items });
  } catch { return res.status(500).json({ error: "Failed" }); }
});

router.post("/syllabus", requireAuth, async (req: AuthRequest, res) => {
  const schoolId = req.user?.schoolId;
  try {
    const [item] = await db.insert(syllabusTable).values({ ...req.body, schoolId }).returning();
    return res.json({ item });
  } catch { return res.status(500).json({ error: "Failed" }); }
});

router.patch("/syllabus/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const [item] = await db.update(syllabusTable).set(req.body).where(eq(syllabusTable.id, Number(req.params.id))).returning();
    return res.json({ item });
  } catch { return res.status(500).json({ error: "Failed" }); }
});

router.delete("/syllabus/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    await db.delete(syllabusTable).where(eq(syllabusTable.id, Number(req.params.id)));
    return res.json({ success: true });
  } catch { return res.status(500).json({ error: "Failed" }); }
});

export default router;
