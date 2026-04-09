import { Router } from "express";
import { db } from "@workspace/db";
import { transportRoutesTable, transportStudentsTable, studentsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth, AuthRequest } from "../middlewares/auth";

const router = Router();

router.get("/", requireAuth, async (req: AuthRequest, res) => {
  const schoolId = Number(req.query.schoolId) || req.user?.schoolId;
  try {
    const routes = await db.select().from(transportRoutesTable).where(eq(transportRoutesTable.schoolId, schoolId!));
    return res.json({ routes });
  } catch { return res.status(500).json({ error: "Failed" }); }
});

router.post("/", requireAuth, async (req: AuthRequest, res) => {
  const schoolId = req.user?.schoolId;
  try {
    const [route] = await db.insert(transportRoutesTable).values({ ...req.body, schoolId }).returning();
    return res.json({ route });
  } catch { return res.status(500).json({ error: "Failed" }); }
});

router.put("/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const [route] = await db.update(transportRoutesTable).set(req.body).where(eq(transportRoutesTable.id, Number(req.params.id))).returning();
    return res.json({ route });
  } catch { return res.status(500).json({ error: "Failed" }); }
});

router.delete("/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    await db.delete(transportRoutesTable).where(eq(transportRoutesTable.id, Number(req.params.id)));
    return res.json({ success: true });
  } catch { return res.status(500).json({ error: "Failed" }); }
});

router.get("/students", requireAuth, async (req: AuthRequest, res) => {
  const schoolId = Number(req.query.schoolId) || req.user?.schoolId;
  try {
    const alloc = await db.select({
      id: transportStudentsTable.id, studentId: transportStudentsTable.studentId, routeId: transportStudentsTable.routeId,
      pickupStop: transportStudentsTable.pickupStop, studentName: studentsTable.name,
      routeName: transportRoutesTable.routeName,
    }).from(transportStudentsTable)
      .leftJoin(studentsTable, eq(transportStudentsTable.studentId, studentsTable.id))
      .leftJoin(transportRoutesTable, eq(transportStudentsTable.routeId, transportRoutesTable.id))
      .where(eq(transportStudentsTable.schoolId, schoolId!));
    return res.json({ allocations: alloc });
  } catch { return res.status(500).json({ error: "Failed" }); }
});

router.post("/students", requireAuth, async (req: AuthRequest, res) => {
  const schoolId = req.user?.schoolId;
  try {
    const [alloc] = await db.insert(transportStudentsTable).values({ ...req.body, schoolId }).returning();
    return res.json({ allocation: alloc });
  } catch { return res.status(500).json({ error: "Failed" }); }
});

router.delete("/students/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    await db.delete(transportStudentsTable).where(eq(transportStudentsTable.id, Number(req.params.id)));
    return res.json({ success: true });
  } catch { return res.status(500).json({ error: "Failed" }); }
});

export default router;
