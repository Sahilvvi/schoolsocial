import { Router } from "express";
import * as dbModule from "@workspace/db";
const {
  db, studentsTable, attendanceTable, feesTable, noticesTable, classesTable, teachersTable,
  homeworkTable, homeworkSubmissionsTable, examsTable, examResultsTable,
  eventsTable, transportRoutesTable, transportStudentsTable, disciplineRecordsTable,
  libraryBooksTable, libraryIssuesTable, teacherLeavesTable, studentLeavesTable,
  payrollTable, admissionInquiriesTable, announcementsTable, timetableTable,
  supportTicketsTable, ptmSlotsTable, eq, and, count, sql, gte, lte, desc, ne
} = dbModule as any;
import { requireAuth, type AuthRequest } from "../middlewares/auth.js";

const router = Router();

type QueryCategory =
  | "attendance" | "fees" | "students" | "teachers" | "classes" | "notices"
  | "homework" | "exams" | "events" | "transport" | "discipline" | "library"
  | "leaves" | "payroll" | "admissions" | "announcements" | "support" | "ptm" | "general";

function detectCategory(query: string): QueryCategory {
  const q = query.toLowerCase();

  // Score each category by how many keywords match
  const scores: Record<QueryCategory, number> = {
    attendance: 0, fees: 0, students: 0, teachers: 0, classes: 0,
    notices: 0, homework: 0, exams: 0, events: 0, transport: 0,
    discipline: 0, library: 0, leaves: 0, payroll: 0, admissions: 0,
    announcements: 0, support: 0, ptm: 0, general: 0,
  };

  // Attendance
  if (q.includes("absent")) scores.attendance += 3;
  if (q.includes("attendance")) scores.attendance += 3;
  if (q.includes("present")) scores.attendance += 2;
  if (q.includes("late")) scores.attendance += 1;
  if (q.includes("who came") || q.includes("who is absent")) scores.attendance += 3;

  // Fees
  if (q.includes("fee")) scores.fees += 3;
  if (q.includes("defaulter")) scores.fees += 3;
  if (q.includes("overdue")) scores.fees += 2;
  if (q.includes("pending amount") || q.includes("due amount")) scores.fees += 3;
  if (q.includes("payment") || q.includes("paid") || q.includes("unpaid")) scores.fees += 2;
  if (q.includes("₹") || q.includes("rupee") || q.includes("amount")) scores.fees += 1;

  // Students
  if (q.includes("student")) scores.students += 2;
  if (q.includes("enroll") || q.includes("enrolled")) scores.students += 2;
  if (q.includes("how many student")) scores.students += 3;

  // Teachers
  if (q.includes("teacher")) scores.teachers += 3;
  if (q.includes("staff") || q.includes("faculty")) scores.teachers += 2;
  if (q.includes("instructor") || q.includes("educator")) scores.teachers += 1;

  // Classes
  if (q.includes("class")) scores.classes += 2;
  if (q.includes("section")) scores.classes += 2;
  if (q.includes("grade") || q.includes("division")) scores.classes += 1;
  if (q.includes("all class") || q.includes("each class")) scores.classes += 2;

  // Notices
  if (q.includes("notice")) scores.notices += 3;
  if (q.includes("circular")) scores.notices += 2;
  if (q.includes("bulletin")) scores.notices += 1;

  // Homework
  if (q.includes("homework")) scores.homework += 3;
  if (q.includes("assignment") && !q.includes("exam")) scores.homework += 2;
  if (q.includes("submission") || q.includes("submit")) scores.homework += 1;
  if (q.includes("due") && (q.includes("homework") || q.includes("task"))) scores.homework += 2;

  // Exams
  if (q.includes("exam")) scores.exams += 3;
  if (q.includes("test") && !q.includes("best")) scores.exams += 2;
  if (q.includes("result") || q.includes("marks") || q.includes("score")) scores.exams += 2;
  if (q.includes("paper") && q.includes("exam")) scores.exams += 2;
  if (q.includes("upcoming exam") || q.includes("next exam")) scores.exams += 3;

  // Events
  if (q.includes("event")) scores.events += 3;
  if (q.includes("program") || q.includes("function") || q.includes("activity")) scores.events += 2;
  if (q.includes("sports") || q.includes("celebration") || q.includes("festival")) scores.events += 2;
  if (q.includes("upcoming event") || q.includes("next event")) scores.events += 3;

  // Transport
  if (q.includes("transport") || q.includes("bus")) scores.transport += 3;
  if (q.includes("route") || q.includes("vehicle")) scores.transport += 2;
  if (q.includes("driver") || q.includes("pickup") || q.includes("drop")) scores.transport += 2;

  // Discipline
  if (q.includes("discipline") || q.includes("misconduct")) scores.discipline += 3;
  if (q.includes("incident") || q.includes("violation") || q.includes("misbehav")) scores.discipline += 2;
  if (q.includes("detention") || q.includes("suspension") || q.includes("warning")) scores.discipline += 2;

  // Library
  if (q.includes("library") || q.includes("librari")) scores.library += 3;
  if (q.includes("book")) scores.library += 2;
  if (q.includes("issue") && (q.includes("book") || q.includes("library"))) scores.library += 3;
  if (q.includes("borrow") || q.includes("overdue book")) scores.library += 2;

  // Leaves (high priority when leave keyword is present)
  if (q.includes("leave")) scores.leaves += 4;
  if (q.includes("sick") && (q.includes("teacher") || q.includes("leave"))) scores.leaves += 2;
  if (q.includes("absent teacher") || q.includes("teacher absent")) scores.leaves += 3;
  if (q.includes("vacation") || q.includes("on leave")) scores.leaves += 3;
  if (q.includes("teacher") && q.includes("leave")) scores.leaves += 2;

  // Payroll
  if (q.includes("payroll") || q.includes("salary") || q.includes("salaries")) scores.payroll += 3;
  if (q.includes("pay") && q.includes("teacher")) scores.payroll += 2;
  if (q.includes("wages") || q.includes("payslip") || q.includes("pay slip")) scores.payroll += 2;

  // Admissions
  if (q.includes("admission") && !q.includes("re-admission")) scores.admissions += 3;
  if (q.includes("inquiry") || q.includes("enquiry")) scores.admissions += 2;
  if (q.includes("new student") || q.includes("new enroll")) scores.admissions += 2;
  if (q.includes("application") && (q.includes("admission") || q.includes("join"))) scores.admissions += 2;

  // Announcements
  if (q.includes("announcement")) scores.announcements += 3;
  if (q.includes("platform notice") || q.includes("system notice")) scores.announcements += 2;

  // Support
  if (q.includes("support") || q.includes("ticket")) scores.support += 3;
  if (q.includes("complaint") || q.includes("issue report")) scores.support += 2;
  if (q.includes("help request") || q.includes("open ticket")) scores.support += 2;

  // PTM
  if (q.includes("ptm") || q.includes("parent teacher")) scores.ptm += 3;
  if (q.includes("meeting") && (q.includes("parent") || q.includes("teacher"))) scores.ptm += 2;

  // Overview / General
  if (q.includes("overview") || q.includes("summary") || q.includes("dashboard")) scores.general += 2;
  if (q.includes("everything") || q.includes("all data") || q.includes("complete")) scores.general += 2;
  if (q.includes("statistic") || q.includes("key metric") || q.includes("today")) scores.general += 1;

  // Return category with highest score (default to general)
  let best: QueryCategory = "general";
  let bestScore = 0;
  for (const [cat, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      best = cat as QueryCategory;
    }
  }
  return best;
}

router.post("/query", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { schoolId, query } = req.body;
    const effectiveSchoolId = schoolId || req.user?.schoolId;
    if (!effectiveSchoolId || !query) {
      return res.status(400).json({ error: "Bad request", message: "schoolId and query required" });
    }

    const category = detectCategory(query);
    const today = new Date().toISOString().split("T")[0];
    const now = new Date();
    let answer = "";
    let data: any = {};

    switch (category) {

      // ── ATTENDANCE ──────────────────────────────────────────
      case "attendance": {
        const records = await db
          .select({ status: attendanceTable.status, cnt: count() })
          .from(attendanceTable)
          .where(and(eq(attendanceTable.schoolId, effectiveSchoolId), eq(attendanceTable.date, today)))
          .groupBy(attendanceTable.status);

        const present = Number(records.find(r => r.status === "present")?.cnt || 0);
        const absent = Number(records.find(r => r.status === "absent")?.cnt || 0);
        const late = Number(records.find(r => r.status === "late")?.cnt || 0);
        const total = present + absent + late;
        const pct = total > 0 ? Math.round((present / total) * 100) : 0;

        const absentStudents = await db
          .select({ name: studentsTable.name, className: studentsTable.classId })
          .from(studentsTable)
          .innerJoin(attendanceTable, and(
            eq(attendanceTable.studentId, studentsTable.id),
            eq(attendanceTable.date, today),
            eq(attendanceTable.status, "absent"),
          ))
          .where(eq(studentsTable.schoolId, effectiveSchoolId))
          .limit(20);

        answer = `📊 Today's Attendance (${today})\n\n• ✅ Present: ${present} students\n• ❌ Absent: ${absent} students\n• ⏰ Late: ${late} students\n• 📈 Attendance rate: ${pct}%\n${absentStudents.length > 0 ? `\nAbsent students:\n${absentStudents.map(s => `  — ${s.name}`).join("\n")}` : "\nAll students are present or attendance not yet marked."}`;
        data = { present, absent, late, pct, absentStudents };
        break;
      }

      // ── FEES ────────────────────────────────────────────────
      case "fees": {
        const [{ totalPending }] = await db
          .select({ totalPending: sql<number>`COALESCE(SUM(CAST(amount AS NUMERIC)), 0)` })
          .from(feesTable)
          .where(and(eq(feesTable.schoolId, effectiveSchoolId), eq(feesTable.status, "pending")));

        const [{ totalPaid }] = await db
          .select({ totalPaid: sql<number>`COALESCE(SUM(CAST(amount AS NUMERIC)), 0)` })
          .from(feesTable)
          .where(and(eq(feesTable.schoolId, effectiveSchoolId), eq(feesTable.status, "paid")));

        const [{ overdueCount }] = await db
          .select({ overdueCount: count() })
          .from(feesTable)
          .where(and(eq(feesTable.schoolId, effectiveSchoolId), eq(feesTable.status, "overdue")));

        const [{ pendingCount }] = await db
          .select({ pendingCount: count() })
          .from(feesTable)
          .where(and(eq(feesTable.schoolId, effectiveSchoolId), eq(feesTable.status, "pending")));

        const fmt = (n: number) => `₹${Number(n).toLocaleString("en-IN")}`;
        answer = `💰 Fee Status for Your School\n\n• 💸 Total Pending: ${fmt(totalPending)}\n• ✅ Total Collected: ${fmt(totalPaid)}\n• ⚠️  Overdue Records: ${overdueCount}\n• 📋 Pending Records: ${pendingCount}\n\nTip: Go to the Fees module to view individual fee records and send reminders to defaulters.`;
        data = { totalPending: Number(totalPending), totalPaid: Number(totalPaid), overdueCount: Number(overdueCount), pendingCount: Number(pendingCount) };
        break;
      }

      // ── STUDENTS ────────────────────────────────────────────
      case "students": {
        const [{ total }] = await db
          .select({ total: count() })
          .from(studentsTable)
          .where(eq(studentsTable.schoolId, effectiveSchoolId));

        const byClass = await db
          .select({ classId: studentsTable.classId, cnt: count() })
          .from(studentsTable)
          .where(eq(studentsTable.schoolId, effectiveSchoolId))
          .groupBy(studentsTable.classId);

        const classes = await db
          .select({ id: classesTable.id, name: classesTable.name, section: classesTable.section })
          .from(classesTable)
          .where(eq(classesTable.schoolId, effectiveSchoolId));

        const classMap = new Map(classes.map(c => [c.id, `${c.name}${c.section ? "-" + c.section : ""}`]));

        answer = `🎓 Student Enrollment\n\n• Total Students: ${total}\n\nClass-wise breakdown:\n${byClass.map(b => `  — ${b.classId ? (classMap.get(b.classId) || "Unknown") : "Unassigned"}: ${b.cnt} students`).join("\n") || "  No class data available."}`;
        data = { total: Number(total), byClass };
        break;
      }

      // ── TEACHERS ────────────────────────────────────────────
      case "teachers": {
        const teachers = await db
          .select({ id: teachersTable.id, name: teachersTable.name, subjects: teachersTable.subjects, qualification: teachersTable.qualification, phone: teachersTable.phone })
          .from(teachersTable)
          .where(eq(teachersTable.schoolId, effectiveSchoolId));

        const pendingLeaves = await db
          .select({ cnt: count() })
          .from(teacherLeavesTable)
          .where(and(eq(teacherLeavesTable.schoolId, effectiveSchoolId), eq(teacherLeavesTable.status, "pending")));

        answer = `👩‍🏫 Teacher Directory\n\nTotal Teachers: ${teachers.length}\n\n${teachers.map((t, i) => `${i + 1}. ${t.name}\n   Subject: ${t.subjects || "General"}\n   Qualification: ${t.qualification || "N/A"}`).join("\n\n")}\n\n📋 Pending Leave Requests: ${Number(pendingLeaves[0]?.cnt || 0)}`;
        data = { teachers, totalTeachers: teachers.length };
        break;
      }

      // ── CLASSES ─────────────────────────────────────────────
      case "classes": {
        const classes = await db
          .select()
          .from(classesTable)
          .where(eq(classesTable.schoolId, effectiveSchoolId));

        const studentCounts = await db
          .select({ classId: studentsTable.classId, cnt: count() })
          .from(studentsTable)
          .where(eq(studentsTable.schoolId, effectiveSchoolId))
          .groupBy(studentsTable.classId);

        const countMap = new Map(studentCounts.map(s => [s.classId, Number(s.cnt)]));
        const totalStudents = studentCounts.reduce((sum, s) => sum + Number(s.cnt), 0);

        answer = `🏫 Class Overview\n\nTotal Classes: ${classes.length}\nTotal Students Assigned: ${totalStudents}\n\n${classes.map(c => `• ${c.name}${c.section ? "-" + c.section : ""}: ${countMap.get(c.id) || 0} students`).join("\n")}\n${classes.length === 0 ? "No classes found. Add classes in the Classes module." : ""}`;
        data = { classes: classes.map(c => ({ ...c, studentCount: countMap.get(c.id) || 0 })) };
        break;
      }

      // ── NOTICES ─────────────────────────────────────────────
      case "notices": {
        const notices = await db
          .select()
          .from(noticesTable)
          .where(eq(noticesTable.schoolId, effectiveSchoolId))
          .orderBy(desc(noticesTable.createdAt))
          .limit(8);

        answer = `📢 Recent Notices (${notices.length} found)\n\n${notices.map((n, i) => `${i + 1}. [${(n.type || "GENERAL").toUpperCase()}] ${n.title}\n   Posted: ${new Date(n.createdAt || Date.now()).toLocaleDateString("en-IN")}`).join("\n\n") || "No notices posted yet."}`;
        data = { notices };
        break;
      }

      // ── HOMEWORK ────────────────────────────────────────────
      case "homework": {
        const hw = await db
          .select()
          .from(homeworkTable)
          .where(eq(homeworkTable.schoolId, effectiveSchoolId))
          .orderBy(desc(homeworkTable.createdAt))
          .limit(10);

        const [{ overdueCount }] = await db
          .select({ overdueCount: count() })
          .from(homeworkTable)
          .where(and(
            eq(homeworkTable.schoolId, effectiveSchoolId),
            lte(homeworkTable.dueDate, today),
          ));

        const [{ submittedCount }] = await db
          .select({ submittedCount: count() })
          .from(homeworkSubmissionsTable)
          .where(eq(homeworkSubmissionsTable.schoolId, effectiveSchoolId));

        answer = `📚 Homework Summary\n\nTotal Assignments Given: ${hw.length}\nOverdue Assignments (past due date): ${overdueCount}\nTotal Submissions Received: ${submittedCount}\n\nRecent Assignments:\n${hw.slice(0, 5).map((h, i) => `${i + 1}. ${h.title} — Due: ${h.dueDate}${h.subject ? " (" + h.subject + ")" : ""}`).join("\n") || "No homework assigned yet."}`;
        data = { recentHomework: hw, overdueCount: Number(overdueCount), submittedCount: Number(submittedCount) };
        break;
      }

      // ── EXAMS ───────────────────────────────────────────────
      case "exams": {
        const upcoming = await db
          .select()
          .from(examsTable)
          .where(and(
            eq(examsTable.schoolId, effectiveSchoolId),
            gte(examsTable.examDate, today),
          ))
          .orderBy(examsTable.examDate)
          .limit(8);

        const past = await db
          .select()
          .from(examsTable)
          .where(and(
            eq(examsTable.schoolId, effectiveSchoolId),
            lte(examsTable.examDate, today),
          ))
          .orderBy(desc(examsTable.examDate))
          .limit(5);

        const [{ resultCount }] = await db
          .select({ resultCount: count() })
          .from(examResultsTable)
          .where(eq(examResultsTable.schoolId, effectiveSchoolId));

        answer = `📝 Exam Information\n\n🗓️ Upcoming Exams (${upcoming.length}):\n${upcoming.map(e => `• ${e.examName} — ${e.examDate}${e.subject ? " | " + e.subject : ""}${e.maxMarks ? " | Max: " + e.maxMarks : ""}`).join("\n") || "  No upcoming exams scheduled."}\n\n📅 Recent Past Exams (${past.length}):\n${past.map(e => `• ${e.examName} — ${e.examDate}`).join("\n") || "  No past exams found."}\n\n📊 Total Results Entered: ${resultCount}`;
        data = { upcoming, past, resultCount: Number(resultCount) };
        break;
      }

      // ── EVENTS ──────────────────────────────────────────────
      case "events": {
        const upcoming = await db
          .select()
          .from(eventsTable)
          .where(and(
            eq(eventsTable.schoolId, effectiveSchoolId),
            gte(eventsTable.eventDate, now),
          ))
          .orderBy(eventsTable.eventDate)
          .limit(8);

        const all = await db
          .select()
          .from(eventsTable)
          .where(eq(eventsTable.schoolId, effectiveSchoolId))
          .orderBy(desc(eventsTable.createdAt))
          .limit(5);

        answer = `🎉 School Events\n\n📅 Upcoming Events (${upcoming.length}):\n${upcoming.map(e => `• ${e.title}\n  Date: ${new Date(e.eventDate).toLocaleDateString("en-IN")}${e.location ? " | Venue: " + e.location : ""}${e.isPublic ? " | Public" : ""}`).join("\n\n") || "  No upcoming events scheduled."}\n\n${all.length > 0 ? `Total Events on Record: ${all.length}` : ""}`;
        data = { upcoming, total: all.length };
        break;
      }

      // ── TRANSPORT ───────────────────────────────────────────
      case "transport": {
        const routes = await db
          .select()
          .from(transportRoutesTable)
          .where(eq(transportRoutesTable.schoolId, effectiveSchoolId));

        const [{ assignedStudents }] = await db
          .select({ assignedStudents: count() })
          .from(transportStudentsTable)
          .where(eq(transportStudentsTable.schoolId, effectiveSchoolId));

        answer = `🚌 Transport Overview\n\nTotal Routes: ${routes.length}\nStudents on Transport: ${assignedStudents}\n\nRoute Details:\n${routes.map(r => `• ${r.routeName}${r.driverName ? " — Driver: " + r.driverName : ""}${r.vehicleNumber ? " | Vehicle: " + r.vehicleNumber : ""}${r.capacity ? " | Capacity: " + r.capacity : ""}`).join("\n") || "  No routes configured yet. Add routes in the Transport module."}`;
        data = { routes, assignedStudents: Number(assignedStudents) };
        break;
      }

      // ── DISCIPLINE ──────────────────────────────────────────
      case "discipline": {
        const records = await db
          .select({ id: disciplineRecordsTable.id, incidentType: disciplineRecordsTable.incidentType, description: disciplineRecordsTable.description, severity: disciplineRecordsTable.severity, status: disciplineRecordsTable.status, createdAt: disciplineRecordsTable.createdAt, studentId: disciplineRecordsTable.studentId })
          .from(disciplineRecordsTable)
          .where(eq(disciplineRecordsTable.schoolId, effectiveSchoolId))
          .orderBy(desc(disciplineRecordsTable.createdAt))
          .limit(10);

        const bySeverity = await db
          .select({ severity: disciplineRecordsTable.severity, cnt: count() })
          .from(disciplineRecordsTable)
          .where(eq(disciplineRecordsTable.schoolId, effectiveSchoolId))
          .groupBy(disciplineRecordsTable.severity);

        answer = `⚠️ Discipline Records\n\nTotal Records: ${records.length}${records.length === 10 ? "+" : ""}\n\nBy Severity:\n${bySeverity.map(b => `  — ${b.severity || "Unknown"}: ${b.cnt} cases`).join("\n") || "  No records."}\n\nRecent Incidents:\n${records.slice(0, 5).map((r, i) => `${i + 1}. [${r.severity?.toUpperCase() || "N/A"}] ${r.incidentType} — ${new Date(r.createdAt || Date.now()).toLocaleDateString("en-IN")}\n   ${r.description?.slice(0, 80)}${(r.description?.length || 0) > 80 ? "..." : ""}`).join("\n\n") || "  No recent incidents."}`;
        data = { records, bySeverity };
        break;
      }

      // ── LIBRARY ─────────────────────────────────────────────
      case "library": {
        const [{ totalBooks }] = await db
          .select({ totalBooks: count() })
          .from(libraryBooksTable)
          .where(eq(libraryBooksTable.schoolId, effectiveSchoolId));

        const [{ availableBooks }] = await db
          .select({ availableBooks: count() })
          .from(libraryBooksTable)
          .where(and(eq(libraryBooksTable.schoolId, effectiveSchoolId), eq(libraryBooksTable.status, "available")));

        const [{ issuedBooks }] = await db
          .select({ issuedBooks: count() })
          .from(libraryIssuesTable)
          .where(and(eq(libraryIssuesTable.schoolId, effectiveSchoolId), eq(libraryIssuesTable.status, "issued")));

        const [{ overdueBooks }] = await db
          .select({ overdueBooks: count() })
          .from(libraryIssuesTable)
          .where(and(eq(libraryIssuesTable.schoolId, effectiveSchoolId), eq(libraryIssuesTable.status, "overdue")));

        const recentIssues = await db
          .select()
          .from(libraryIssuesTable)
          .where(and(eq(libraryIssuesTable.schoolId, effectiveSchoolId), eq(libraryIssuesTable.status, "issued")))
          .limit(5);

        answer = `📖 Library Overview\n\n• Total Books: ${totalBooks}\n• Available: ${availableBooks}\n• Currently Issued: ${issuedBooks}\n• Overdue Returns: ${overdueBooks}\n\n${overdueBooks > 0 ? `⚠️ ${overdueBooks} book(s) are overdue! Check the Library module to send reminders.` : "✅ All issued books are within due date."}`;
        data = { totalBooks: Number(totalBooks), availableBooks: Number(availableBooks), issuedBooks: Number(issuedBooks), overdueBooks: Number(overdueBooks) };
        break;
      }

      // ── LEAVES ──────────────────────────────────────────────
      case "leaves": {
        const teacherLeaves = await db
          .select()
          .from(teacherLeavesTable)
          .where(eq(teacherLeavesTable.schoolId, effectiveSchoolId))
          .orderBy(desc(teacherLeavesTable.createdAt))
          .limit(10);

        const byStatus = await db
          .select({ status: teacherLeavesTable.status, cnt: count() })
          .from(teacherLeavesTable)
          .where(eq(teacherLeavesTable.schoolId, effectiveSchoolId))
          .groupBy(teacherLeavesTable.status);

        const studentLeaves = await db
          .select({ cnt: count() })
          .from(studentLeavesTable)
          .where(and(eq(studentLeavesTable.schoolId, effectiveSchoolId), eq(studentLeavesTable.status, "approved")));

        const pending = byStatus.find(b => b.status === "pending");
        const approved = byStatus.find(b => b.status === "approved");

        answer = `🏖️ Leave Management\n\n👩‍🏫 Teacher Leaves:\n• Pending Requests: ${pending?.cnt || 0}\n• Approved Leaves: ${approved?.cnt || 0}\n• Total Records: ${teacherLeaves.length}${teacherLeaves.length === 10 ? "+" : ""}\n\n🎓 Student Approved Leaves: ${Number(studentLeaves[0]?.cnt || 0)}\n\n${Number(pending?.cnt || 0) > 0 ? `⚡ Action needed: ${pending?.cnt} teacher leave request(s) awaiting approval.` : "✅ No pending leave requests."}`;
        data = { teacherLeaves, byStatus, studentLeaves: Number(studentLeaves[0]?.cnt || 0) };
        break;
      }

      // ── PAYROLL ─────────────────────────────────────────────
      case "payroll": {
        const [{ totalAmount }] = await db
          .select({ totalAmount: sql<number>`COALESCE(SUM(CAST(net_salary AS NUMERIC)), 0)` })
          .from(payrollTable)
          .where(eq(payrollTable.schoolId, effectiveSchoolId));

        const [{ paidAmount }] = await db
          .select({ paidAmount: sql<number>`COALESCE(SUM(CAST(net_salary AS NUMERIC)), 0)` })
          .from(payrollTable)
          .where(and(eq(payrollTable.schoolId, effectiveSchoolId), eq(payrollTable.status, "paid")));

        const byStatus = await db
          .select({ status: payrollTable.status, cnt: count() })
          .from(payrollTable)
          .where(eq(payrollTable.schoolId, effectiveSchoolId))
          .groupBy(payrollTable.status);

        const fmt = (n: number) => `₹${Number(n).toLocaleString("en-IN")}`;
        const pending = byStatus.find(b => b.status === "pending");
        const paid = byStatus.find(b => b.status === "paid");

        answer = `💵 Payroll Summary\n\n• Total Salary Disbursed: ${fmt(paidAmount)}\n• Pending Payroll: ${fmt(Number(totalAmount) - Number(paidAmount))}\n• Paid Records: ${paid?.cnt || 0}\n• Pending Records: ${pending?.cnt || 0}\n• On Hold: ${byStatus.find(b => b.status === "hold")?.cnt || 0}\n\n${Number(pending?.cnt || 0) > 0 ? `⚡ ${pending?.cnt} payroll record(s) pending. Process them in the Payroll module.` : "✅ All payroll records are up to date."}`;
        data = { totalAmount: Number(totalAmount), paidAmount: Number(paidAmount), byStatus };
        break;
      }

      // ── ADMISSIONS ──────────────────────────────────────────
      case "admissions": {
        const inquiries = await db
          .select()
          .from(admissionInquiriesTable)
          .where(eq(admissionInquiriesTable.schoolId, effectiveSchoolId))
          .orderBy(desc(admissionInquiriesTable.createdAt))
          .limit(10);

        const byStatus = await db
          .select({ status: admissionInquiriesTable.status, cnt: count() })
          .from(admissionInquiriesTable)
          .where(eq(admissionInquiriesTable.schoolId, effectiveSchoolId))
          .groupBy(admissionInquiriesTable.status);

        const newInq = byStatus.find(b => b.status === "new");
        const contacted = byStatus.find(b => b.status === "contacted");
        const enrolled = byStatus.find(b => b.status === "enrolled");
        const rejected = byStatus.find(b => b.status === "rejected");

        answer = `📋 Admission Inquiries\n\nTotal Inquiries: ${inquiries.length}${inquiries.length === 10 ? "+" : ""}\n\n• New / Pending: ${newInq?.cnt || 0}\n• Contacted: ${contacted?.cnt || 0}\n• Enrolled: ${enrolled?.cnt || 0}\n• Rejected: ${rejected?.cnt || 0}\n\nRecent Inquiries:\n${inquiries.slice(0, 5).map((i, idx) => `${idx + 1}. ${i.studentName} — Grade ${i.gradeApplying || "N/A"} | ${i.status?.toUpperCase() || "NEW"}`).join("\n") || "  No inquiries yet."}`;
        data = { inquiries, byStatus };
        break;
      }

      // ── ANNOUNCEMENTS ───────────────────────────────────────
      case "announcements": {
        const announcements = await db
          .select()
          .from(announcementsTable)
          .where(eq(announcementsTable.schoolId, effectiveSchoolId))
          .orderBy(desc(announcementsTable.createdAt))
          .limit(8);

        answer = `📣 School Announcements\n\nTotal: ${announcements.length}\n\n${announcements.map((a, i) => `${i + 1}. ${a.title}\n   Target: ${a.targetRoles || "All"} | ${new Date(a.createdAt || Date.now()).toLocaleDateString("en-IN")}`).join("\n\n") || "No announcements posted yet."}`;
        data = { announcements };
        break;
      }

      // ── SUPPORT ─────────────────────────────────────────────
      case "support": {
        const tickets = await db
          .select()
          .from(supportTicketsTable)
          .where(eq(supportTicketsTable.schoolId, effectiveSchoolId))
          .orderBy(desc(supportTicketsTable.createdAt))
          .limit(10);

        const byStatus = await db
          .select({ status: supportTicketsTable.status, cnt: count() })
          .from(supportTicketsTable)
          .where(eq(supportTicketsTable.schoolId, effectiveSchoolId))
          .groupBy(supportTicketsTable.status);

        const open = byStatus.find(b => b.status === "open");
        const inProgress = byStatus.find(b => b.status === "in_progress");
        const resolved = byStatus.find(b => b.status === "resolved");

        answer = `🎫 Support Tickets\n\n• Open: ${open?.cnt || 0}\n• In Progress: ${inProgress?.cnt || 0}\n• Resolved: ${resolved?.cnt || 0}\n\nRecent Tickets:\n${tickets.slice(0, 5).map((t, i) => `${i + 1}. [${(t.status || "OPEN").toUpperCase()}] ${t.subject} — Priority: ${t.priority}`).join("\n") || "  No support tickets."}`;
        data = { tickets, byStatus };
        break;
      }

      // ── PTM ─────────────────────────────────────────────────
      case "ptm": {
        const slots = await db
          .select()
          .from(ptmSlotsTable)
          .where(eq(ptmSlotsTable.schoolId, effectiveSchoolId))
          .orderBy(desc(ptmSlotsTable.createdAt))
          .limit(10);

        const [{ booked }] = await db
          .select({ booked: count() })
          .from(ptmSlotsTable)
          .where(and(eq(ptmSlotsTable.schoolId, effectiveSchoolId), eq(ptmSlotsTable.status, "booked")));

        const [{ available }] = await db
          .select({ available: count() })
          .from(ptmSlotsTable)
          .where(and(eq(ptmSlotsTable.schoolId, effectiveSchoolId), eq(ptmSlotsTable.status, "available")));

        answer = `👨‍👩‍👧 Parent-Teacher Meeting (PTM)\n\nTotal Slots: ${slots.length}\n• Booked: ${booked}\n• Available: ${available}\n\n${Number(booked) > 0 ? `${booked} meeting(s) have been booked by parents.` : "No PTM bookings yet."}\n\nManage PTM slots in the PTM module.`;
        data = { slots, booked: Number(booked), available: Number(available) };
        break;
      }

      // ── GENERAL OVERVIEW ────────────────────────────────────
      default: {
        const [
          [{ students }],
          [{ teachers }],
          [{ classes }],
          [{ notices }],
          attendanceToday,
          [{ pendingFees }],
          [{ upcomingEvents }],
          [{ pendingHw }],
          [{ openTickets }],
        ] = await Promise.all([
          db.select({ students: count() }).from(studentsTable).where(eq(studentsTable.schoolId, effectiveSchoolId)),
          db.select({ teachers: count() }).from(teachersTable).where(eq(teachersTable.schoolId, effectiveSchoolId)),
          db.select({ classes: count() }).from(classesTable).where(eq(classesTable.schoolId, effectiveSchoolId)),
          db.select({ notices: count() }).from(noticesTable).where(eq(noticesTable.schoolId, effectiveSchoolId)),
          db.select({ status: attendanceTable.status, cnt: count() }).from(attendanceTable)
            .where(and(eq(attendanceTable.schoolId, effectiveSchoolId), eq(attendanceTable.date, today)))
            .groupBy(attendanceTable.status),
          db.select({ pendingFees: sql<number>`COALESCE(SUM(CAST(amount AS NUMERIC)), 0)` }).from(feesTable)
            .where(and(eq(feesTable.schoolId, effectiveSchoolId), eq(feesTable.status, "pending"))),
          db.select({ upcomingEvents: count() }).from(eventsTable)
            .where(and(eq(eventsTable.schoolId, effectiveSchoolId), gte(eventsTable.eventDate, now))),
          db.select({ pendingHw: count() }).from(homeworkTable)
            .where(and(eq(homeworkTable.schoolId, effectiveSchoolId), gte(homeworkTable.dueDate, today))),
          db.select({ openTickets: count() }).from(supportTicketsTable)
            .where(and(eq(supportTicketsTable.schoolId, effectiveSchoolId), eq(supportTicketsTable.status, "open"))),
        ]);

        const present = Number(attendanceToday.find((r: any) => r.status === "present")?.cnt || 0);
        const absent = Number(attendanceToday.find((r: any) => r.status === "absent")?.cnt || 0);
        const attendancePct = (present + absent) > 0 ? Math.round((present / (present + absent)) * 100) : 0;

        answer = `🏫 School Dashboard Overview — ${new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}\n\n👥 People:\n• Students: ${students}\n• Teachers: ${teachers}\n• Classes: ${classes}\n\n📊 Today's Attendance:\n• Present: ${present} | Absent: ${absent} | Rate: ${attendancePct}%\n\n💰 Finance:\n• Pending Fees: ₹${Number(pendingFees).toLocaleString("en-IN")}\n\n📅 School Life:\n• Upcoming Events: ${upcomingEvents}\n• Active Homework: ${pendingHw}\n• Open Notices: ${notices}\n• Support Tickets: ${openTickets}\n\nAsk me about any specific area — attendance, fees, students, teachers, homework, exams, events, transport, library, discipline, admissions, payroll, leaves, and more!`;
        data = { students: Number(students), teachers: Number(teachers), classes: Number(classes), notices: Number(notices), present, absent, attendancePct, pendingFees: Number(pendingFees) };
      }
    }

    return res.json({ answer, queryType: category, data, actionPerformed: false });
  } catch (err) {
    console.error("[AI Query Error]", err);
    return res.status(500).json({ error: "Internal server error", message: "AI query failed. Please try again." });
  }
});

export default router;
