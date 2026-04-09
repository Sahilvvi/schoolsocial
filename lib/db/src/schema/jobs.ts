import { pgTable, serial, text, integer, timestamp, boolean, date, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const jobTypeEnum = pgEnum("job_type", ["full_time", "part_time", "contract"]);
export const applicationStatusEnum = pgEnum("application_status", ["pending", "reviewed", "shortlisted", "rejected"]);

export const jobsTable = pgTable("jobs", {
  id: serial("id").primaryKey(),
  schoolId: integer("school_id").notNull(),
  title: text("title").notNull(),
  subject: text("subject").notNull(),
  description: text("description"),
  requirements: text("requirements"),
  salary: text("salary"),
  jobType: jobTypeEnum("job_type").notNull(),
  experienceRequired: integer("experience_required"),
  location: text("location"),
  deadline: date("deadline"),
  isActive: boolean("is_active").notNull().default(true),
  applicationCount: integer("application_count").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const jobApplicationsTable = pgTable("job_applications", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").notNull(),
  applicantId: integer("applicant_id").notNull(),
  coverLetter: text("cover_letter"),
  resumeUrl: text("resume_url"),
  status: applicationStatusEnum("status").notNull().default("pending"),
  appliedAt: timestamp("applied_at").notNull().defaultNow(),
});

export const insertJobSchema = createInsertSchema(jobsTable).omit({ id: true, createdAt: true });
export type InsertJob = z.infer<typeof insertJobSchema>;
export type Job = typeof jobsTable.$inferSelect;

export const insertJobApplicationSchema = createInsertSchema(jobApplicationsTable).omit({ id: true, appliedAt: true });
export type InsertJobApplication = z.infer<typeof insertJobApplicationSchema>;
export type JobApplication = typeof jobApplicationsTable.$inferSelect;
