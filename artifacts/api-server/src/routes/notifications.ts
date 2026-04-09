import { Router } from "express";
import { db } from "@workspace/db";
import { notificationsTable } from "@workspace/db";
import { eq, and, count } from "@workspace/db";
import { requireAuth, type AuthRequest } from "../middlewares/auth.js";

const router = Router();

router.get("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { userId, schoolId, limit = 20 } = req.query;
    const effectiveUserId = userId ? Number(userId) : req.user?.userId;
    if (!effectiveUserId) return res.status(400).json({ error: "Bad request", message: "userId required" });

    const conditions: any[] = [eq(notificationsTable.userId, effectiveUserId)];
    if (schoolId) conditions.push(eq(notificationsTable.schoolId, Number(schoolId)));

    const [notifications, [{ unread }]] = await Promise.all([
      db.select().from(notificationsTable).where(and(...conditions)).orderBy(notificationsTable.createdAt).limit(Number(limit)),
      db.select({ unread: count() }).from(notificationsTable).where(and(eq(notificationsTable.userId, effectiveUserId), eq(notificationsTable.isRead, false))),
    ]);

    return res.json({ notifications: notifications.reverse(), unread: Number(unread) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error", message: "Failed to get notifications" });
  }
});

router.put("/mark-all-read", requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    await db.update(notificationsTable).set({ isRead: true }).where(eq(notificationsTable.userId, userId));
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error", message: "Failed to mark all read" });
  }
});

router.put("/:id/read", requireAuth, async (req, res) => {
  try {
    await db.update(notificationsTable).set({ isRead: true }).where(eq(notificationsTable.id, Number(req.params.id)));
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error", message: "Failed to mark read" });
  }
});

export default router;
