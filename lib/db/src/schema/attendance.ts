import { pgTable, serial, integer, date, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const attendanceStatusEnum = pgEnum("attendance_status", ["present", "absent", "late"]);

export const attendanceTable = pgTable("attendance", {
  id: serial("id").primaryKey(),
  schoolId: integer("school_id").notNull(),
  studentId: integer("student_id").notNull(),
  classId: integer("class_id").notNull(),
  date: date("date").notNull(),
  status: attendanceStatusEnum("status").notNull(),
  markedBy: integer("marked_by"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAttendanceSchema = createInsertSchema(attendanceTable).omit({ id: true, createdAt: true });
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;
export type Attendance = typeof attendanceTable.$inferSelect;
