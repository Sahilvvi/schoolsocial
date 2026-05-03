import { pgTable, serial, text, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const inquiryStatusEnum = pgEnum("inquiry_status", ["new", "contacted", "enrolled", "rejected"]);

export const admissionInquiriesTable = pgTable("admission_inquiries", {
  id: serial("id").primaryKey(),
  schoolId: integer("school_id").notNull(),
  parentName: text("parent_name").notNull(),
  parentEmail: text("parent_email"),
  parentPhone: text("parent_phone").notNull(),
  studentName: text("student_name").notNull(),
  gradeApplying: text("grade_applying"),
  message: text("message"),
  status: inquiryStatusEnum("status").notNull().default("new"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const schoolBlogTable = pgTable("school_blog", {
  id: serial("id").primaryKey(),
  schoolId: integer("school_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").default("news"),
  imageUrl: text("image_url"),
  authorId: integer("author_id"),
  isPublished: integer("is_published").notNull().default(1),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const feeStructuresTable = pgTable("fee_structures", {
  id: serial("id").primaryKey(),
  schoolId: integer("school_id").notNull(),
  name: text("name").notNull(),
  feeType: text("fee_type").notNull(),
  amount: text("amount").notNull(),
  frequency: text("frequency").notNull().default("annual"),
  classId: integer("class_id"),
  description: text("description"),
  isActive: integer("is_active").notNull().default(1),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const schoolPlansTable = pgTable("school_plans", {
  id: serial("id").primaryKey(),
  schoolId: integer("school_id").notNull(),
  plan: text("plan").notNull().default("free"),
  maxStudents: integer("max_students").default(100),
  maxTeachers: integer("max_teachers").default(10),
  features: text("features"),
  startDate: text("start_date"),
  endDate: text("end_date"),
  monthlyFee: text("monthly_fee").default("0"),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAdmissionInquirySchema = createInsertSchema(admissionInquiriesTable).omit({ id: true, createdAt: true });
export const insertBlogSchema = createInsertSchema(schoolBlogTable).omit({ id: true, createdAt: true });
export const insertFeeStructureSchema = createInsertSchema(feeStructuresTable).omit({ id: true, createdAt: true });
export const insertSchoolPlanSchema = createInsertSchema(schoolPlansTable).omit({ id: true, createdAt: true });
export type AdmissionInquiry = typeof admissionInquiriesTable.$inferSelect;
export type FeeStructure = typeof feeStructuresTable.$inferSelect;
