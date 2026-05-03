import { Router } from "express";
import { db } from "@workspace/db";
import { announcementsTable, notificationsTable, usersTable } from "@workspace/db";
import { eq, and } from "@workspace/db";
import { requireAuth, type AuthRequest } from "../middlewares/auth.js";

const router = Router();

router.get("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { schoolId } = req.query;
    const effectiveSchoolId = schoolId ? Number(schoolId) : req.user?.schoolId;
    if (!effectiveSchoolId) return res.status(400).json({ error: "Bad request", message: "schoolId required" });

    const items = await db.select().from(announcementsTable).where(eq(announcementsTable.schoolId, effectiveSchoolId)).orderBy(announcementsTable.createdAt);
    return res.json({ announcements: items.reverse() });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error", message: "Failed to get announcements" });
  }
});

router.post("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { schoolId, title, body, targetRoles, channel } = req.body;
    const effectiveSchoolId = schoolId || req.user?.schoolId;
    if (!effectiveSchoolId || !title || !body) {
      return res.status(400).json({ error: "Bad request", message: "Missing required fields" });
    }
    const [announcement] = await db.insert(announcementsTable).values({
      schoolId: effectiveSchoolId, title, body, targetRoles: targetRoles || "all", sentBy: req.user!.userId, channel: channel || "in_app",
    }).returning();

    const targetRoleList: string[] = targetRoles === "all" ? ["parent", "teacher", "student"] : [targetRoles];
    const users = await db.select().from(usersTable).where(eq(usersTable.schoolId, effectiveSchoolId));
    const targetUsers = users.filter(u => targetRoles === "all" || targetRoleList.includes(u.role));

    if (targetUsers.length > 0) {
      await db.insert(notificationsTable).values(
        targetUsers.map(u => ({
          userId: u.id, schoolId: effectiveSchoolId, title, message: body, type: "announcement", isRead: false,
        }))
      );
    }

    return res.status(201).json({ ...announcement, recipientCount: targetUsers.length });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error", message: "Failed to create announcement" });
  }
});

export default router;
