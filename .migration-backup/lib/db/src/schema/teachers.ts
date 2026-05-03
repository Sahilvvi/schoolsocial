import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const teachersTable = pgTable("teachers", {
  id: serial("id").primaryKey(),
  schoolId: integer("school_id").notNull(),
  userId: integer("user_id"),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  subjects: text("subjects"),
  qualification: text("qualification"),
  experience: integer("experience"),
  photoUrl: text("photo_url"),
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertTeacherSchema = createInsertSchema(teachersTable).omit({ id: true, createdAt: true, joinedAt: true });
export type InsertTeacher = z.infer<typeof insertTeacherSchema>;
export type Teacher = typeof teachersTable.$inferSelect;
