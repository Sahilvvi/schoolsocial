import { pgTable, serial, text, integer, timestamp, numeric, date, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const feeStatusEnum = pgEnum("fee_status", ["pending", "paid", "overdue"]);

export const feesTable = pgTable("fees", {
  id: serial("id").primaryKey(),
  schoolId: integer("school_id").notNull(),
  studentId: integer("student_id").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  feeType: text("fee_type").notNull(),
  dueDate: date("due_date").notNull(),
  paidDate: date("paid_date"),
  status: feeStatusEnum("status").notNull().default("pending"),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertFeeSchema = createInsertSchema(feesTable).omit({ id: true, createdAt: true });
export type InsertFee = z.infer<typeof insertFeeSchema>;
export type Fee = typeof feesTable.$inferSelect;
