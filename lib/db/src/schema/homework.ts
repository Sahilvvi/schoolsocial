import { pgTable, serial, text, integer, timestamp, date, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const submissionStatusEnum = pgEnum("submission_status", ["pending", "submitted", "late", "graded"]);

export const homeworkTable = pgTable("homework", {
  id: serial("id").primaryKey(),
  schoolId: integer("school_id").notNull(),
  classId: integer("class_id").notNull(),
  teacherId: integer("teacher_id"),
  subject: text("subject").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: date("due_date").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const homeworkSubmissionsTable = pgTable("homework_submissions", {
  id: serial("id").primaryKey(),
  homeworkId: integer("homework_id").notNull(),
  studentId: integer("student_id").notNull(),
  schoolId: integer("school_id").notNull(),
  status: submissionStatusEnum("status").notNull().default("pending"),
  note: text("note"),
  submittedAt: timestamp("submitted_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertHomeworkSchema = createInsertSchema(homeworkTable).omit({ id: true, createdAt: true });
export type InsertHomework = z.infer<typeof insertHomeworkSchema>;
export type Homework = typeof homeworkTable.$inferSelect;

export const insertHomeworkSubmissionSchema = createInsertSchema(homeworkSubmissionsTable).omit({ id: true, createdAt: true });
export type InsertHomeworkSubmission = z.infer<typeof insertHomeworkSubmissionSchema>;
export type HomeworkSubmission = typeof homeworkSubmissionsTable.$inferSelect;
