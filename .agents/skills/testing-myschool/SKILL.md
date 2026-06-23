# Testing MySchool Marketplace App

## Overview
MySchool is a multi-role education marketplace with 5 roles: Admin, School, Parent, Teacher, and Tuition Center. Each role has its own dashboard/panel with role-based navigation.

## Dev Server
```bash
cd grade-sphere-now-main && pnpm install && pnpm dev
```
The Vite dev server runs on `http://localhost:8080` (configured in vite.config.ts).

## Demo Credentials
All demo accounts use the same password: `Demo@1234`

| Role | Email | Redirects To |
|------|-------|--------------|
| Admin | admin@myschool.demo | /admin |
| School | school@myschool.demo | /school-panel |
| Parent | parent@myschool.demo | /dashboard |
| Teacher | teacher@myschool.demo | /teacher-profile |
| Tuition | tuition@myschool.demo | /tuition-dashboard |

The auth page (`/auth`) has **Quick Demo Login** buttons for each role — click them instead of typing credentials.

## Devin Secrets Needed
No secrets are required for demo testing. The app uses localStorage-based demo auth that doesn't hit Supabase for demo emails.

For testing real Supabase signup/login, you would need:
- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (already configured in the repo)

## Key Testing Flows

### 1. Role-Based Navbar Testing
The navbar shows different dashboard buttons based on the logged-in user's role:
- **Parent** → "My Dashboard" button (links to `/dashboard`)
- **Teacher** → "My Profile" button (links to `/teacher-profile`)
- **School** → "School Panel" button (links to `/school-panel`)
- **Tuition** → "Tuition Panel" button (links to `/tuition-dashboard`)
- **Unauthenticated** → "Sign In" button only

**Critical check:** Verify NO cross-role buttons appear (e.g., parent should NOT see "School Panel").

### 2. Dashboard Population Testing
Each dashboard should show populated dummy data, not empty states:
- **Parent Dashboard:** Stat cards (Admissions, Saved Schools, Tutor Bookings, Notifications) + admission timeline cards
- **Tuition Dashboard:** Stat cards (Total Students, Active Batches, Monthly Revenue, Avg Occupancy) + batch list + tutor cards
- **School Panel:** Sidebar layout with stats (Views, Admissions, Avg Rating, Gallery, Events, Jobs) + recent admissions/reviews
- **Teacher Profile:** LinkedIn-style profile with stats, About/Experience/Services/Notes/Jobs tabs

### 3. Sign Out Flow
The sign-out button is typically the arrow/logout icon in the navbar (rightmost icon after the avatar). After signing out, the user should be redirected to the homepage with the "Sign In" button visible.

## Common Gotchas

### Dummy Data Field Names
The `DUMMY_TUTORS` array in `src/data/dummyData.ts` uses specific field names:
- `avatar` (NOT `image`) — for tutor profile photos
- `hourly_rate` (NOT `fee`) — for pricing display
- There is NO `mode` field — if a component needs to show online/in-person, it should be hardcoded or derived

If tutor cards show broken images or "undefined" text, check that the component is using the correct field names from `DUMMY_TUTORS`.

### Vercel Preview Access
Vercel previews might be behind Vercel's SSO login wall. If the preview URL redirects to `vercel.com/login`, use the local dev server instead. The code is the same.

### Demo Auth vs Real Auth
Demo emails (ending in `@myschool.demo`) bypass Supabase entirely — they use `makeDemoUser()` which returns a fake user object stored in localStorage. Real Supabase signup requires email verification and cannot be easily tested in isolation.

### School Panel Layout
The School Panel (`/school-panel`) uses a **sidebar layout** instead of the top navbar. It has its own sidebar navigation with Dashboard, School Profile, Admissions, Gallery, Analytics, Reviews, Events, Jobs, ERP, QR Orders. The "Back to Site" button returns to the main navbar layout.

### ERP Removal
The ERP option was removed from the main navbar but still exists in the School Panel sidebar (it's an internal school management feature, not a public-facing nav item). This is intentional.

## Testing Checklist Template
1. [ ] Start dev server (`pnpm dev`)
2. [ ] Verify homepage loads with no "ERP Login" in navbar
3. [ ] Login as Parent → verify "My Dashboard" button + populated dashboard
4. [ ] Sign out → Login as Tuition → verify "Tuition Panel" button + populated dashboard + tutor cards render correctly
5. [ ] Sign out → Login as School → verify School Panel loads with sidebar + populated data
6. [ ] Sign out → Login as Teacher → verify "My Profile" button + populated profile
7. [ ] Check browser console for errors on each page
