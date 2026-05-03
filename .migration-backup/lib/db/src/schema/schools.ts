import { pgTable, serial, text, integer, timestamp, numeric, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const schoolStatusEnum = pgEnum("school_status", ["pending", "approved", "suspended"]);
export const schoolTypeEnum = pgEnum("school_type", ["government", "private", "aided"]);
export const subscriptionPlanEnum = pgEnum("subscription_plan", ["free", "basic", "premium"]);

export const schoolsTable = pgTable("schools", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  pincode: text("pincode"),
  board: text("board"),
  type: schoolTypeEnum("type").default("private"),
  logoUrl: text("logo_url"),
  coverUrl: text("cover_url"),
  website: text("website"),
  description: text("description"),
  facilities: text("facilities"),
  status: schoolStatusEnum("status").notNull().default("pending"),
  subscriptionPlan: subscriptionPlanEnum("subscription_plan").notNull().default("free"),
  averageRating: numeric("average_rating", { precision: 3, scale: 2 }).default("0"),
  reviewCount: integer("review_count").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertSchoolSchema = createInsertSchema(schoolsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertSchool = z.infer<typeof insertSchoolSchema>;
export type School = typeof schoolsTable.$inferSelect;
