import { Router } from "express";
import { db } from "@workspace/db";
import { classesTable, studentsTable, teachersTable } from "@workspace/db";
import { eq, and, count } from "@workspace/db";
import { requireAuth, type AuthRequest } from "../middlewares/auth.js";

const router = Router();

router.get("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { schoolId } = req.query;
    const effectiveSchoolId = schoolId ? Number(schoolId) : req.user?.schoolId;
    if (!effectiveSchoolId) return res.status(400).json({ error: "Bad request", message: "schoolId required" });

    const [classes, teachers, students] = await Promise.all([
      db.select().from(classesTable).where(eq(classesTable.schoolId, effectiveSchoolId)),
      db.select().from(teachersTable).where(eq(teachersTable.schoolId, effectiveSchoolId)),
      db.select({ classId: studentsTable.classId, cnt: count() }).from(studentsTable)
        .where(eq(studentsTable.schoolId, effectiveSchoolId))
        .groupBy(studentsTable.classId),
    ]);

    const teacherMap = new Map(teachers.map(t => [t.id, t]));
    const studentCountMap = new Map(students.map(s => [s.classId, s.cnt]));

    const enriched = classes.map(c => ({
      ...c,
      teacherName: c.teacherId ? teacherMap.get(c.teacherId)?.name : null,
      studentCount: Number(studentCountMap.get(c.id) || 0),
    }));

    return res.json({ classes: enriched, total: enriched.length });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error", message: "Failed to list classes" });
  }
});

router.post("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { schoolId, name, section, teacherId } = req.body;
    const effectiveSchoolId = schoolId || req.user?.schoolId;
    if (!effectiveSchoolId || !name) return res.status(400).json({ error: "Bad request", message: "schoolId and name required" });

    const [cls] = await db.insert(classesTable).values({
      schoolId: effectiveSchoolId, name, section, teacherId,
    }).returning();

    return res.status(201).json({ ...cls, teacherName: null, studentCount: 0 });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error", message: "Failed to create class" });
  }
});

router.patch("/:classId", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { name, section, teacherId } = req.body;
    const [cls] = await db.update(classesTable)
      .set({ name, section, teacherId })
      .where(eq(classesTable.id, Number(req.params.classId)))
      .returning();
    return res.json({ ...cls, teacherName: null, studentCount: 0 });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error", message: "Failed to update class" });
  }
});

router.delete("/:classId", requireAuth, async (req: AuthRequest, res) => {
  try {
    await db.delete(classesTable).where(eq(classesTable.id, Number(req.params.classId)));
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error", message: "Failed to delete class" });
  }
});

export default router;
