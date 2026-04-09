# MySchool Platform

## Overview

MySchool is India's comprehensive school ecosystem platform — a multi-tenant SaaS combining school ERP, parent communication, public school discovery, ratings & reviews, teacher hiring marketplace, and an AI data assistant.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite + TailwindCSS + shadcn/ui
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
workspace/
├── artifacts/
│   ├── api-server/        # Express API (auth, schools, students, teachers, etc.)
│   └── myschool/          # React frontend (multi-panel app)
├── lib/
│   ├── api-spec/          # OpenAPI spec (comprehensive MySchool API)
│   ├── api-client-react/  # Generated React Query hooks
│   ├── api-zod/           # Generated Zod schemas
│   └── db/                # Drizzle ORM schema
```

## User Panels

1. **Super Admin** (`/super-admin`) — Platform control, school management, revenue charts, reviews, support tickets, platform announcements, subscriptions/plans
2. **School Admin** (`/school-admin`) — Full ERP: students, teachers, classes, attendance, fees+receipts, notices, events, timetable, exams, leave approvals, messages, AI assistant, library, transport, payroll, discipline, study materials, PTM scheduling, fee structures, admission inquiries, blog
3. **Teacher** (`/teacher`) — Classes, Attendance, Timetable, Homework, Exam Marks Entry, Gradebook, Assignments (with submissions), Study Materials upload, Leave Requests, Notices, Profile
4. **Parent** (`/parent`) — Mobile-first: home, children, fees+receipts+demo payment modal, results, homework, messages, notices, attendance, PTM booking
5. **Student** (`/student`) — Home, Schedule, Homework, Results, Messages, Notices, Study Materials, QR ID Card, Quiz player
6. **Public Discovery** (`/schools`) — School search, profiles, ratings+reviews, events, admission inquiry form, school blog, school comparison tool
7. **Career/Job Seeker** (`/career`) — Job browse with filters, save/bookmark jobs, profile setup, applications

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Super Admin | superadmin@myschool.in | admin123 |
| School Admin (DPS) | admin@dps.in | school123 |
| Teacher | rajesh@dps.in | teacher123 |
| Parent | parent@myschool.in | parent123 |
| Student | student@myschool.in | student123 |
| Job Seeker | jobseeker@myschool.in | job123 |

## Database Schema

**Core tables**: users, schools, students, teachers, classes, attendance, fees, notices, events, reviews, jobs, job_applications, timetable, exams, exam_results, homework, homework_submissions, teacher_leaves, messages, announcements, notifications, school_gallery, audit_logs

**Extended tables** (added): library_books, transport_routes, payroll_records, ptm_slots, discipline_records, study_materials, syllabus_topics, assignments, assignment_submissions, support_tickets, admission_inquiries, school_blog_posts, fee_structures, school_plans

**Note**: Auth middleware is at `src/middlewares/auth.ts` (NOT `middleware/auth`)

## API Routes

- `POST /api/auth/login` — JWT authentication
- `GET /api/auth/me` — Current user profile
- `GET/POST /api/schools` — School management
- `POST /api/schools/:id/approve|suspend` — Super admin actions
- `GET /api/schools/:id/stats` — School dashboard stats
- `GET /api/platform/stats` — Platform-wide stats
- `GET/POST /api/students` — Student CRUD
- `GET/POST /api/teachers` — Teacher CRUD
- `GET/POST /api/classes` — Class management
- `GET/POST /api/attendance` — Attendance tracking
- `GET/POST /api/fees` — Fee management
- `POST /api/fees/:id/pay` — Mark fee paid
- `GET/POST /api/notices` — Notice board
- `GET/POST /api/events` — Events
- `GET/POST /api/reviews` — School reviews
- `GET/POST /api/jobs` — Teacher job marketplace
- `POST /api/jobs/:id/apply` — Job application
- `GET /api/public/schools` — Public school discovery
- `GET /api/public/schools/:slug` — Public school profile
- `GET /api/public/feed` — Platform events feed
- `POST /api/ai/query` — AI school data assistant
- `GET/POST /api/timetable` — Class timetable
- `GET/POST /api/exams` — Exam management, mark results
- `GET/POST /api/homework` — Homework assignments
- `GET/POST /api/leaves` — Teacher leave requests
- `GET/POST /api/messages` — Messaging system
- `GET/POST /api/announcements` — School announcements (bulk notify)
- `GET/POST /api/notifications` — User notifications (with mark read)
- `GET/POST /api/gallery` — School photo gallery
- `GET /api/platform/users` — Real users from DB (with role stats)
- `GET /api/platform/revenue` — Real fee revenue analytics

## Super Admin Sub-Pages

- `/super-admin` — Dashboard with platform stats
- `/super-admin/schools` — Approve/suspend schools, filter by status (All/Active/Pending/Suspended)
- `/super-admin/users` — All platform users by role, user stats cards
- `/super-admin/revenue` — Monthly revenue charts, plan distribution, AreaChart
- `/super-admin/reviews` — Approve/reject reviews (real API, all schools), star ratings, filter tabs
- `/super-admin/settings` — Platform settings: General, Notifications, Security, Pricing Plans

## School Admin Sub-Pages

- `/school-admin` — ERP dashboard with student/teacher/fee stats
- `/school-admin/students` — Students CRUD, **CSV bulk import** (download template + upload CSV), **alumni filter tabs** (All / Active / Alumni)
- `/school-admin/teachers` — Teachers CRUD, **CSV bulk import** (download template + upload CSV)
- `/school-admin/classes` — Classes CRUD with create dialog
- `/school-admin/attendance` — Mark attendance per class, Mark All buttons
- `/school-admin/fees` — Fee management, collect fee, add fee
- `/school-admin/timetable` — Class timetable management (add periods by day)
- `/school-admin/exams` — Exam scheduling + mark entry for students
- `/school-admin/notices` — Notice board with create dialog
- `/school-admin/announcements` — Bulk announcements to students/teachers/parents
- `/school-admin/events` — Events management with create dialog
- `/school-admin/hiring` — Teacher job marketplace with post job + view applications
- `/school-admin/promote` — Student promotion to next grade
- `/school-admin/gallery` — School photo gallery management
- `/school-admin/ai` — AI assistant chat with real school data queries
- `/school-admin/calendar` — Monthly calendar view with event pins, day-click details, upcoming events sidebar
- `/school-admin/support` — Submit and track support tickets with category/priority + thread view (original message + admin resolution bubble) + contact info card
- `/school-admin/profile` — Edit school profile (name, board, facilities, logo, etc.)

## Route Protection

- Unauthenticated users accessing protected routes are redirected to `/login`
- Token stored in localStorage as `myschool_token`
- Global fetch interceptor injects Bearer token in all requests

## Critical API Pattern

- `AuthRequest.user` has shape `{ userId: number; role: string; schoolId?: number | null }` — always use `req.user!.userId` (NOT `req.user!.id`) when referencing the authenticated user's ID in route handlers
- `SelectItem` values must never be empty string — use `"all"` for filters and `"__none__"` for optional form fields
- All `fetch()` calls to the API must check `res.ok` before showing a success toast
- ALL school-admin pages MUST wrap their return in `<AdminLayout title="..." links={adminLinks}>` — pages without this have no left sidebar
- `useEffect` guards (`if (!x) return`) that don't call `setLoading(false)` will cause infinite loading spinners

## Key Features

- Multi-tenant data isolation by school_id
- RBAC permission system
- Dark mode support (system preference detection + manual toggle via moon/sun button in header)
- Real-time notification bell with unread badge, mark as read (across all role panels)
- AI assistant that queries real school data (attendance, fees, students, teachers, classes, notices)
- QR code-based student ID system
- Public school profiles with ratings & reviews
- Teacher hiring marketplace with `/jobs` discovery page
- Events feed for school visibility
- PWA-ready mobile-first parent/student panels
- Role-based auto-fill credentials on login page
- 3-step school registration form at `/schools/register`
- Teacher leave request system with admin approval workflow
- Homework management (assign per class, students view real homework)
- Timetable builder (admin sets, students view real schedule)
- Exam scheduling with mark entry and results
- Student year promotion with bulk class assignment
- Bulk announcements system targeting specific groups (all, students, teachers, parents)
- School gallery for photo uploads and public showcase
- Super Admin real-time user analytics from live DB (role breakdown, search)
- Super Admin real revenue analytics from actual fee transactions
- **CSV bulk import** for students and teachers (download template → upload CSV)
- **Alumni filter** in student directory (All / Active / Alumni tabs)
- **School impersonation** API (`POST /api/schools/:id/impersonate`) for super admin
- **Super Admin analytics drill-down**: Pie charts by board, status, top cities
- **Teacher dashboard**: Full sidebar navigation with grouped links (Teaching/Exams/Students/Personal groups) — no horizontal pill tabs
- **Teacher overview page**: Welcome greeting, stat cards (Classes/Students/Homework/Leave Balance), quick action gradient buttons, EduBot AI assistant (POST /api/ai/query) with typing dots and suggested questions
- **Teacher dashboard parent contact tab**: Click student → send message to parent (uses student data directly, no /api/users dependency)
- **Parent panel left sidebar**: Refactored from bottom-tab nav to AdminLayout with left sidebar (15 links in 4 groups: Overview, Academics, School, Communication); URL routing via /parent/:tab
- **Parent panel child linking**: "Link Child" button in My Children tab — search by admission number, confirm to add; extra children stored in localStorage
- **Parent panel events clickable**: Each event card opens a detail dialog (title, date, location, description)
- **Parent panel PTM error handling**: Graceful error state with retry button instead of JSON crash
- **Parent panel theme + logout**: Handled by AdminLayout (theme toggle in header, logout in sidebar footer)
- **Student Dashboard left sidebar**: Refactored from bottom tab nav to AdminLayout with left sidebar (14 links in 4 groups: Overview, Academics, School, Communication); URL routing via /student/:tab; AdminLayout provides theme toggle + logout
- **Student Dashboard tabs**: home, schedule, homework, results, messages, notices, profile (QR ID card), materials, assignments, leave, library, calendar (attendance), syllabus, quiz
- **Quiz system**: Full backend (quizzes.ts route, quizzesTable, quizAttemptsTable); Teacher quiz builder in TeacherDashboard; Student quiz taking in StudentDashboard
- **School Leaderboard**: /schools/leaderboard with ranking by review score, filter by board/city/type
- **Recruiter Panel**: In CareerDashboard - manage job postings and applicants
- **Fee payment demo**: Parent fees tab has Pay Now button, UPI/Card/Net Banking modal, receipt printing
- **Blog enhancements**: Admin Blog.tsx has draft/publish toggle, image URL preview, filter by status
- **Discipline escalation**: Escalate button sets status="escalated" and shows parent notification toast
- **Report Cards PDF**: window.print() with print-specific CSS, Print button in ReportCards.tsx
- **Payroll payslips**: printSlip() function generates styled payslip popup with window.print()
- **Support tickets threading**: SupportHelp.tsx has TicketThread component with reply thread, real replies API
- **Platform announcements delivery**: ROLE_REACH map shows estimated delivery count per target role
- **Discovery map view**: SchoolMapView with Leaflet + OpenStreetMap, lazy-loaded, grid/map toggle
- **Teacher dashboard student health tab**: Log health notes (temp, conditions, notes)
- **Career dashboard recruiter chat**: Real-time message thread view with contacts sidebar
- **Student health records** (`GET/POST /api/student-health`) with teacher and admin access
- **Student leave management** (`GET/POST /api/student-leaves`, `PUT .../approve`)
- **Financial reports** for school admin with CSV export + defaulters list
- **Health records admin page** for school admin
- **Homework oversight page** for school admin with filters and CRUD
