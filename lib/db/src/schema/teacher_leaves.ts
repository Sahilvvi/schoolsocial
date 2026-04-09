import { pgTable, serial, text, integer, timestamp, date, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const leaveStatusEnum = pgEnum("leave_status", ["pending", "approved", "rejected"]);
export const leaveTypeEnum = pgEnum("leave_type", ["sick", "casual", "earned", "maternity", "other"]);

export const teacherLeavesTable = pgTable("teacher_leaves", {
  id: serial("id").primaryKey(),
  schoolId: integer("school_id").notNull(),
  teacherId: integer("teacher_id").notNull(),
  leaveType: leaveTypeEnum("leave_type").notNull().default("casual"),
  fromDate: date("from_date").notNull(),
  toDate: date("to_date").notNull(),
  reason: text("reason").notNull(),
  status: leaveStatusEnum("status").notNull().default("pending"),
  adminNote: text("admin_note"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertTeacherLeaveSchema = createInsertSchema(teacherLeavesTable).omit({ id: true, createdAt: true });
export type InsertTeacherLeave = z.infer<typeof insertTeacherLeaveSchema>;
export type TeacherLeave = typeof teacherLeavesTable.$inferSelect;
