import { pgTable, serial, text, integer, timestamp, date, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const assignmentTypeEnum = pgEnum("assignment_type", ["project", "lab", "essay", "presentation", "other"]);
export const assignmentSubStatusEnum = pgEnum("assignment_sub_status", ["pending", "submitted", "late", "graded"]);

export const assignmentsTable = pgTable("assignments", {
  id: serial("id").primaryKey(),
  schoolId: integer("school_id").notNull(),
  classId: integer("class_id").notNull(),
  teacherId: integer("teacher_id"),
  subject: text("subject").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  assignmentType: assignmentTypeEnum("assignment_type").notNull().default("project"),
  dueDate: date("due_date").notNull(),
  maxMarks: integer("max_marks").default(100),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const assignmentSubmissionsTable = pgTable("assignment_submissions", {
  id: serial("id").primaryKey(),
  assignmentId: integer("assignment_id").notNull(),
  studentId: integer("student_id").notNull(),
  schoolId: integer("school_id").notNull(),
  note: text("note"),
  marksObtained: integer("marks_obtained"),
  feedback: text("feedback"),
  status: assignmentSubStatusEnum("status").notNull().default("submitted"),
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
});

export const insertAssignmentSchema = createInsertSchema(assignmentsTable).omit({ id: true, createdAt: true });
export const insertAssignmentSubmissionSchema = createInsertSchema(assignmentSubmissionsTable).omit({ id: true, submittedAt: true });
export type Assignment = typeof assignmentsTable.$inferSelect;
