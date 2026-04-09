import crypto from "crypto";
import { db, usersTable, schoolsTable, teachersTable, studentsTable, classesTable, noticesTable, eventsTable, feesTable, count, eq } from "../../../lib/db/src/index.js";

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "myschool_salt").digest("hex");
}

async function userExists(email: string): Promise<boolean> {
  const [{ c }] = await db.select({ c: count() }).from(usersTable).where(eq(usersTable.email, email));
  return Number(c) > 0;
}

async function schoolExists(slug: string): Promise<number | null> {
  const [school] = await db.select({ id: schoolsTable.id }).from(schoolsTable).where(eq(schoolsTable.slug, slug));
  return school?.id ?? null;
}

export async function seedSuperAdmin(): Promise<void> {
  try {
    // ─── Super Admin ─────────────────────────────────────────────────────────
    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL ?? "superadmin@myschool.in";
    if (!(await userExists(superAdminEmail))) {
      await db.insert(usersTable).values({
        name: process.env.SUPER_ADMIN_NAME ?? "Platform Admin",
        email: superAdminEmail,
        phone: "9000000000",
        passwordHash: hashPassword(process.env.SUPER_ADMIN_PASSWORD ?? "admin123"),
        role: "super_admin",
        isActive: 1,
      });
      console.log(`Super admin seeded: ${superAdminEmail}`);
    }

    // ─── Demo data (only if not already seeded) ───────────────────────────────
    if (await userExists("admin@dps.in")) {
      return; // Demo data already exists
    }

    console.log("Seeding demo schools and users...");

    // ─── School 1: DPS ───────────────────────────────────────────────────────
    let school1Id = await schoolExists("delhi-public-school");
    if (!school1Id) {
      const [s] = await db.insert(schoolsTable).values({
        name: "Delhi Public School",
        slug: "delhi-public-school",
        email: "info@dps.in",
        phone: "9100000001",
        address: "Sector 12, Dwarka",
        city: "Delhi",
        state: "Delhi",
        pincode: "110075",
        board: "CBSE",
        type: "private",
        status: "approved",
        subscriptionPlan: "premium",
        description: "One of India's premier educational institutions with a legacy of excellence.",
      }).returning();
      school1Id = s.id;
    }

    // ─── School 2: KV ────────────────────────────────────────────────────────
    let school2Id = await schoolExists("kendriya-vidyalaya-no1");
    if (!school2Id) {
      const [s] = await db.insert(schoolsTable).values({
        name: "Kendriya Vidyalaya No.1",
        slug: "kendriya-vidyalaya-no1",
        email: "info@kv.in",
        phone: "9100000002",
        address: "Cantonment Area",
        city: "Pune",
        state: "Maharashtra",
        pincode: "411001",
        board: "CBSE",
        type: "government",
        status: "approved",
        subscriptionPlan: "basic",
        description: "Kendriya Vidyalaya - quality education for all.",
      }).returning();
      school2Id = s.id;
    }

    // ─── School Admin 1 ──────────────────────────────────────────────────────
    const [schoolAdmin1] = await db.insert(usersTable).values({
      name: "DPS Admin",
      email: "admin@dps.in",
      phone: "9100000011",
      passwordHash: hashPassword("school123"),
      role: "school_admin",
      schoolId: school1Id,
      isActive: 1,
    }).returning();

    // ─── School Admin 2 ──────────────────────────────────────────────────────
    await db.insert(usersTable).values({
      name: "KV Admin",
      email: "admin@kv.in",
      phone: "9100000012",
      passwordHash: hashPassword("school123"),
      role: "school_admin",
      schoolId: school2Id,
      isActive: 1,
    });

    // ─── Classes ─────────────────────────────────────────────────────────────
    const [cls1] = await db.insert(classesTable).values({ schoolId: school1Id, name: "Class 9", section: "A" }).returning();
    const [cls2] = await db.insert(classesTable).values({ schoolId: school1Id, name: "Class 10", section: "A" }).returning();
    const [cls3] = await db.insert(classesTable).values({ schoolId: school1Id, name: "Class 10", section: "B" }).returning();
    await db.insert(classesTable).values({ schoolId: school2Id, name: "Class 8", section: "A" });

    // ─── Teacher Users + Records ─────────────────────────────────────────────
    const [teacherUser1] = await db.insert(usersTable).values({
      name: "Rajesh Kumar",
      email: "rajesh@dps.in",
      phone: "9100000021",
      passwordHash: hashPassword("teacher123"),
      role: "teacher",
      schoolId: school1Id,
      isActive: 1,
    }).returning();

    const [teacherUser2] = await db.insert(usersTable).values({
      name: "Priya Sharma",
      email: "priya@dps.in",
      phone: "9100000022",
      passwordHash: hashPassword("teacher123"),
      role: "teacher",
      schoolId: school1Id,
      isActive: 1,
    }).returning();

    await db.insert(teachersTable).values({
      schoolId: school1Id,
      userId: teacherUser1.id,
      name: "Rajesh Kumar",
      email: "rajesh@dps.in",
      phone: "9100000021",
      subjects: "Mathematics,Physics",
      qualification: "M.Sc Mathematics",
      experience: 8,
    });

    await db.insert(teachersTable).values({
      schoolId: school1Id,
      userId: teacherUser2.id,
      name: "Priya Sharma",
      email: "priya@dps.in",
      phone: "9100000022",
      subjects: "English,Hindi",
      qualification: "M.A English",
      experience: 5,
    });

    // ─── Parent User ─────────────────────────────────────────────────────────
    const [parentUser] = await db.insert(usersTable).values({
      name: "Ramesh Gupta",
      email: "parent@myschool.in",
      phone: "9876543210",
      passwordHash: hashPassword("parent123"),
      role: "parent",
      schoolId: school1Id,
      isActive: 1,
    }).returning();

    // ─── Student User + Record ────────────────────────────────────────────────
    const [studentUser] = await db.insert(usersTable).values({
      name: "Aarav Gupta",
      email: "student@myschool.in",
      phone: "9876543211",
      passwordHash: hashPassword("student123"),
      role: "student",
      schoolId: school1Id,
      isActive: 1,
    }).returning();

    const [student1] = await db.insert(studentsTable).values({
      schoolId: school1Id,
      classId: cls1.id,
      userId: studentUser.id,
      admissionNo: "DPS2024001",
      name: "Aarav Gupta",
      gender: "male",
      parentId: parentUser.id,
      parentName: "Ramesh Gupta",
      parentPhone: "9876543210",
      parentEmail: "parent@myschool.in",
    }).returning();

    await db.update(studentsTable).set({ qrCode: `student:${student1.id}:DPS2024001` }).where(eq(studentsTable.id, student1.id));

    // Extra students
    for (let i = 2; i <= 8; i++) {
      const admNo = `DPS2024${String(i).padStart(3, "0")}`;
      const [s] = await db.insert(studentsTable).values({
        schoolId: school1Id,
        classId: i <= 4 ? cls1.id : i <= 6 ? cls2.id : cls3.id,
        admissionNo: admNo,
        name: `Student ${i}`,
        gender: i % 2 === 0 ? "female" : "male",
        parentName: `Parent of Student ${i}`,
        parentPhone: `9876543${String(200 + i)}`,
      }).returning();
      await db.update(studentsTable).set({ qrCode: `student:${s.id}:${admNo}` }).where(eq(studentsTable.id, s.id));
    }

    // ─── Job Seeker User ──────────────────────────────────────────────────────
    await db.insert(usersTable).values({
      name: "Anjali Singh",
      email: "jobseeker@myschool.in",
      phone: "9800000001",
      passwordHash: hashPassword("job123"),
      role: "job_seeker",
      isActive: 1,
    });

    // ─── Notices ──────────────────────────────────────────────────────────────
    await db.insert(noticesTable).values([
      {
        schoolId: school1Id,
        title: "Annual Day Celebration",
        content: "Annual Day will be held on April 15, 2026. All students must attend.",
        type: "general",
        postedBy: schoolAdmin1.id,
      },
      {
        schoolId: school1Id,
        title: "Parent Teacher Meeting",
        content: "PTM for all classes will be held on March 20, 2026 from 9 AM to 1 PM.",
        type: "ptm",
        postedBy: schoolAdmin1.id,
      },
      {
        schoolId: school1Id,
        title: "Mid-Term Examinations",
        content: "Mid-term exams start from April 1, 2026. Timetable on the portal.",
        type: "exam",
        postedBy: schoolAdmin1.id,
      },
    ]);

    // ─── Events ───────────────────────────────────────────────────────────────
    await db.insert(eventsTable).values([
      {
        schoolId: school1Id,
        title: "Annual Sports Day",
        description: "Annual sports day with various athletic events.",
        eventDate: new Date("2026-04-10"),
        location: "School Grounds",
        isPublic: true,
      },
      {
        schoolId: school1Id,
        title: "Science Exhibition",
        description: "Students showcase their science projects.",
        eventDate: new Date("2026-04-25"),
        location: "School Auditorium",
        isPublic: true,
      },
    ]);

    // ─── Fees ─────────────────────────────────────────────────────────────────
    await db.insert(feesTable).values([
      {
        schoolId: school1Id,
        studentId: student1.id,
        amount: "12000",
        feeType: "Tuition Fee",
        dueDate: "2026-04-30",
        status: "pending",
        description: "Q1 2026 tuition fee",
      },
      {
        schoolId: school1Id,
        studentId: student1.id,
        amount: "2000",
        feeType: "Activity Fee",
        dueDate: "2026-03-31",
        status: "paid",
        paidDate: "2026-03-10",
        description: "Annual activity fee",
      },
    ]);

    console.log("Demo data seeded successfully!");
    console.log("  Super Admin:  superadmin@myschool.in / admin123");
    console.log("  School Admin: admin@dps.in / school123");
    console.log("  Teacher:      rajesh@dps.in / teacher123");
    console.log("  Parent:       parent@myschool.in / parent123");
    console.log("  Student:      student@myschool.in / student123");
    console.log("  Job Seeker:   jobseeker@myschool.in / job123");
  } catch (err) {
    console.error("Failed to seed demo data:", err);
  }
}
