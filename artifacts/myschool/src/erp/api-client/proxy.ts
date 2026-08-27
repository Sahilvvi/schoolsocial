/**
 * Client-side ERP API proxy.
 *
 * The ERP module was generated against a backend that does not yet exist. Rather
 * than leave every ERP page broken, this proxy intercepts `/api/*` fetch calls
 * inside the browser and serves them from the same shared demo store (`erpData`)
 * that the CRM role dashboards write to. When the real Express API is built, this
 * shim can be removed and the same fetch calls will hit the server unchanged.
 */

import {
  getAdmissions,
  addAdmission,
  updateAdmissionStatus,
  getStudents,
  getStudentById,
  addStudent,
  updateStudent,
  deleteStudent,
  getFees,
  addFee,
  payFee,
  getClasses,
  addClass,
  updateClass,
  deleteClass,
  getTeachers,
  addTeacher,
  updateTeacher,
  deleteTeacher,
  getAttendance,
  markAttendance,
  getErpSchools,
  getErpSchoolById,
  saveErpSchools,
  toSchoolIdString,
  toSchoolIdNumber,
  getGenericRecords,
  addGenericRecord,
  updateGenericRecord,
  deleteGenericRecord,
  type ErpStudent,
  type ErpFee,
  type ErpClass,
  type ErpTeacher,
  type ErpSchool,
  type AdmissionStatus,
} from "@/lib/erpData";
import { DEMO_USERS, getDemoUserById } from "@/data/dummyData";
import type { DemoUser } from "@/lib/shared-data";


let installed = false;

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function errorResponse(message: string, status = 400): Response {
  return jsonResponse({ error: message, message }, status);
}

function resolveUrl(input: RequestInfo | URL): URL {
  if (input instanceof URL) return input;
  if (typeof input === "string") return new URL(input, window.location.origin);
  return new URL(input.url, window.location.origin);
}

function getCurrentDemoUser() {
  const email = localStorage.getItem("demo_user_email");
  const token = localStorage.getItem("myschool_token") || "";
  let id: string | undefined;
  if (token.startsWith("demo-token-")) {
    id = token.replace("demo-token-", "");
  } else if (email) {
    const demo = Object.values(DEMO_USERS).find((u) => u.email === email);
    if (demo) id = demo.id;
  }
  if (!id) return undefined;
  return getDemoUserById(id) || undefined;
}

function demoUserToProfile(user: DemoUser) {
  const roleMap: Record<string, string> = {
    admin: "super_admin",
    school: "school_admin",
    parent: "parent",
    teacher: "teacher",
    tuition_center: "school_admin",
  };
  const idMap: Record<string, number> = {
    "demo-admin-001": 1,
    "demo-school-001": 2,
    "demo-parent-001": 3,
    "demo-teacher-001": 4,
    "demo-tuition-001": 5,
  };
  const role = roleMap[user.role] || user.role;
  return {
    id: idMap[user.id] ?? 99,
    name: user.name,
    email: user.email,
    role,
    schoolId: role === "super_admin" ? undefined : 1,
    avatarUrl: undefined,
    createdAt: new Date().toISOString(),
  };
}

// Admission statuses differ slightly between the CRM (`pending`/`approved`) and
// the ERP inquiry page (`new`/`contacted`/`enrolled`). Map them transparently.
const ERP_STATUS_TO_INTERNAL: Record<string, AdmissionStatus> = {
  new: "pending",
  contacted: "contacted",
  enrolled: "approved",
  rejected: "rejected",
};

const INTERNAL_STATUS_TO_ERP: Record<AdmissionStatus, string> = {
  pending: "new",
  contacted: "contacted",
  approved: "enrolled",
  rejected: "rejected",
};

function coerceBody<T extends object>(body: string | undefined, fallback: T): T {
  if (!body) return fallback;
  try {
    return { ...fallback, ...JSON.parse(body) };
  } catch {
    return fallback;
  }
}

function readBody(init?: RequestInit): Promise<string | undefined> {
  if (!init?.body) return Promise.resolve(undefined);
  if (typeof init.body === "string") return Promise.resolve(init.body);
  if (init.body instanceof FormData) return Promise.resolve(undefined);
  if (init.body instanceof URLSearchParams) return Promise.resolve(init.body.toString());
  if (init.body instanceof Blob) {
    return init.body.text();
  }
  if (typeof (init.body as any).text === "function") {
    return (init.body as any).text();
  }
  return Promise.resolve(undefined);
}

function listResponse(key: string, items: unknown[], extra: Record<string, unknown> = {}) {
  return jsonResponse({ [key]: items, total: items.length, ...extra });
}

function fallbackResponse(url: URL): Response {
  const segments = url.pathname.split("/").filter(Boolean);
  const last = segments[segments.length - 1] || "items";
  const key = last === "api" ? "items" : last;
  return listResponse(key, []);
}

async function handleApiRequest(url: URL, init?: RequestInit): Promise<Response> {
  const method = (init?.method || "GET").toUpperCase();
  const bodyText = await readBody(init);
  const body = bodyText ? JSON.parse(bodyText || "{}") : {};
  const params = url.searchParams;

  const segments = url.pathname.split("/").filter(Boolean);
  // segments: ["api", "students"] or ["api", "students", "123"]

  const pathStartsWith = (prefix: string[]) => {
    for (let i = 0; i < prefix.length; i++) {
      if (segments[i + 1] !== prefix[i]) return false;
    }
    return true;
  };

  // ─── Auth ─────────────────────────────────────────────────────────────────
  if (pathStartsWith(["auth", "login"]) && method === "POST") {
    const identifier = body.identifier || "";
    const password = body.password || "";
    const demo = Object.values(DEMO_USERS).find((u) => u.email === identifier);
    if (demo && demo.password === password) {
      const profile = demoUserToProfile(demo);
      const token = `demo-token-${demo.id}`;
      localStorage.setItem("myschool_token", token);
      localStorage.setItem("demo_user_email", demo.email);
      return jsonResponse({ token, user: profile });
    }
    return errorResponse("Invalid credentials", 401);
  }

  if (pathStartsWith(["auth", "me"]) && method === "GET") {
    const demo = getCurrentDemoUser();
    if (!demo) return errorResponse("Unauthorized", 401);
    return jsonResponse(demoUserToProfile(demo));
  }

  if (pathStartsWith(["auth", "logout"])) {
    localStorage.removeItem("myschool_token");
    return jsonResponse({ success: true });
  }

  // ─── Schools ────────────────────────────────────────────────────────────────
  if (pathStartsWith(["schools"]) && segments.length === 2) {
    if (method === "GET") {
      let schools = await getErpSchools();
      const status = params.get("status");
      const search = params.get("search");
      if (status) schools = schools.filter((s) => s.status === status);
      if (search) {
        const q = search.toLowerCase();
        schools = schools.filter((s) => s.name.toLowerCase().includes(q) || s.city?.toLowerCase().includes(q));
      }
      return listResponse("schools", schools);
    }
    if (method === "POST") {
      const schools = await getErpSchools();
      const record: ErpSchool = {
        id: schools.length ? Math.max(...schools.map((s) => s.id)) + 1 : 1,
        name: body.name || "New School",
        slug: body.slug || `school-${Date.now()}`,
        status: "pending",
        ...body,
      };
      schools.push(record);
      await saveErpSchools(schools);
      return jsonResponse(record, 201);
    }
  }

  if (pathStartsWith(["schools"]) && segments.length === 3) {
    const id = Number(segments[2]);
    if (method === "GET" || method === "PATCH" || method === "DELETE") {
      const schools = await getErpSchools();
      const idx = schools.findIndex((s) => s.id === id);
      if (idx === -1) return errorResponse("School not found", 404);
      if (method === "GET") return jsonResponse(schools[idx]);
      if (method === "DELETE") {
        schools.splice(idx, 1);
        await saveErpSchools(schools);
        return jsonResponse({ success: true });
      }
      schools[idx] = { ...schools[idx], ...body };
      await saveErpSchools(schools);
      return jsonResponse(schools[idx]);
    }
  }

  if (pathStartsWith(["schools", "", "impersonate"]) && segments.length === 4) {
    const id = Number(segments[2]);
    const school = await getErpSchoolById(id);
    if (!school) return errorResponse("School not found", 404);
    const demo = getCurrentDemoUser();
    const base = demo ? demoUserToProfile(demo) : { id: 1, name: "Admin", role: "super_admin" };
    return jsonResponse({
      token: `impersonate-${id}`,
      user: { ...base, schoolId: id, role: "school_admin" },
    });
  }

  if (pathStartsWith(["schools"]) && segments.length === 4 && segments[3] === "stats") {
    const id = Number(segments[2]);
    return jsonResponse({
      schoolId: id,
      totalStudents: (await getStudents(id)).length,
      totalTeachers: (await getTeachers(id)).length,
      totalClasses: (await getClasses(id)).length,
      totalFees: (await getFees(id)).reduce((sum, f) => sum + (f.status === "pending" ? f.amount : 0), 0),
    });
  }

  // ─── Admissions / Inquiries ───────────────────────────────────────────────
  if (pathStartsWith(["admissions", "inquiry"])) {
    const schoolIdParam = params.get("schoolId") || "1";
    const schoolNum = Number(schoolIdParam) || 1;
    const schoolString = toSchoolIdString(schoolNum);

    if (method === "GET") {
      const admissions = (await getAdmissions(schoolString)).map((a) => ({
        id: a.id,
        schoolId: schoolNum,
        studentName: a.student_name,
        parentName: a.parent_name,
        parentEmail: a.email,
        parentPhone: a.phone,
        email: a.email,
        phone: a.phone,
        grade: a.grade,
        gradeApplying: a.grade,
        status: INTERNAL_STATUS_TO_ERP[a.status] || a.status,
        createdAt: a.created_at,
      }));
      return jsonResponse({ inquiries: admissions, total: admissions.length });
    }

    if (method === "POST") {
      const record = await addAdmission({
        school_id: schoolString!,
        student_name: body.studentName || body.student_name || "",
        parent_name: body.parentName || body.parent_name || "",
        email: body.parentEmail || body.email || "",
        phone: body.parentPhone || body.phone || "",
        grade: body.gradeApplying || body.grade || "",
      });
      return jsonResponse({
        id: record.id,
        schoolId: schoolNum,
        studentName: record.student_name,
        parentName: record.parent_name,
        parentEmail: record.email,
        parentPhone: record.phone,
        email: record.email,
        phone: record.phone,
        grade: record.grade,
        gradeApplying: record.grade,
        status: INTERNAL_STATUS_TO_ERP[record.status] || record.status,
        createdAt: record.created_at,
      }, 201);
    }

    if (method === "PATCH" && segments.length === 4) {
      const id = segments[3];
      const status = ERP_STATUS_TO_INTERNAL[body.status] || body.status;
      const updated = await updateAdmissionStatus(id, status);
      if (!updated) return errorResponse("Inquiry not found", 404);
      return jsonResponse({
        id: updated.id,
        schoolId: schoolNum,
        studentName: updated.student_name,
        parentName: updated.parent_name,
        parentEmail: updated.email,
        parentPhone: updated.phone,
        email: updated.email,
        phone: updated.phone,
        grade: updated.grade,
        gradeApplying: updated.grade,
        status: INTERNAL_STATUS_TO_ERP[updated.status] || updated.status,
        createdAt: updated.created_at,
      });
    }
  }

  // ─── Students ─────────────────────────────────────────────────────────────
  if (pathStartsWith(["students"])) {
    const schoolIdParam = params.get("schoolId") || "1";
    const schoolNum = Number(schoolIdParam) || 1;

    if (segments.length === 2) {
      if (method === "GET") {
        const search = params.get("search")?.toLowerCase();
        const classId = params.get("classId");
        let students = await getStudents(schoolNum, classId || undefined);
        if (search) students = students.filter((s) => s.name.toLowerCase().includes(search) || s.admissionNo?.toLowerCase().includes(search));
        return listResponse("students", students);
      }
      if (method === "POST") {
        const record = await addStudent({
          schoolId: schoolNum,
          admissionNo: body.admissionNo || `STU/${Date.now()}`,
          name: body.name,
          dateOfBirth: body.dateOfBirth,
          gender: (body.gender || "male") as ErpStudent["gender"],
          parentName: body.parentName,
          parentPhone: body.parentPhone,
          parentEmail: body.parentEmail,
          bloodGroup: body.bloodGroup,
          address: body.address,
          className: body.className,
          section: body.section,
          classId: body.classId ? Number(body.classId) : undefined,
          attendancePercent: Number(body.attendancePercent ?? 0),
          feePending: Number(body.feePending ?? 0),
        });
        return jsonResponse(record, 201);
      }
    }

    if (segments.length === 3) {
      const id = Number(segments[2]);
      if (method === "GET") {
        const student = await getStudentById(id, schoolNum);
        return student ? jsonResponse(student) : errorResponse("Student not found", 404);
      }
      if (method === "PATCH") {
        const updated = await updateStudent(id, body);
        return updated ? jsonResponse(updated) : errorResponse("Student not found", 404);
      }
      if (method === "DELETE") {
        return await deleteStudent(id) ? jsonResponse({ success: true }) : errorResponse("Student not found", 404);
      }
    }
  }

  // ─── Teachers ───────────────────────────────────────────────────────────────
  if (pathStartsWith(["teachers"])) {
    const schoolIdParam = params.get("schoolId") || "1";
    const schoolNum = Number(schoolIdParam) || 1;

    if (segments.length === 2) {
      if (method === "GET") {
        const teachers = await getTeachers(schoolNum);
        return listResponse("teachers", teachers);
      }
      if (method === "POST") {
        const record = await addTeacher({
          schoolId: schoolNum,
          name: body.name,
          email: body.email,
          phone: body.phone,
          subjects: body.subjects,
          qualification: body.qualification,
          experience: body.experience ? Number(body.experience) : undefined,
          photoUrl: body.photoUrl,
          assignedClasses: body.assignedClasses,
        });
        return jsonResponse(record, 201);
      }
    }

    if (segments.length === 3) {
      const id = Number(segments[2]);
      if (method === "GET") {
        const teachers = await getTeachers(schoolNum);
        const teacher = teachers.find((t) => t.id === id);
        return teacher ? jsonResponse(teacher) : errorResponse("Teacher not found", 404);
      }
      if (method === "PATCH") {
        const updated = await updateTeacher(id, body);
        return updated ? jsonResponse(updated) : errorResponse("Teacher not found", 404);
      }
      if (method === "DELETE") {
        return await deleteTeacher(id) ? jsonResponse({ success: true }) : errorResponse("Teacher not found", 404);
      }
    }
  }

  // ─── Classes ──────────────────────────────────────────────────────────────
  if (pathStartsWith(["classes"])) {
    const schoolIdParam = params.get("schoolId") || "1";
    const schoolNum = Number(schoolIdParam) || 1;

    if (segments.length === 2) {
      if (method === "GET") {
        return listResponse("classes", await getClasses(schoolNum));
      }
      if (method === "POST") {
        const record = await addClass({
          schoolId: schoolNum,
          name: body.name,
          section: body.section,
          teacherId: body.teacherId ? Number(body.teacherId) : undefined,
          teacherName: body.teacherName,
          studentCount: body.studentCount ? Number(body.studentCount) : 0,
          subject: body.subject,
          room: body.room,
          grade: body.grade,
        });
        return jsonResponse(record, 201);
      }
    }

    if (segments.length === 3) {
      const id = Number(segments[2]);
      if (method === "GET") {
        const cls = (await getClasses(schoolNum)).find((c) => c.id === id);
        return cls ? jsonResponse(cls) : errorResponse("Class not found", 404);
      }
      if (method === "PATCH") {
        const updated = await updateClass(id, body);
        return updated ? jsonResponse(updated) : errorResponse("Class not found", 404);
      }
      if (method === "DELETE") {
        return await deleteClass(id) ? jsonResponse({ success: true }) : errorResponse("Class not found", 404);
      }
    }
  }

  // ─── Fees ───────────────────────────────────────────────────────────────────
  if (pathStartsWith(["fees"])) {
    const schoolIdParam = params.get("schoolId") || "1";
    const schoolNum = Number(schoolIdParam) || 1;

    if (segments.length === 2) {
      if (method === "GET") {
        let fees = await getFees(schoolNum);
        const studentId = params.get("studentId");
        const status = params.get("status");
        if (studentId) fees = fees.filter((f) => f.studentId === Number(studentId));
        if (status) fees = fees.filter((f) => f.status === status);
        const totalPending = fees.filter((f) => f.status === "pending" || f.status === "overdue").reduce((s, f) => s + f.amount, 0);
        const totalPaid = fees.filter((f) => f.status === "paid").reduce((s, f) => s + f.amount, 0);
        return listResponse("fees", fees, { totalPending, totalPaid });
      }
      if (method === "POST") {
        const record = await addFee({
          schoolId: schoolNum,
          studentId: Number(body.studentId),
          studentName: body.studentName,
          className: body.className,
          amount: Number(body.amount),
          feeType: body.feeType,
          dueDate: body.dueDate,
          description: body.description,
          status: body.status || "pending",
        });
        return jsonResponse(record, 201);
      }
    }

    if (segments.length === 4 && segments[3] === "pay") {
      const id = Number(segments[2]);
      const paid = await payFee(id);
      return paid ? jsonResponse(paid) : errorResponse("Fee not found", 404);
    }
  }

  // ─── Attendance ─────────────────────────────────────────────────────────────
  if (pathStartsWith(["attendance"])) {
    const schoolIdParam = params.get("schoolId") || "1";
    const schoolNum = Number(schoolIdParam) || 1;

    if (method === "GET") {
      const records = await getAttendance(schoolNum, {
        studentId: params.has("studentId") ? Number(params.get("studentId")) : undefined,
        classId: params.has("classId") ? Number(params.get("classId")) : undefined,
        startDate: params.get("startDate") || undefined,
        endDate: params.get("endDate") || undefined,
      });
      const present = records.filter((r) => r.status === "present").length;
      const absent = records.filter((r) => r.status === "absent").length;
      return listResponse("attendance", records, { presentCount: present, absentCount: absent });
    }

    if (method === "POST") {
      const records = Array.isArray(body.records)
        ? body.records.map((r: any) => ({
            schoolId: schoolNum,
            studentId: Number(r.studentId),
            studentName: r.studentName,
            classId: r.classId ? Number(r.classId) : undefined,
            date: r.date || new Date().toISOString().split("T")[0],
            status: r.status || "present",
            remarks: r.remarks,
          }))
        : [
            {
              schoolId: schoolNum,
              studentId: Number(body.studentId),
              studentName: body.studentName,
              classId: body.classId ? Number(body.classId) : undefined,
              date: body.date || new Date().toISOString().split("T")[0],
              status: body.status || "present",
              remarks: body.remarks,
            },
          ];
      const created = await markAttendance(records);
      return listResponse("attendance", created);
    }
  }

  // ─── Discipline (custom response shape) ─────────────────────────────────────
  if (pathStartsWith(["discipline"])) {
    const schoolIdParam = params.get("schoolId") || "1";
    const schoolNum = Number(schoolIdParam) || 1;

    if (segments.length === 2) {
      if (method === "GET") {
        const records = await getGenericRecords("discipline", schoolNum);
        return jsonResponse({ records });
      }
      if (method === "POST") {
        const students = await getStudents(schoolNum);
        const student = students.find((s) => String(s.id) === String(body.studentId));
        const record = await addGenericRecord("discipline", schoolNum, {
          ...body,
          studentName: student?.name || body.studentName || "Unknown",
          status: body.status || "open",
          schoolId: schoolNum,
        });
        return jsonResponse(record, 201);
      }
    }

    if (segments.length === 3) {
      const id = segments[2];
      if (method === "GET") {
        const records = await getGenericRecords("discipline", schoolNum);
        const record = records.find((r) => String(r.id) === String(id));
        return record ? jsonResponse(record) : errorResponse("Record not found", 404);
      }
      if (method === "PATCH") {
        const updated = await updateGenericRecord("discipline", id, { ...body, schoolId: schoolNum });
        return updated ? jsonResponse(updated) : errorResponse("Record not found", 404);
      }
      if (method === "DELETE") {
        const deleted = await deleteGenericRecord("discipline", id);
        return deleted ? jsonResponse({ success: true }) : errorResponse("Record not found", 404);
      }
    }
  }

  // ─── Gallery (custom response shape) ──────────────────────────────────────
  if (pathStartsWith(["gallery"])) {
    const schoolIdParam = params.get("schoolId") || "1";
    const schoolNum = Number(schoolIdParam) || 1;

    if (segments.length === 2) {
      if (method === "GET") {
        const images = await getGenericRecords("gallery", schoolNum);
        return jsonResponse({ images, total: images.length });
      }
      if (method === "POST") {
        const image = await addGenericRecord("gallery", schoolNum, {
          imageUrl: body.imageUrl,
          caption: body.caption || "",
          schoolId: schoolNum,
        });
        return jsonResponse(image, 201);
      }
    }

    if (segments.length === 3) {
      const id = segments[2];
      if (method === "GET") {
        const images = await getGenericRecords("gallery", schoolNum);
        const image = images.find((i) => String(i.id) === String(id));
        return image ? jsonResponse(image) : errorResponse("Image not found", 404);
      }
      if (method === "DELETE") {
        const deleted = await deleteGenericRecord("gallery", id);
        return deleted ? jsonResponse({ success: true }) : errorResponse("Image not found", 404);
      }
    }
  }

  // ─── Generic CRUD tables ──────────────────────────────────────────────────
  const simpleTables = [
    "notices",
    "events",
    "reviews",
    "jobs",
    "job-applications",
    "applications",
    "homework",
    "assignments",
    "timetable",
    "exams",
    "study-materials",
    "syllabus",
    "library",
    "issues",
    "messages",
    "leaves",
    "student-leaves",
    "student-health",
    "quizzes",
    "transport",
    "payroll",
    "notifications",
  ];

  const tableName = segments[1];
  if (simpleTables.includes(tableName)) {
    const schoolIdParam = params.get("schoolId") || "1";
    const schoolNum = Number(schoolIdParam) || 1;

    if (method === "GET" && segments.length === 2) {
      const items = await getGenericRecords(tableName, schoolNum);
      return listResponse(tableName, items);
    }
    if (method === "POST" && segments.length === 2) {
      const item = await addGenericRecord(tableName, schoolNum, { ...body, schoolId: schoolNum });
      return jsonResponse(item, 201);
    }
    if (segments.length === 3) {
      const id = segments[2];
      if (method === "GET") {
        const items = await getGenericRecords(tableName, schoolNum);
        const item = items.find((i) => String(i.id) === String(id));
        return item ? jsonResponse(item) : errorResponse("Not found", 404);
      }
      if (method === "PATCH") {
        const updated = await updateGenericRecord(tableName, id, { ...body, schoolId: schoolNum });
        return updated ? jsonResponse(updated) : errorResponse("Not found", 404);
      }
      if (method === "DELETE") {
        const deleted = await deleteGenericRecord(tableName, id);
        return deleted ? jsonResponse({ success: true }) : errorResponse("Not found", 404);
      }
    }

    // Fallback for any other sub-route under the table.
    const key = segments.length >= 3 ? segments[segments.length - 1] : tableName;
    return listResponse(key, []);
  }

  // ─── Platform / Support stubs ─────────────────────────────────────────────
  if (pathStartsWith(["platform", "stats"])) {
    return jsonResponse({
      totalSchools: (await getErpSchools()).length,
      pendingSchools: 0,
      totalStudents: (await getStudents()).length,
      totalTeachers: (await getTeachers()).length,
      activeParents: 3,
      totalRevenue: 1250000,
      monthlyGrowth: 12,
      totalJobs: 0,
      totalReviews: 0,
    });
  }
  if (pathStartsWith(["platform", "revenue"]) || pathStartsWith(["platform", "growth"])) {
    return jsonResponse({ revenue: 1250000, growth: 12, monthly: [] });
  }
  if (pathStartsWith(["platform", "users"])) {
    return listResponse("users", []);
  }
  if (pathStartsWith(["platform", "settings"])) {
    if (method === "GET") return jsonResponse({});
    if (method === "PATCH" || method === "POST") return jsonResponse({ success: true });
  }
  if (pathStartsWith(["platform", "audit-logs"])) {
    return jsonResponse({ auditLogs: [], total: 0 });
  }
  if (pathStartsWith(["support", "tickets"])) {
    return jsonResponse({ tickets: [], total: 0 });
  }
  if (pathStartsWith(["support", "announcements"])) {
    return listResponse("announcements", []);
  }

  // ─── AI stub ────────────────────────────────────────────────────────────────
  if (pathStartsWith(["ai", "query"])) {
    return jsonResponse({ answer: "This is a placeholder AI response. Connect a real AI provider here." });
  }

  // Fallback for any other /api call
  return fallbackResponse(url);
}

export function initErpProxy() {
  if (installed) return;
  installed = true;

  const originalFetch = window.fetch.bind(window);

  window.fetch = async (input, init) => {
    const url = resolveUrl(input);

    // Only intercept local API requests
    if (url.pathname.startsWith("/api/")) {
      try {
        return handleApiRequest(url, init);
      } catch (err) {
        console.error("[ERP proxy] error handling request", url.pathname, err);
        return errorResponse("Internal proxy error", 500);
      }
    }

    // For non-API requests, attach the ERP token if available (backwards compat)
    const token = localStorage.getItem("myschool_token");
    if (token && init && typeof init === "object" && !(init as any).headers) {
      const headers = new Headers((init as any).headers);
      if (!headers.has("Authorization")) {
        headers.set("Authorization", `Bearer ${token}`);
        (init as any).headers = headers;
      }
    }

    return originalFetch(input, init);
  };
}
