import { pgTable, serial, text, integer, timestamp, boolean, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const reviewsTable = pgTable("reviews", {
  id: serial("id").primaryKey(),
  schoolId: integer("school_id").notNull(),
  reviewerName: text("reviewer_name").notNull(),
  reviewerEmail: text("reviewer_email"),
  teachingRating: integer("teaching_rating").notNull(),
  infrastructureRating: integer("infrastructure_rating").notNull(),
  safetyRating: integer("safety_rating").notNull(),
  communicationRating: integer("communication_rating").notNull(),
  overallRating: numeric("overall_rating", { precision: 3, scale: 2 }).notNull(),
  comment: text("comment"),
  approved: boolean("approved").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertReviewSchema = createInsertSchema(reviewsTable).omit({ id: true, createdAt: true });
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviewsTable.$inferSelect;
