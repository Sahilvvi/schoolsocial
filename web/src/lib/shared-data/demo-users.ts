/**
 * Shared demo credentials used by both the web app and mobile app.
 *
 * A single source of truth so credential changes propagate everywhere.
 */

export type DemoRole = "admin" | "school" | "parent" | "teacher" | "tuition_center";

export interface DemoUser {
  readonly email: string;
  readonly password: string;
  readonly role: DemoRole;
  readonly id: string;
  readonly name: string;
}

export const DEMO_USERS = {
  admin:   { email: "admin@myschool.demo",   password: "Demo@1234", role: "admin"          as const, id: "demo-admin-001",   name: "Admin User" },
  school:  { email: "school@myschool.demo",  password: "Demo@1234", role: "school"         as const, id: "demo-school-001",  name: "School Manager" },
  parent:  { email: "parent@myschool.demo",  password: "Demo@1234", role: "parent"         as const, id: "demo-parent-001",  name: "Rajesh Kumar" },
  teacher: { email: "teacher@myschool.demo", password: "Demo@1234", role: "teacher"        as const, id: "demo-teacher-001", name: "Priya Sharma" },
  tuition: { email: "tuition@myschool.demo", password: "Demo@1234", role: "tuition_center" as const, id: "demo-tuition-001", name: "Tuition Center Admin" },
} as const;

export type DemoUserKey = keyof typeof DEMO_USERS;

const DEMO_EMAILS: Set<string> = new Set(Object.values(DEMO_USERS).map((u) => u.email));
const DEMO_IDS: Set<string> = new Set(Object.values(DEMO_USERS).map((u) => u.id));

export function isDemoEmail(email: string): boolean {
  return DEMO_EMAILS.has(email);
}

export function isDemoUserId(userId: string | undefined): boolean {
  return !!userId && DEMO_IDS.has(userId);
}

export function getDemoUser(email: string): DemoUser | null {
  return Object.values(DEMO_USERS).find((u) => u.email === email) ?? null;
}

export function getDemoUserById(id: string): DemoUser | null {
  return Object.values(DEMO_USERS).find((u) => u.id === id) ?? null;
}
