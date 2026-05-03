import { pgTable, serial, text, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const noticeTypeEnum = pgEnum("notice_type", ["general", "exam", "holiday", "ptm", "event", "urgent"]);

export const noticesTable = pgTable("notices", {
  id: serial("id").primaryKey(),
  schoolId: integer("school_id").notNull(),
  classId: integer("class_id"),
  title: text("title").notNull(),
  content: text("content").notNull(),
  type: noticeTypeEnum("type").notNull().default("general"),
  postedBy: integer("posted_by"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertNoticeSchema = createInsertSchema(noticesTable).omit({ id: true, createdAt: true });
export type InsertNotice = z.infer<typeof insertNoticeSchema>;
export type Notice = typeof noticesTable.$inferSelect;
