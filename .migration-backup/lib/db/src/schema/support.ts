import { pgTable, serial, text, integer, timestamp, pgEnum, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const ticketStatusEnum = pgEnum("ticket_status", ["open", "in_progress", "resolved", "closed"]);
export const ticketPriorityEnum = pgEnum("ticket_priority", ["low", "medium", "high", "urgent"]);

export const supportTicketsTable = pgTable("support_tickets", {
  id: serial("id").primaryKey(),
  schoolId: integer("school_id").notNull(),
  raisedBy: integer("raised_by").notNull(),
  subject: text("subject").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull().default("general"),
  priority: ticketPriorityEnum("priority").notNull().default("medium"),
  status: ticketStatusEnum("status").notNull().default("open"),
  resolvedBy: integer("resolved_by"),
  resolution: text("resolution"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const supportTicketRepliesTable = pgTable("support_ticket_replies", {
  id: serial("id").primaryKey(),
  ticketId: integer("ticket_id").notNull(),
  authorId: integer("author_id").notNull(),
  authorName: text("author_name").notNull().default("Support Team"),
  isStaff: boolean("is_staff").notNull().default(false),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const platformAnnouncementsTable = pgTable("platform_announcements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  targetRole: text("target_role").notNull().default("all"),
  postedBy: integer("posted_by").notNull(),
  isActive: integer("is_active").notNull().default(1),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertSupportTicketSchema = createInsertSchema(supportTicketsTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertSupportTicketReplySchema = createInsertSchema(supportTicketRepliesTable).omit({ id: true, createdAt: true });
export const insertPlatformAnnouncementSchema = createInsertSchema(platformAnnouncementsTable).omit({ id: true, createdAt: true });
export type SupportTicket = typeof supportTicketsTable.$inferSelect;
export type SupportTicketReply = typeof supportTicketRepliesTable.$inferSelect;
export type PlatformAnnouncement = typeof platformAnnouncementsTable.$inferSelect;
