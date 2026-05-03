import { pgTable, serial, text, integer, timestamp, numeric, date, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const payrollStatusEnum = pgEnum("payroll_status", ["pending", "paid", "hold"]);

export const payrollTable = pgTable("payroll", {
  id: serial("id").primaryKey(),
  schoolId: integer("school_id").notNull(),
  teacherId: integer("teacher_id").notNull(),
  month: text("month").notNull(),
  year: integer("year").notNull(),
  basicSalary: numeric("basic_salary", { precision: 10, scale: 2 }).notNull(),
  allowances: numeric("allowances", { precision: 10, scale: 2 }).default("0"),
  deductions: numeric("deductions", { precision: 10, scale: 2 }).default("0"),
  netSalary: numeric("net_salary", { precision: 10, scale: 2 }).notNull(),
  paidDate: date("paid_date"),
  status: payrollStatusEnum("status").notNull().default("pending"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertPayrollSchema = createInsertSchema(payrollTable).omit({ id: true, createdAt: true });
export type Payroll = typeof payrollTable.$inferSelect;
