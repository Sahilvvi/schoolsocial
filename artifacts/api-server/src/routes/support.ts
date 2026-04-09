import { Router } from "express";
import { db } from "@workspace/db";
import { supportTicketsTable, supportTicketRepliesTable, platformAnnouncementsTable } from "@workspace/db";
import { eq, desc } from "@workspace/db";
import { requireAuth, AuthRequest } from "../middlewares/auth";

const router = Router();

router.get("/tickets", requireAuth, async (req: AuthRequest, res) => {
  const { schoolId } = req.query;
  try {
    let tickets = await db.select().from(supportTicketsTable).orderBy(desc(supportTicketsTable.createdAt));
    if (schoolId) tickets = tickets.filter(t => t.schoolId === Number(schoolId));
    return res.json({ tickets });
  } catch { return res.status(500).json({ error: "Failed" }); }
});

router.post("/tickets", requireAuth, async (req: AuthRequest, res) => {
  const schoolId = req.user?.schoolId;
  try {
    const { subject, description, category, priority } = req.body;
    const [ticket] = await db.insert(supportTicketsTable).values({
      schoolId: Number(schoolId),
      raisedBy: req.user!.userId,
      subject,
      description,
      category: category || "general",
      priority: priority || "medium",
    }).returning();
    return res.json({ ticket });
  } catch (err) {
    console.error("[support POST /tickets]", err);
    return res.status(500).json({ error: "Failed" });
  }
});

router.patch("/tickets/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const [ticket] = await db.update(supportTicketsTable).set({ ...req.body, resolvedBy: req.user?.userId, updatedAt: new Date() }).where(eq(supportTicketsTable.id, Number(req.params.id))).returning();
    return res.json({ ticket });
  } catch { return res.status(500).json({ error: "Failed" }); }
});

router.get("/tickets/:id/replies", requireAuth, async (req: AuthRequest, res) => {
  try {
    const replies = await db.select().from(supportTicketRepliesTable)
      .where(eq(supportTicketRepliesTable.ticketId, Number(req.params.id)))
      .orderBy(supportTicketRepliesTable.createdAt);
    return res.json({ replies });
  } catch { return res.status(500).json({ error: "Failed" }); }
});

router.post("/tickets/:id/reply", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { message, isStaff, authorName } = req.body;
    if (!message?.trim()) return res.status(400).json({ error: "Message required" });
    const [reply] = await db.insert(supportTicketRepliesTable).values({
      ticketId: Number(req.params.id),
      authorId: req.user!.userId,
      authorName: authorName || "Support Team",
      isStaff: isStaff || false,
      message: message.trim(),
    }).returning();
    if (isStaff) {
      await db.update(supportTicketsTable).set({ status: "in_progress", updatedAt: new Date() }).where(eq(supportTicketsTable.id, Number(req.params.id)));
    }
    return res.status(201).json({ reply });
  } catch (err) {
    console.error("[support POST reply]", err);
    return res.status(500).json({ error: "Failed" });
  }
});

router.get("/announcements", requireAuth, async (req: AuthRequest, res) => {
  try {
    const items = await db.select().from(platformAnnouncementsTable).orderBy(desc(platformAnnouncementsTable.createdAt));
    return res.json({ announcements: items });
  } catch { return res.status(500).json({ error: "Failed" }); }
});

router.post("/announcements", requireAuth, async (req: AuthRequest, res) => {
  try {
    const [item] = await db.insert(platformAnnouncementsTable).values({ ...req.body, postedBy: req.user!.userId }).returning();
    return res.json({ announcement: item });
  } catch { return res.status(500).json({ error: "Failed" }); }
});

router.delete("/announcements/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    await db.delete(platformAnnouncementsTable).where(eq(platformAnnouncementsTable.id, Number(req.params.id)));
    return res.json({ success: true });
  } catch { return res.status(500).json({ error: "Failed" }); }
});

export default router;
