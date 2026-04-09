import { pgTable, serial, text, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const disciplineSeverityEnum = pgEnum("discipline_severity", ["minor", "moderate", "major"]);
export const disciplineStatusEnum = pgEnum("discipline_status", ["open", "resolved", "escalated"]);

export const disciplineRecordsTable = pgTable("discipline_records", {
  id: serial("id").primaryKey(),
  schoolId: integer("school_id").notNull(),
  studentId: integer("student_id").notNull(),
  incidentType: text("incident_type").notNull(),
  description: text("description").notNull(),
  severity: disciplineSeverityEnum("severity").notNull().default("minor"),
  status: disciplineStatusEnum("status").notNull().default("open"),
  actionTaken: text("action_taken"),
  reportedBy: integer("reported_by"),
  incidentDate: text("incident_date").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertDisciplineRecordSchema = createInsertSchema(disciplineRecordsTable).omit({ id: true, createdAt: true });
export type DisciplineRecord = typeof disciplineRecordsTable.$inferSelect;
