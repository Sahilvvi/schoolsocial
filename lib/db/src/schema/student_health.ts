import { pgTable, serial, text, integer, timestamp, date, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const studentHealthTable = pgTable("student_health", {
  id: serial("id").primaryKey(),
  schoolId: integer("school_id").notNull(),
  studentId: integer("student_id").notNull(),
  recordDate: date("record_date").notNull(),
  height: numeric("height", { precision: 5, scale: 2 }),
  weight: numeric("weight", { precision: 5, scale: 2 }),
  bloodPressure: text("blood_pressure"),
  vision: text("vision"),
  hearing: text("hearing"),
  allergies: text("allergies"),
  medications: text("medications"),
  conditions: text("conditions"),
  notes: text("notes"),
  recordedBy: text("recorded_by"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertStudentHealthSchema = createInsertSchema(studentHealthTable).omit({ id: true, createdAt: true });
export type InsertStudentHealth = z.infer<typeof insertStudentHealthSchema>;
export type StudentHealth = typeof studentHealthTable.$inferSelect;
