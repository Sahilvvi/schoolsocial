import { Router } from "express";
import { db } from "@workspace/db";
import { eventsTable, schoolsTable } from "@workspace/db";
import { eq, and, count } from "@workspace/db";
import { requireAuth, type AuthRequest } from "../middlewares/auth.js";

const router = Router();

router.get("/public", async (_req, res) => {
  try {
    const { limit = 50, city } = _req.query;
    const events = await db.select().from(eventsTable)
      .where(eq(eventsTable.isPublic, true))
      .orderBy(eventsTable.eventDate)
      .limit(Number(limit));
    const schools = await db.select({ id: schoolsTable.id, name: schoolsTable.name, city: schoolsTable.city }).from(schoolsTable);
    const schoolMap = new Map(schools.map(s => [s.id, s]));
    let enriched = events.map(e => ({
      ...e, date: e.eventDate,
      schoolName: schoolMap.get(e.schoolId)?.name || null,
      city: schoolMap.get(e.schoolId)?.city || null,
    }));
    if (city) enriched = enriched.filter(e => e.city?.toLowerCase() === String(city).toLowerCase());
    return res.json({ events: enriched });
  } catch (err) {
    return res.status(500).json({ error: "Failed" });
  }
});

router.get("/", async (req, res) => {
  try {
    const { schoolId, page = 1, limit = 20 } = req.query;
    const isPublicMode = req.query.public === "true";

    const conditions: any[] = [];
    if (schoolId) conditions.push(eq(eventsTable.schoolId, Number(schoolId)));
    if (isPublicMode) conditions.push(eq(eventsTable.isPublic, true));

    const [events, [{ total }], schools] = await Promise.all([
      db.select().from(eventsTable)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(eventsTable.eventDate)
        .limit(Number(limit)).offset((Number(page) - 1) * Number(limit)),
      db.select({ total: count() }).from(eventsTable)
        .where(conditions.length > 0 ? and(...conditions) : undefined),
      db.select({ id: schoolsTable.id, name: schoolsTable.name, logoUrl: schoolsTable.logoUrl }).from(schoolsTable),
    ]);

    const schoolMap = new Map(schools.map(s => [s.id, s]));
    const enriched = events.map(e => ({
      ...e,
      schoolName: schoolMap.get(e.schoolId)?.name || null,
      schoolLogoUrl: schoolMap.get(e.schoolId)?.logoUrl || null,
    }));

    return res.json({ events: enriched, total: Number(total) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error", message: "Failed to list events" });
  }
});

router.post("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { schoolId, title, description, eventDate, location, isPublic, imageUrl } = req.body;
    const effectiveSchoolId = schoolId || req.user?.schoolId;
    if (!effectiveSchoolId || !title || !eventDate) {
      return res.status(400).json({ error: "Bad request", message: "Missing required fields" });
    }
    const [event] = await db.insert(eventsTable).values({
      schoolId: effectiveSchoolId, title, description, eventDate: new Date(eventDate),
      location, isPublic: isPublic || false, imageUrl,
    }).returning();
    return res.status(201).json({ ...event, schoolName: null, schoolLogoUrl: null });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error", message: "Failed to create event" });
  }
});

router.patch("/:eventId", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { title, description, eventDate, location, isPublic, imageUrl } = req.body;
    const [event] = await db.update(eventsTable)
      .set({ title, description, eventDate: eventDate ? new Date(eventDate) : undefined, location, isPublic, imageUrl })
      .where(eq(eventsTable.id, Number(req.params.eventId)))
      .returning();
    return res.json({ ...event, schoolName: null, schoolLogoUrl: null });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error", message: "Failed to update event" });
  }
});

router.delete("/:eventId", requireAuth, async (req: AuthRequest, res) => {
  try {
    await db.delete(eventsTable).where(eq(eventsTable.id, Number(req.params.eventId)));
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error", message: "Failed to delete event" });
  }
});

export default router;
