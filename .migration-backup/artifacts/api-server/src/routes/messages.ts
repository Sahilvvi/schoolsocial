import { Router } from "express";
import { db } from "@workspace/db";
import { messagesTable, usersTable } from "@workspace/db";
import { eq, and, or, desc } from "@workspace/db";
import { requireAuth, type AuthRequest } from "../middlewares/auth.js";

const router = Router();

router.get("/contacts", requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(400).json({ error: "Bad request", message: "User not found" });

    const msgs = await db.select().from(messagesTable)
      .where(or(eq(messagesTable.senderId, userId), eq(messagesTable.receiverId, userId)))
      .orderBy(desc(messagesTable.createdAt));

    const contactMap = new Map<number, any>();
    for (const msg of msgs) {
      const otherId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      const otherName = msg.senderId === userId ? msg.receiverName : msg.senderName;
      if (!contactMap.has(otherId)) {
        contactMap.set(otherId, { id: otherId, name: otherName, lastMessage: msg.message, lastTime: msg.createdAt, unread: 0 });
      }
      if (!msg.isRead && msg.receiverId === userId) contactMap.get(otherId)!.unread++;
    }

    const contacts = Array.from(contactMap.values());
    return res.json({ contacts });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error", message: "Failed to get contacts" });
  }
});

router.get("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { schoolId, userId, withUserId } = req.query;
    const effectiveUserId = userId ? Number(userId) : req.user?.userId;
    const effectiveSchoolId = schoolId ? Number(schoolId) : req.user?.schoolId;

    if (!effectiveUserId) return res.status(400).json({ error: "Bad request", message: "Missing params" });

    let msgs;
    if (withUserId) {
      const otherId = Number(withUserId);
      msgs = await db.select().from(messagesTable).where(
        or(
          and(eq(messagesTable.senderId, effectiveUserId), eq(messagesTable.receiverId, otherId)),
          and(eq(messagesTable.senderId, otherId), eq(messagesTable.receiverId, effectiveUserId))
        )
      ).orderBy(messagesTable.createdAt);
    } else if (effectiveSchoolId) {
      msgs = await db.select().from(messagesTable).where(
        and(
          eq(messagesTable.schoolId, effectiveSchoolId),
          or(eq(messagesTable.senderId, effectiveUserId), eq(messagesTable.receiverId, effectiveUserId))
        )
      ).orderBy(messagesTable.createdAt);
    } else {
      msgs = await db.select().from(messagesTable).where(
        or(eq(messagesTable.senderId, effectiveUserId), eq(messagesTable.receiverId, effectiveUserId))
      ).orderBy(messagesTable.createdAt);
    }

    return res.json({ messages: msgs.map(m => ({ ...m, content: m.message, fromUserId: m.senderId, toUserId: m.receiverId })) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error", message: "Failed to get messages" });
  }
});

router.get("/threads", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { schoolId, userId } = req.query;
    const effectiveSchoolId = schoolId ? Number(schoolId) : req.user?.schoolId;
    const effectiveUserId = userId ? Number(userId) : req.user?.userId;
    if (!effectiveSchoolId || !effectiveUserId) return res.status(400).json({ error: "Bad request", message: "Missing params" });

    const msgs = await db.select().from(messagesTable).where(
      and(
        eq(messagesTable.schoolId, effectiveSchoolId),
        or(eq(messagesTable.senderId, effectiveUserId), eq(messagesTable.receiverId, effectiveUserId))
      )
    ).orderBy(messagesTable.createdAt);

    const threadsMap = new Map<string, any>();
    for (const msg of msgs) {
      const otherId = msg.senderId === effectiveUserId ? msg.receiverId : msg.senderId;
      const otherName = msg.senderId === effectiveUserId ? msg.receiverName : msg.senderName;
      const key = String(otherId);
      if (!threadsMap.has(key)) {
        threadsMap.set(key, { userId: otherId, name: otherName, messages: [], unread: 0 });
      }
      const thread = threadsMap.get(key);
      thread.messages.push(msg);
      if (!msg.isRead && msg.receiverId === effectiveUserId) thread.unread++;
    }
    return res.json({ threads: Array.from(threadsMap.values()) });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error", message: "Failed to get threads" });
  }
});

router.post("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const senderUserId = req.user?.userId;
    const senderSchoolId = req.user?.schoolId;
    const senderRole = req.user?.role || "user";

    const { schoolId, senderId, receiverId, toUserId, senderName, receiverName, message, content, subject } = req.body;

    const effectiveSchoolId = schoolId || senderSchoolId || 1;
    const effectiveSenderId = senderId || senderUserId;
    const effectiveReceiverId = receiverId || toUserId;
    const effectiveMessage = message || content || subject || "";

    if (!effectiveSenderId || !effectiveReceiverId || !effectiveMessage) {
      return res.status(400).json({ error: "Bad request", message: "Missing required fields" });
    }

    let senderDisplayName = senderName;
    let receiverDisplayName = receiverName;

    if (!senderDisplayName) {
      const [senderUser] = await db.select({ name: usersTable.name }).from(usersTable).where(eq(usersTable.id, effectiveSenderId)).limit(1);
      senderDisplayName = senderUser?.name || "User";
    }
    if (!receiverDisplayName) {
      const [receiverUser] = await db.select({ name: usersTable.name }).from(usersTable).where(eq(usersTable.id, effectiveReceiverId)).limit(1);
      receiverDisplayName = receiverUser?.name || "User";
    }

    const [msg] = await db.insert(messagesTable).values({
      schoolId: effectiveSchoolId,
      senderId: effectiveSenderId,
      receiverId: effectiveReceiverId,
      senderName: senderDisplayName,
      receiverName: receiverDisplayName,
      senderRole: senderRole,
      message: effectiveMessage,
    }).returning();

    return res.status(201).json({ message: { ...msg, content: msg.message, fromUserId: msg.senderId, toUserId: msg.receiverId } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error", message: "Failed to send message" });
  }
});

router.put("/:id/read", requireAuth, async (_req, res) => {
  try {
    await db.update(messagesTable).set({ isRead: true }).where(eq(messagesTable.id, Number(_req.params.id)));
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error", message: "Failed to mark read" });
  }
});

export default router;
