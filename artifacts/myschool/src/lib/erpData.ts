/**
 * Shared data bridge between the CRM marketplace/role dashboards and the ERP module.
 *
 * This module now persists to Supabase when configured (table `erp_store`), falling
 * back to localStorage/demo data when Supabase is unavailable. The same bridge is
 * used by both the CRM `school-panel` and the ERP `/api` proxy so changes flow
 * end-to-end through the real database.
 */

import { getDemoData, setDemoData } from "@/lib/demoStorage";
import { normalizeClassName } from "@/lib/utils";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import {
  DUMMY_SCHOOLS,
  DUMMY_ADMISSIONS,
} from "@/data/dummyData";

const STORAGE_KEYS = {
  admissions: "admissions",
  students: "students",
  fees: "fees",
  classes: "classes",
  teachers: "teachers",
  attendance: "attendance",
  erpSchools: "erp-schools",
} as const;

// CRM schools use string ids like "school-001". ERP APIs use numeric ids.
// Keep a deterministic mapping so the two sides can talk to each other.
const SCHOOL_NUMERIC_MAP: Record<string, number> = {
  "school-001": 1,
  "school-002": 2,
};
const SCHOOL_STRING_MAP: Record<number, string> = {
  1: "school-001",
  2: "school-002",
};

export function toSchoolIdString(schoolId: string | number | undefined): string | undefined {
  if (schoolId === undefined || schoolId === null) return undefined;
  if (typeof schoolId === "string") {
    if (schoolId.startsWith("school-")) return schoolId;
    const asNum = Number(schoolId);
    if (!Number.isNaN(asNum)) return SCHOOL_STRING_MAP[asNum];
    return schoolId;
  }
  return SCHOOL_STRING_MAP[schoolId] ?? `school-${String(schoolId).padStart(3, "0")}`;
}

export function toSchoolIdNumber(schoolId: string | number | undefined): number | undefined {
  if (schoolId === undefined || schoolId === null) return undefined;
  if (typeof schoolId === "number") return schoolId;
  if (typeof schoolId === "string" && schoolId.startsWith("school-")) {
    return (SCHOOL_NUMERIC_MAP[schoolId] ?? Number(schoolId.replace("school-", ""))) || undefined;
  }
  const asNum = Number(schoolId);
  return Number.isNaN(asNum) ? undefined : asNum;
}

async function getStored<T>(key: string, fallback: T): Promise<T> {
  if (!isSupabaseConfigured) return getDemoData<T>(key, fallback);
  try {
    const { data, error } = await (supabase as any)
      .from("erp_store")
      .select("value")
      .eq("key", key)
      .maybeSingle();
    if (error || !data || data.value === null || data.value === undefined) return fallback;
    return data.value as T;
  } catch {
    return fallback;
  }
}

async function setStored<T>(key: string, data: T): Promise<void> {
  if (!isSupabaseConfigured) {
    setDemoData(key, data);
    return;
  }
  try {
    await (supabase as any)
      .from("erp_store")
      .upsert({ key, value: data, updated_at: new Date().toISOString() });
  } catch {
    // Silently fail so UI doesn't break on network errors
  }
}

function now(): string {
  return new Date().toISOString();
}

function newNumericId(records: { id?: number }[]): number {
  const max = records.reduce((m, r) => (r.id && r.id > m ? r.id : m), 0);
  return max + 1;
}

function newStringId(prefix: string): string {
  return `demo-${prefix}-${Date.now()}`;
}

// ─── Admissions ─────────────────────────────────────────────────────────────

export type AdmissionStatus = "pending" | "contacted" | "approved" | "rejected";

export interface ErpAdmission {
  id: string;
  school_id: string;
  student_name: string;
  parent_name: string;
  email: string;
  phone: string;
  grade: string;
  status: AdmissionStatus;
  created_at: string;
}

export async function getAdmissions(schoolId?: string | number): Promise<ErpAdmission[]> {
  const schoolString = toSchoolIdString(schoolId);
  const all = await getStored<ErpAdmission[]>(STORAGE_KEYS.admissions, DUMMY_ADMISSIONS as ErpAdmission[]);
  if (!schoolString) return all;
  return all.filter((a) => a.school_id === schoolString);
}

export async function addAdmission(admission: Omit<ErpAdmission, "id" | "status" | "created_at">): Promise<ErpAdmission> {
  const all = await getStored<ErpAdmission[]>(STORAGE_KEYS.admissions, DUMMY_ADMISSIONS as ErpAdmission[]);
  const record: ErpAdmission = {
    ...admission,
    id: newStringId("adm"),
    status: "pending",
    created_at: now(),
  };
  all.unshift(record);
  await setStored(STORAGE_KEYS.admissions, all);
  return record;
}

export async function updateAdmissionStatus(id: string, status: AdmissionStatus): Promise<ErpAdmission | undefined> {
  const all = await getStored<ErpAdmission[]>(STORAGE_KEYS.admissions, DUMMY_ADMISSIONS as ErpAdmission[]);
  const idx = all.findIndex((a) => a.id === id);
  if (idx === -1) return undefined;
  const updated = { ...all[idx], status };
  all[idx] = updated;
  await setStored(STORAGE_KEYS.admissions, all);

  if (status === "approved") {
    await ensureStudentAndFeeFromAdmission(updated);
  }
  return updated;
}

// ─── Students ─────────────────────────────────────────────────────────────────

export interface ErpStudent {
  id: number;
  schoolId: number;
  admissionNo: string;
  name: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  photoUrl?: string;
  qrCode?: string;
  parentName?: string;
  parentPhone?: string;
  parentEmail?: string;
  bloodGroup?: string;
  address?: string;
  className?: string;
  section?: string;
  attendancePercent?: number;
  feePending?: number;
  createdAt?: string;
  classId?: number;
  userId?: number;
  parentId?: number;
  email?: string;
  isAlumni?: boolean;
  status?: string;
}

const DEFAULT_STUDENTS: ErpStudent[] = [
  { id: 1, schoolId: 1, admissionNo: "DPS/2024/001", name: "Arjun Patel", parentName: "Vikram Patel", parentPhone: "9876543210", className: "6", section: "A", attendancePercent: 96, feePending: 0, createdAt: now() },
  { id: 2, schoolId: 1, admissionNo: "DPS/2024/002", name: "Aaradhya Singh", parentName: "Meena Singh", parentPhone: "9876543211", className: "3", section: "B", attendancePercent: 92, feePending: 12000, createdAt: now() },
  { id: 3, schoolId: 2, admissionNo: "MS/2024/101", name: "Rohan Mehta", parentName: "Suresh Mehta", parentPhone: "9876543220", className: "8", section: "A", attendancePercent: 88, feePending: 5000, createdAt: now() },
];

export async function getStudents(schoolId?: string | number, classId?: string | number): Promise<ErpStudent[]> {
  const schoolNum = toSchoolIdNumber(schoolId);
  const all = await getStored<ErpStudent[]>(STORAGE_KEYS.students, DEFAULT_STUDENTS);
  let students = schoolNum ? all.filter((s) => s.schoolId === schoolNum) : all;
  if (classId !== undefined && classId !== null && classId !== "") {
    const classNum = Number(classId);
    const classes = await getClasses(schoolNum);
    const cls = classes.find((c) => c.id === classNum);
    const targetName = cls ? normalizeClassName(cls.name) : "";
    const targetSection = cls?.section;
    students = students.filter((s) =>
      (s.classId && s.classId === classNum) ||
      (targetName && normalizeClassName(s.className) === targetName &&
        (!targetSection || s.section === targetSection))
    );
  }
  return students;
}

export async function getStudentById(id: number, schoolId?: string | number): Promise<ErpStudent | undefined> {
  const students = await getStudents(schoolId);
  return students.find((s) => s.id === id);
}

export async function addStudent(student: Omit<ErpStudent, "id" | "createdAt">): Promise<ErpStudent> {
  const all = await getStored<ErpStudent[]>(STORAGE_KEYS.students, DEFAULT_STUDENTS);
  let resolved = { ...student };
  if (resolved.classId && !normalizeClassName(resolved.className)) {
    const classes = await getClasses(resolved.schoolId);
    const cls = classes.find((c) => String(c.id) === String(resolved.classId));
    if (cls) {
      resolved.className = normalizeClassName(cls.name);
      resolved.section = cls.section || resolved.section;
    }
  }
  resolved.className = normalizeClassName(resolved.className) || resolved.className;
  // Keep numeric classId so class-based filters work later.
  if (resolved.classId) resolved.classId = Number(resolved.classId);
  const record: ErpStudent = { ...resolved, id: newNumericId(all), createdAt: now() };
  all.push(record);
  await setStored(STORAGE_KEYS.students, all);
  return record;
}

export async function updateStudent(id: number, updates: Partial<ErpStudent>): Promise<ErpStudent | undefined> {
  const all = await getStored<ErpStudent[]>(STORAGE_KEYS.students, DEFAULT_STUDENTS);
  const idx = all.findIndex((s) => s.id === id);
  if (idx === -1) return undefined;
  all[idx] = { ...all[idx], ...updates };
  await setStored(STORAGE_KEYS.students, all);
  return all[idx];
}

export async function deleteStudent(id: number): Promise<boolean> {
  const all = await getStored<ErpStudent[]>(STORAGE_KEYS.students, DEFAULT_STUDENTS);
  const next = all.filter((s) => s.id !== id);
  if (next.length === all.length) return false;
  await setStored(STORAGE_KEYS.students, next);
  return true;
}

async function ensureStudentAndFeeFromAdmission(admission: ErpAdmission): Promise<void> {
  const schoolNum = toSchoolIdNumber(admission.school_id);
  if (!schoolNum) return;
  const students = await getStudents(schoolNum);
  const existing = students.find((s) => s.name === admission.student_name && s.parentName === admission.parent_name);
  if (existing) return;

  const student = await addStudent({
    schoolId: schoolNum,
    admissionNo: `ADM/${admission.id.replace(/\D/g, "").slice(-6) || String(Date.now()).slice(-6)}`,
    name: admission.student_name,
    parentName: admission.parent_name,
    parentPhone: admission.phone,
    email: admission.email,
    className: normalizeClassName(admission.grade),
    section: "A",
    attendancePercent: 0,
    feePending: 0,
  });

  await addFee({
    schoolId: schoolNum,
    studentId: student.id,
    studentName: student.name,
    className: student.className,
    amount: 50000,
    feeType: "Annual Tuition",
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    status: "pending",
    description: "Auto-generated fee record after admission approval",
  });
}

// ─── Fees ─────────────────────────────────────────────────────────────────────

export type FeeStatus = "pending" | "paid" | "overdue";

export interface ErpFee {
  id: number;
  schoolId: number;
  studentId: number;
  studentName?: string;
  className?: string;
  amount: number;
  feeType?: string;
  dueDate?: string;
  paidDate?: string;
  status: FeeStatus;
  description?: string;
}

const DEFAULT_FEES: ErpFee[] = [
  { id: 1, schoolId: 1, studentId: 1, studentName: "Arjun Patel", className: "6", amount: 50000, feeType: "Annual Tuition", dueDate: "2025-04-15", status: "paid", paidDate: "2025-03-20", description: "Full year" },
  { id: 2, schoolId: 1, studentId: 2, studentName: "Aaradhya Singh", className: "3", amount: 45000, feeType: "Annual Tuition", dueDate: "2025-04-15", status: "pending", description: "First term pending" },
  { id: 3, schoolId: 2, studentId: 3, studentName: "Rohan Mehta", className: "8", amount: 60000, feeType: "Annual Tuition", dueDate: "2025-04-20", status: "overdue", description: "Overdue" },
];

export async function getFees(schoolId?: string | number): Promise<ErpFee[]> {
  const schoolNum = toSchoolIdNumber(schoolId);
  const all = await getStored<ErpFee[]>(STORAGE_KEYS.fees, DEFAULT_FEES);
  if (!schoolNum) return all;
  return all.filter((f) => f.schoolId === schoolNum);
}

export async function addFee(fee: Omit<ErpFee, "id">): Promise<ErpFee> {
  const all = await getStored<ErpFee[]>(STORAGE_KEYS.fees, DEFAULT_FEES);
  let resolved = { ...fee };
  if ((!resolved.studentName || !resolved.className) && resolved.studentId) {
    const student = await getStudentById(resolved.studentId, resolved.schoolId);
    if (student) {
      resolved.studentName = resolved.studentName || student.name;
      resolved.className = resolved.className || normalizeClassName(student.className) || student.className;
      resolved.section = resolved.section || student.section;
    }
  }
  const record: ErpFee = { ...resolved, id: newNumericId(all) };
  all.push(record);
  await setStored(STORAGE_KEYS.fees, all);
  return record;
}

export async function updateFee(id: number, updates: Partial<ErpFee>): Promise<ErpFee | undefined> {
  const all = await getStored<ErpFee[]>(STORAGE_KEYS.fees, DEFAULT_FEES);
  const idx = all.findIndex((f) => f.id === id);
  if (idx === -1) return undefined;
  all[idx] = { ...all[idx], ...updates };
  await setStored(STORAGE_KEYS.fees, all);
  return all[idx];
}

export async function payFee(id: number): Promise<ErpFee | undefined> {
  return updateFee(id, { status: "paid", paidDate: new Date().toISOString().split("T")[0] });
}

// ─── Classes ──────────────────────────────────────────────────────────────────

export interface ErpClass {
  id: number;
  schoolId: number;
  name: string;
  section?: string;
  teacherId?: number;
  teacherName?: string;
  studentCount?: number;
  subject?: string;
  room?: string;
  grade?: string;
}

const DEFAULT_CLASSES: ErpClass[] = [
  { id: 1, schoolId: 1, name: "6", section: "A", teacherId: 1, teacherName: "Priya Sharma", studentCount: 32, subject: "Maths" },
  { id: 2, schoolId: 1, name: "3", section: "B", teacherId: 2, teacherName: "Rahul Verma", studentCount: 28, subject: "Science" },
  { id: 3, schoolId: 2, name: "8", section: "A", teacherId: 3, teacherName: "Anita Rao", studentCount: 30, subject: "English" },
];

export async function getClasses(schoolId?: string | number): Promise<ErpClass[]> {
  const schoolNum = toSchoolIdNumber(schoolId);
  const all = await getStored<ErpClass[]>(STORAGE_KEYS.classes, DEFAULT_CLASSES);
  if (!schoolNum) return all;
  return all.filter((c) => c.schoolId === schoolNum);
}

export async function addClass(cls: Omit<ErpClass, "id">): Promise<ErpClass> {
  const all = await getStored<ErpClass[]>(STORAGE_KEYS.classes, DEFAULT_CLASSES);
  const record: ErpClass = { ...cls, id: newNumericId(all) };
  all.push(record);
  await setStored(STORAGE_KEYS.classes, all);
  return record;
}

export async function updateClass(id: number, updates: Partial<ErpClass>): Promise<ErpClass | undefined> {
  const all = await getStored<ErpClass[]>(STORAGE_KEYS.classes, DEFAULT_CLASSES);
  const idx = all.findIndex((c) => c.id === id);
  if (idx === -1) return undefined;
  all[idx] = { ...all[idx], ...updates };
  await setStored(STORAGE_KEYS.classes, all);
  return all[idx];
}

export async function deleteClass(id: number): Promise<boolean> {
  const all = await getStored<ErpClass[]>(STORAGE_KEYS.classes, DEFAULT_CLASSES);
  const next = all.filter((c) => c.id !== id);
  if (next.length === all.length) return false;
  await setStored(STORAGE_KEYS.classes, next);
  return true;
}

// ─── Teachers ───────────────────────────────────────────────────────────────────

export interface ErpTeacher {
  id: number;
  schoolId: number;
  name: string;
  email?: string;
  phone?: string;
  subjects?: string[];
  qualification?: string;
  experience?: number;
  photoUrl?: string;
  assignedClasses?: string[];
  joinedAt?: string;
}

const DEFAULT_TEACHERS: ErpTeacher[] = [
  { id: 1, schoolId: 1, name: "Priya Sharma", email: "teacher@myschool.demo", phone: "9876543301", subjects: ["Mathematics"], qualification: "M.Sc. Mathematics", experience: 8, assignedClasses: ["6-A"], joinedAt: now() },
  { id: 2, schoolId: 1, name: "Rahul Verma", email: "rahul.verma@myschool.demo", phone: "9876543302", subjects: ["Science"], qualification: "M.Sc. Physics", experience: 5, assignedClasses: ["3-B"], joinedAt: now() },
  { id: 3, schoolId: 2, name: "Anita Rao", email: "anita.rao@myschool.demo", phone: "9876543303", subjects: ["English"], qualification: "M.A. English", experience: 10, assignedClasses: ["8-A"], joinedAt: now() },
];

export async function getTeachers(schoolId?: string | number): Promise<ErpTeacher[]> {
  const schoolNum = toSchoolIdNumber(schoolId);
  const all = await getStored<ErpTeacher[]>(STORAGE_KEYS.teachers, DEFAULT_TEACHERS);
  if (!schoolNum) return all;
  return all.filter((t) => t.schoolId === schoolNum);
}

export async function addTeacher(teacher: Omit<ErpTeacher, "id" | "joinedAt">): Promise<ErpTeacher> {
  const all = await getStored<ErpTeacher[]>(STORAGE_KEYS.teachers, DEFAULT_TEACHERS);
  const record: ErpTeacher = { ...teacher, id: newNumericId(all), joinedAt: now() };
  all.push(record);
  await setStored(STORAGE_KEYS.teachers, all);
  return record;
}

export async function updateTeacher(id: number, updates: Partial<ErpTeacher>): Promise<ErpTeacher | undefined> {
  const all = await getStored<ErpTeacher[]>(STORAGE_KEYS.teachers, DEFAULT_TEACHERS);
  const idx = all.findIndex((t) => t.id === id);
  if (idx === -1) return undefined;
  all[idx] = { ...all[idx], ...updates };
  await setStored(STORAGE_KEYS.teachers, all);
  return all[idx];
}

export async function deleteTeacher(id: number): Promise<boolean> {
  const all = await getStored<ErpTeacher[]>(STORAGE_KEYS.teachers, DEFAULT_TEACHERS);
  const next = all.filter((t) => t.id !== id);
  if (next.length === all.length) return false;
  await setStored(STORAGE_KEYS.teachers, next);
  return true;
}

// ─── Attendance ─────────────────────────────────────────────────────────────

export interface ErpAttendance {
  id: number;
  schoolId?: number;
  studentId: number;
  studentName?: string;
  classId?: number;
  date: string;
  status: "present" | "absent" | "late";
  remarks?: string;
}

const DEFAULT_ATTENDANCE: ErpAttendance[] = [
  { id: 1, schoolId: 1, studentId: 1, studentName: "Arjun Patel", classId: 1, date: new Date().toISOString().split("T")[0], status: "present" },
  { id: 2, schoolId: 1, studentId: 2, studentName: "Aaradhya Singh", classId: 2, date: new Date().toISOString().split("T")[0], status: "present" },
];

export async function getAttendance(schoolId?: string | number, params?: { studentId?: number; classId?: number; startDate?: string; endDate?: string }): Promise<ErpAttendance[]> {
  const schoolNum = toSchoolIdNumber(schoolId);
  const all = await getStored<ErpAttendance[]>(STORAGE_KEYS.attendance, DEFAULT_ATTENDANCE);
  return all.filter((a) => {
    if (schoolNum && a.schoolId !== schoolNum) return false;
    if (params?.studentId !== undefined && a.studentId !== params.studentId) return false;
    if (params?.classId !== undefined && a.classId !== params.classId) return false;
    if (params?.startDate && a.date < params.startDate) return false;
    if (params?.endDate && a.date > params.endDate) return false;
    return true;
  });
}

export async function markAttendance(records: Omit<ErpAttendance, "id">[]): Promise<ErpAttendance[]> {
  const all = await getStored<ErpAttendance[]>(STORAGE_KEYS.attendance, DEFAULT_ATTENDANCE);
  const created = records.map((r) => ({ ...r, id: newNumericId(all) })) as ErpAttendance[];
  all.push(...created);
  await setStored(STORAGE_KEYS.attendance, all);
  return created;
}

// ─── Schools ────────────────────────────────────────────────────────────────────

export interface ErpSchool {
  id: number;
  name: string;
  slug: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  board?: string;
  type?: "government" | "private" | "aided";
  logoUrl?: string;
  coverUrl?: string;
  website?: string;
  description?: string;
  facilities?: string[];
  status: "pending" | "approved" | "suspended";
  subscriptionPlan?: "free" | "basic" | "premium";
  averageRating?: number;
  reviewCount?: number;
  totalStudents?: number;
  totalTeachers?: number;
  createdAt?: string;
  about?: string;
  gallery?: string[];
}

export async function getErpSchools(): Promise<ErpSchool[]> {
  const stored = await getStored<ErpSchool[]>(STORAGE_KEYS.erpSchools, []);
  if (stored.length) return JSON.parse(JSON.stringify(stored));
  const fallback = DUMMY_SCHOOLS.map((s, i) => ({
    id: toSchoolIdNumber(s.id) ?? i + 1,
    name: s.name,
    slug: s.slug,
    email: "contact@" + s.slug + ".demo",
    phone: "+91-98765432" + String(i + 10).slice(-2),
    address: s.location,
    city: "New Delhi",
    state: "Delhi",
    pincode: "110001",
    board: s.board,
    type: "private" as const,
    logoUrl: s.banner,
    coverUrl: s.banner,
    website: `https://${s.slug}.demo`,
    description: s.description,
    about: (s as any).about,
    gallery: (s as any).gallery,
    facilities: s.facilities,
    status: (s as any).status || "approved",
    subscriptionPlan: "basic" as const,
    averageRating: s.rating,
    reviewCount: s.review_count,
    totalStudents: 500,
    totalTeachers: 35,
    createdAt: s.created_at,
  }));
  await setStored(STORAGE_KEYS.erpSchools, fallback);
  return JSON.parse(JSON.stringify(fallback));
}

export async function getErpSchoolById(id: number): Promise<ErpSchool | undefined> {
  const schools = await getErpSchools();
  return schools.find((s) => s.id === id);
}

export async function saveErpSchools(schools: ErpSchool[]): Promise<void> {
  await setStored(STORAGE_KEYS.erpSchools, schools);
}
