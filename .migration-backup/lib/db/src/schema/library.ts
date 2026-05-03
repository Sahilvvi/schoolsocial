import { pgTable, serial, text, integer, timestamp, date, pgEnum, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const bookStatusEnum = pgEnum("book_status", ["available", "issued", "lost", "damaged"]);
export const issueStatusEnum = pgEnum("issue_status", ["issued", "returned", "overdue"]);

export const libraryBooksTable = pgTable("library_books", {
  id: serial("id").primaryKey(),
  schoolId: integer("school_id").notNull(),
  title: text("title").notNull(),
  author: text("author"),
  isbn: text("isbn"),
  subject: text("subject"),
  category: text("category"),
  publisher: text("publisher"),
  publicationYear: integer("publication_year"),
  totalCopies: integer("total_copies").notNull().default(1),
  availableCopies: integer("available_copies").notNull().default(1),
  shelfLocation: text("shelf_location"),
  status: bookStatusEnum("status").notNull().default("available"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const libraryIssuesTable = pgTable("library_issues", {
  id: serial("id").primaryKey(),
  schoolId: integer("school_id").notNull(),
  bookId: integer("book_id").notNull(),
  studentId: integer("student_id").notNull(),
  issuedAt: timestamp("issued_at").notNull().defaultNow(),
  dueDate: date("due_date").notNull(),
  returnedAt: timestamp("returned_at"),
  status: issueStatusEnum("status").notNull().default("issued"),
  fine: integer("fine").default(0),
  notes: text("notes"),
});

export const insertLibraryBookSchema = createInsertSchema(libraryBooksTable).omit({ id: true, createdAt: true });
export const insertLibraryIssueSchema = createInsertSchema(libraryIssuesTable).omit({ id: true });
export type LibraryBook = typeof libraryBooksTable.$inferSelect;
export type LibraryIssue = typeof libraryIssuesTable.$inferSelect;
