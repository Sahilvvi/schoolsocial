import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const schoolGalleryTable = pgTable("school_gallery", {
  id: serial("id").primaryKey(),
  schoolId: integer("school_id").notNull(),
  imageUrl: text("image_url").notNull(),
  caption: text("caption"),
  uploadedBy: integer("uploaded_by"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertSchoolGallerySchema = createInsertSchema(schoolGalleryTable).omit({ id: true, createdAt: true });
export type InsertSchoolGallery = z.infer<typeof insertSchoolGallerySchema>;
export type SchoolGallery = typeof schoolGalleryTable.$inferSelect;
