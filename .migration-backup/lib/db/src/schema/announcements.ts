import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const announcementsTable = pgTable("announcements", {
  id: serial("id").primaryKey(),
  schoolId: integer("school_id").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  targetRoles: text("target_roles").notNull().default("all"),
  sentBy: integer("sent_by").notNull(),
  channel: text("channel").notNull().default("in_app"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAnnouncementSchema = createInsertSchema(announcementsTable).omit({ id: true, createdAt: true });
export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
export type Announcement = typeof announcementsTable.$inferSelect;
