import { pgTable, serial, text, integer, timestamp, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const savedJobsTable = pgTable("saved_jobs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  jobId: integer("job_id").notNull(),
  savedAt: timestamp("saved_at").notNull().defaultNow(),
}, (t) => [unique().on(t.userId, t.jobId)]);

export const jobSeekerProfilesTable = pgTable("job_seeker_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  phone: text("phone"),
  subject: text("subject"),
  experience: text("experience"),
  qualification: text("qualification"),
  bio: text("bio"),
  location: text("location"),
  resumeUrl: text("resume_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertSavedJobSchema = createInsertSchema(savedJobsTable).omit({ id: true, savedAt: true });
export type InsertSavedJob = z.infer<typeof insertSavedJobSchema>;

export const insertJobSeekerProfileSchema = createInsertSchema(jobSeekerProfilesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertJobSeekerProfile = z.infer<typeof insertJobSeekerProfileSchema>;
