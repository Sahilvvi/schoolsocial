import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set.");
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });

export {
  usersTable, schoolsTable, teachersTable, studentsTable, classesTable, 
  attendanceTable, feesTable, noticesTable, eventsTable, reviewsTable, 
  jobsTable, timetableTable, examsTable, homeworkTable, homeworkSubmissionsTable,
  teacherLeavesTable, messagesTable, announcementsTable, notificationsTable, 
  galleryTable, auditLogsTable, careerTable, platformSettingsTable, 
  libraryBooksTable, libraryIssuesTable, transportRoutesTable, 
  transportStudentsTable, payrollTable, ptmSlotsTable, disciplineRecordsTable, 
  studyMaterialsTable, syllabusTable, assignmentsTable, supportTicketsTable, 
  admissionsTable, studentHealthTable, studentLeavesTable, quizzesTable, 
  examResultsTable, admissionInquiriesTable
} from "./schema/index.ts";
export * from "drizzle-orm";
