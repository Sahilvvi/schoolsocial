import { pgTable, serial, text, integer, timestamp, pgEnum, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const genderEnum = pgEnum("gender", ["male", "female", "other"]);

export const studentsTable = pgTable("students", {
  id: serial("id").primaryKey(),
  schoolId: integer("school_id").notNull(),
  classId: integer("class_id"),
  userId: integer("user_id"),
  admissionNo: text("admission_no").notNull(),
  name: text("name").notNull(),
  dateOfBirth: date("date_of_birth"),
  gender: genderEnum("gender"),
  photoUrl: text("photo_url"),
  qrCode: text("qr_code"),
  parentId: integer("parent_id"),
  parentName: text("parent_name"),
  parentPhone: text("parent_phone"),
  parentEmail: text("parent_email"),
  bloodGroup: text("blood_group"),
  address: text("address"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertStudentSchema = createInsertSchema(studentsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Student = typeof studentsTable.$inferSelect;
