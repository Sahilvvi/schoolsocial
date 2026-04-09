import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const studyMaterialsTable = pgTable("study_materials", {
  id: serial("id").primaryKey(),
  schoolId: integer("school_id").notNull(),
  classId: integer("class_id").notNull(),
  teacherId: integer("teacher_id"),
  subject: text("subject").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  fileUrl: text("file_url"),
  fileType: text("file_type"),
  materialType: text("material_type").default("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertStudyMaterialSchema = createInsertSchema(studyMaterialsTable).omit({ id: true, createdAt: true });
export type StudyMaterial = typeof studyMaterialsTable.$inferSelect;
