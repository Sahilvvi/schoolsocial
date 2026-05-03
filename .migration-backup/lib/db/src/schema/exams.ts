import { pgTable, serial, text, integer, timestamp, date, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const examTypeEnum = pgEnum("exam_type", ["unit_test", "mid_term", "final", "practical"]);
export const gradeEnum = pgEnum("grade_letter", ["A+", "A", "B+", "B", "C+", "C", "D", "F"]);

export const examsTable = pgTable("exams", {
  id: serial("id").primaryKey(),
  schoolId: integer("school_id").notNull(),
  classId: integer("class_id").notNull(),
  subject: text("subject").notNull(),
  examName: text("exam_name").notNull(),
  examType: examTypeEnum("exam_type").notNull().default("unit_test"),
  examDate: date("exam_date").notNull(),
  maxMarks: integer("max_marks").notNull().default(100),
  passingMarks: integer("passing_marks").notNull().default(35),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const examResultsTable = pgTable("exam_results", {
  id: serial("id").primaryKey(),
  examId: integer("exam_id").notNull(),
  studentId: integer("student_id").notNull(),
  schoolId: integer("school_id").notNull(),
  marksObtained: integer("marks_obtained"),
  grade: text("grade"),
  remarks: text("remarks"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertExamSchema = createInsertSchema(examsTable).omit({ id: true, createdAt: true });
export type InsertExam = z.infer<typeof insertExamSchema>;
export type Exam = typeof examsTable.$inferSelect;

export const insertExamResultSchema = createInsertSchema(examResultsTable).omit({ id: true, createdAt: true });
export type InsertExamResult = z.infer<typeof insertExamResultSchema>;
export type ExamResult = typeof examResultsTable.$inferSelect;
