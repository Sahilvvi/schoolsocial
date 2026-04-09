import { pgTable, serial, text, integer, timestamp, date, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const studentLeaveStatusEnum = pgEnum("student_leave_status", ["pending", "approved", "rejected"]);
export const studentLeaveTypeEnum = pgEnum("student_leave_type", ["sick", "family", "festival", "other"]);

export const studentLeavesTable = pgTable("student_leaves", {
  id: serial("id").primaryKey(),
  schoolId: integer("school_id").notNull(),
  studentId: integer("student_id").notNull(),
  leaveType: studentLeaveTypeEnum("leave_type").notNull().default("sick"),
  fromDate: date("from_date").notNull(),
  toDate: date("to_date").notNull(),
  reason: text("reason").notNull(),
  status: studentLeaveStatusEnum("status").notNull().default("pending"),
  adminNote: text("admin_note"),
  appliedBy: text("applied_by").default("student"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertStudentLeaveSchema = createInsertSchema(studentLeavesTable).omit({ id: true, createdAt: true });
export type InsertStudentLeave = z.infer<typeof insertStudentLeaveSchema>;
export type StudentLeave = typeof studentLeavesTable.$inferSelect;
