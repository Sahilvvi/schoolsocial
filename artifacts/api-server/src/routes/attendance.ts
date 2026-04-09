import { Router } from "express";
import { db } from "@workspace/db";
import { attendanceTable, studentsTable, notificationsTable } from "@workspace/db";
import { eq, and, count, gte, lte, inArray } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middlewares/auth.js";

const router = Router();

router.get("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { schoolId, classId, studentId, date, startDate, endDate } = req.query;
    const effectiveSchoolId = schoolId ? Number(schoolId) : req.user?.schoolId;
    if (!effectiveSchoolId) return res.status(400).json({ error: "Bad request", message: "schoolId required" });

    const conditions: any[] = [eq(attendanceTable.schoolId, effectiveSchoolId)];
    if (classId) conditions.push(eq(attendanceTable.classId, Number(classId)));
    if (studentId) conditions.push(eq(attendanceTable.studentId, Number(studentId)));
    if (date) conditions.push(eq(attendanceTable.date, date as string));
    if (startDate) conditions.push(gte(attendanceTable.date, startDate as string));
    if (endDate) conditions.push(lte(attendanceTable.date, endDate as string));

    const [attendance, students] = await Promise.all([
      db.select().from(attendanceTable).where(and(...conditions)),
      db.select({ id: studentsTable.id, name: studentsTable.name }).from(studentsTable)
        .where(eq(studentsTable.schoolId, effectiveSchoolId)),
    ]);

    const studentMap = new Map(students.map(s => [s.id, s.name]));
    const enriched = attendance.map(a => ({ ...a, studentName: studentMap.get(a.studentId) || null }));
    const presentCount = enriched.filter(a => a.status === "present").length;
    const absentCount = enriched.filter(a => a.status === "absent").length;

    return res.json({ attendance: enriched, total: enriched.length, presentCount, absentCount });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error", message: "Failed to get attendance" });
  }
});

router.post("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { schoolId, classId, date, records } = req.body;
    const effectiveSchoolId = schoolId || req.user?.schoolId;
    if (!effectiveSchoolId || !classId || !date || !records?.length) {
      return res.status(400).json({ error: "Bad request", message: "Missing required fields" });
    }

    await db.delete(attendanceTable).where(
      and(eq(attendanceTable.schoolId, effectiveSchoolId), eq(attendanceTable.classId, classId), eq(attendanceTable.date, date))
    );

    const inserts = records.map((r: { studentId: number; status: "present" | "absent" | "late" }) => ({
      schoolId: effectiveSchoolId,
      classId,
      date,
      studentId: r.studentId,
      status: r.status,
      markedBy: req.user?.userId,
    }));

    await db.insert(attendanceTable).values(inserts);

    const absentOrLateStudentIds = records
      .filter((r: { status: string }) => r.status === "absent" || r.status === "late")
      .map((r: { studentId: number }) => r.studentId);

    if (absentOrLateStudentIds.length > 0) {
      const studentsWithParents = await db
        .select({ id: studentsTable.id, name: studentsTable.name, parentId: studentsTable.parentId })
        .from(studentsTable)
        .where(inArray(studentsTable.id, absentOrLateStudentIds));

      const notifications = studentsWithParents
        .filter(s => s.parentId)
        .map(s => {
          const record = records.find((r: { studentId: number }) => r.studentId === s.id);
          const status = record?.status || "absent";
          return {
            userId: s.parentId as number,
            schoolId: effectiveSchoolId,
            title: status === "absent" ? "Attendance Alert" : "Late Arrival Alert",
            message: `${s.name} was marked ${status} on ${date}. Please contact the school if this is unexpected.`,
            type: status === "absent" ? "warning" : "info",
          };
        });

      if (notifications.length > 0) {
        await db.insert(notificationsTable).values(notifications);
      }
    }

    return res.json({ success: true, message: `Attendance marked for ${inserts.length} students` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error", message: "Failed to mark attendance" });
  }
});

router.post("/qr-scan", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { qrData, schoolId, classId, date } = req.body;
    const effectiveSchoolId = schoolId || req.user?.schoolId;
    if (!qrData || !effectiveSchoolId || !date) return res.status(400).json({ error: "qrData, schoolId, and date required" });
    const qrStr = String(qrData);
    let student: typeof studentsTable.$inferSelect | undefined;

    if (qrStr.startsWith("student:")) {
      const parts = qrStr.split(":");
      if (!parts[1]) return res.status(400).json({ error: "Invalid QR code" });
      const studentId = Number(parts[1]);
      [student] = await db.select().from(studentsTable).where(and(eq(studentsTable.id, studentId), eq(studentsTable.schoolId, effectiveSchoolId)));
    } else if (qrStr.startsWith("MS-")) {
      const dashParts = qrStr.split("-");
      const admissionNo = dashParts.slice(1, -1).join("-");
      [student] = await db.select().from(studentsTable).where(and(eq(studentsTable.admissionNo, admissionNo), eq(studentsTable.schoolId, effectiveSchoolId)));
    } else {
      return res.status(400).json({ error: "Invalid QR code format" });
    }
    if (!student) return res.status(404).json({ error: "Student not found in this school" });
    const sid = student.id;
    const existing = await db.select().from(attendanceTable).where(and(eq(attendanceTable.studentId, sid), eq(attendanceTable.date, date), eq(attendanceTable.schoolId, effectiveSchoolId))).limit(1);
    if (existing.length) {
      const [updated] = await db.update(attendanceTable).set({ status: "present", markedBy: req.user?.userId }).where(eq(attendanceTable.id, existing[0].id)).returning();
      return res.json({ success: true, student, attendance: updated, alreadyMarked: true });
    }
    const [att] = await db.insert(attendanceTable).values({ studentId: sid, schoolId: effectiveSchoolId, classId: classId || student.classId || 1, date, status: "present", markedBy: req.user?.userId }).returning();
    return res.json({ success: true, student, attendance: att, alreadyMarked: false });
  } catch (err) { console.error(err); return res.status(500).json({ error: "QR scan failed" }); }
});

export default router;
