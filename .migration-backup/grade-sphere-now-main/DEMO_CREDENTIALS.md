# Demo Credentials

All demo accounts use the same password: **`Demo@1234`**

| Role | Email | Panel / Dashboard | Route |
|------|-------|-------------------|-------|
| **Admin** | `admin@myschool.demo` | Admin Panel — full platform management | `/admin` |
| **School** | `school@myschool.demo` | School Panel — manage Delhi Public School | `/school-panel` |
| **Parent** | `parent@myschool.demo` | Parent Dashboard — child info, notifications | `/dashboard` |
| **Teacher** | `teacher@myschool.demo` | Teacher Profile — resume, services, notes | `/teacher-profile` |
| **Tuition Center** | `tuition@myschool.demo` | Tuition Center — tutor listings | `/tutors` |

## Quick Login

On the **Auth Page** (`/auth`), click any of the five "Quick Demo Login" buttons to auto-fill credentials and sign in instantly.

## What Each Panel Shows

### Admin Panel (`/admin`)
- Dashboard with stats (schools, events, jobs, tutors, news, admissions, bookings)
- Analytics chart (admissions over time)
- CRUD management for: Schools, Events, Jobs, Tutors, News, Admissions, Job Applications, Tutor Bookings, Tuition Enquiries, Reviews, QR Orders, Batches

### School Panel (`/school-panel`)
- Dashboard with stats (views, admissions, ratings, gallery, events, jobs)
- Recent admissions & reviews
- Manage: Admissions, Reviews, Events, Jobs, Profile, Gallery, Analytics, QR Orders
- ERP integration hub (attendance, fees, students, exams, communication)

### Parent Dashboard (`/dashboard`)
- Child profiles with school info
- Homework, exams, and notification cards

### Teacher Profile (`/teacher-profile`)
- LinkedIn-style resume with experience & education
- Service toggles (home tuition, online classes, paid notes)
- Subscription packages
- Job recommendations

### Tuition Center (`/tutors`)
- Browse all available tutors with ratings and hourly rates
- Book tutors for specific subjects

## How It Works

- Demo credentials are handled entirely on the frontend — no real Supabase accounts are created.
- All data-fetching hooks fall back to comprehensive dummy data when Supabase returns empty results.
- Demo sessions persist in `localStorage` and survive page refreshes.
- Sign out clears the demo session and redirects to the home page.
