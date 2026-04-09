import { pgTable, serial, text, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const quizzesTable = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  schoolId: integer("school_id").notNull(),
  classId: integer("class_id").notNull(),
  teacherId: integer("teacher_id"),
  title: text("title").notNull(),
  subject: text("subject"),
  description: text("description"),
  questions: jsonb("questions").notNull().default([]),
  isPublished: boolean("is_published").notNull().default(false),
  timeLimit: integer("time_limit"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const quizAttemptsTable = pgTable("quiz_attempts", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id").notNull(),
  studentId: integer("student_id").notNull(),
  schoolId: integer("school_id").notNull(),
  answers: jsonb("answers").notNull().default({}),
  score: integer("score"),
  total: integer("total"),
  completedAt: timestamp("completed_at").notNull().defaultNow(),
});

export const insertQuizSchema = createInsertSchema(quizzesTable).omit({ id: true, createdAt: true });
export type InsertQuiz = z.infer<typeof insertQuizSchema>;
export type Quiz = typeof quizzesTable.$inferSelect;

export const insertQuizAttemptSchema = createInsertSchema(quizAttemptsTable).omit({ id: true, completedAt: true });
export type InsertQuizAttempt = z.infer<typeof insertQuizAttemptSchema>;
export type QuizAttempt = typeof quizAttemptsTable.$inferSelect;
