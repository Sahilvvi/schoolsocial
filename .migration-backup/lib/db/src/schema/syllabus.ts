import { pgTable, serial, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const syllabusTable = pgTable("syllabus", {
  id: serial("id").primaryKey(),
  schoolId: integer("school_id").notNull(),
  classId: integer("class_id").notNull(),
  subject: text("subject").notNull(),
  chapter: text("chapter").notNull(),
  topics: text("topics"),
  plannedDate: text("planned_date"),
  completedDate: text("completed_date"),
  isCompleted: boolean("is_completed").notNull().default(false),
  teacherId: integer("teacher_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertSyllabusSchema = createInsertSchema(syllabusTable).omit({ id: true, createdAt: true });
export type Syllabus = typeof syllabusTable.$inferSelect;
