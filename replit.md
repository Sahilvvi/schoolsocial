# MySchool — Education Marketplace Platform

## Overview

MySchool is India's school discovery and education marketplace — a "Zomato for education" where parents search, compare, and apply to schools, tutors, and events. Built as a React + Vite SPA in a pnpm monorepo.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Frontend**: React 18 + Vite 7 + Tailwind CSS v4 + shadcn/ui + Framer Motion
- **Routing**: React Router DOM v6
- **State/Fetching**: TanStack Query v5
- **Backend/Auth**: Supabase (PostgreSQL + Auth)
- **Language**: TypeScript 5
- **Node.js**: 24

## Artifacts

| Artifact | Path | Port | Description |
|---|---|---|---|
| MySchool web app | `/` | 19910 | Main React SPA |
| API Server | `/api` | 8080 | Express API (currently not used by frontend — app talks to Supabase directly) |

## Key Directories

```
artifacts/myschool/src/
  pages/          — All page components
    admin/        — Admin panel (AdminLayout + sub-pages)
    school-panel/ — School management panel
    parent-panel/ — Parent dashboard
    teacher-panel/— Teacher panel
    tuition-panel/— Tuition center panel
  components/     — Shared UI components (Navbar, SchoolCard, Footer, etc.)
  hooks/          — Data hooks (useData, useAuth, useSchools, etc.)
  data/           — dummyData.ts for demo/fallback data
  integrations/supabase/ — Supabase client + generated types
  erp/            — Embedded ERP module at /erp/*
```

## Design System

- **Primary**: Blue `hsl(217 91% 60%)` — #3B82F6 family
- **Secondary**: Purple `hsl(250 80% 64%)` — #7C3AED family
- **Font**: Inter (body) + Plus Jakarta Sans (headings)
- **Mobile nav**: Fixed bottom tab bar (Home, Schools, Compare, Events, Profile) — shown on <md screens
- **Desktop nav**: Sticky top navbar with logo + links + search + auth
- **Cards**: Rounded-2xl, subtle shadow, hover lift effect
- **Dashboard panels**: Dark slate sidebar + light main content area

## Routing

- `/` — Home page (hero, featured schools, stats, testimonials)
- `/schools` — School listing with filter sidebar + grid/map view
- `/school/:slug` — School profile (tabs: Overview, Fees, Gallery, Reviews, Apply Now)
- `/events` — Events listing
- `/event/:id` — Event detail
- `/jobs` — Job vacancies
- `/tutors` — Tutor listing
- `/tutor/:id` — Tutor detail
- `/news` — News listing
- `/news/:id` — News detail
- `/compare` — School comparison
- `/auth` — Login / Sign up
- `/plans` — Pricing plans
- `/community` — School community
- `/scanner` — QR scanner
- `/admin/*` — Admin panel (auth required: admin role)
- `/school-panel/*` — School management (auth required: school role)
- `/parent-panel/*` — Parent dashboard (auth required: parent role)
- `/teacher-panel/*` — Teacher panel (auth required: teacher role)
- `/tuition-panel/*` — Tuition center panel (auth required: tuition_center role)
- `/erp/*` — Embedded ERP module

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL (set as env var) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/publishable key (set as secret) |

Supabase URL: `https://crqcdqrimmvetmbmhapv.supabase.co`

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@myschool.demo | Demo@1234 |
| School | school@myschool.demo | Demo@1234 |
| Parent | parent@myschool.demo | Demo@1234 |
| Teacher | teacher@myschool.demo | Demo@1234 |
| Tuition | tuition@myschool.demo | Demo@1234 |

## Data Strategy

- App connects to Supabase for real data
- Falls back to `src/data/dummyData.ts` dummy data when Supabase returns empty results
- Demo login with demo credentials uses client-side auth simulation

## Key Commands

```bash
# Start dev server
pnpm --filter @workspace/myschool run dev

# Build for production
pnpm --filter @workspace/myschool run build
```
