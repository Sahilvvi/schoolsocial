import { pgTable, serial, text, integer, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const ptmStatusEnum = pgEnum("ptm_status", ["available", "booked", "completed", "cancelled"]);

export const ptmSlotsTable = pgTable("ptm_slots", {
  id: serial("id").primaryKey(),
  schoolId: integer("school_id").notNull(),
  teacherId: integer("teacher_id").notNull(),
  date: text("date").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  status: ptmStatusEnum("status").notNull().default("available"),
  bookedBy: integer("booked_by"),
  parentId: integer("parent_id"),
  studentId: integer("student_id"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertPtmSlotSchema = createInsertSchema(ptmSlotsTable).omit({ id: true, createdAt: true });
export type PtmSlot = typeof ptmSlotsTable.$inferSelect;
