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
- **Mobile nav**: Fixed bottom tab bar (Home, Schools, Compare, Events, Profile) — shown on <lg screens
- **Desktop nav**: Sticky top navbar with logo + links + search + auth
- **Cards**: `rounded-2xl border-slate-200/80 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`
- **Dashboard sidebars**: All premium white (`bg-white border-r border-slate-200/80 shadow-sm`) with grouped nav sections and active dot indicators
- **Stat cards**: Colored icon ring (`bg-{color}-50 ring-1 ring-{color}-100`), `tabular-nums`, emerald percentage badge
- **Welcome banners**: Gradient (`linear-gradient(135deg, ...)`) with SVG illustration, white text
- **Upgrade banners**: Full gradient with white CTA button, matching welcome banner pattern
- **Animations**: Framer Motion `whileInView` scroll reveals on all major sections, spring hover effects on cards/buttons
- **CSS utilities**: `.mesh-gradient`, `.glass-card`, `.gradient-primary`, `.text-gradient`, `.floating-badge`, `.no-scrollbar`, `.section-tag`, `.animate-marquee`, `bg-primary/4`, `bg-primary/8`

## Premium UI Overhaul (May 2026)

### Public Pages
- **AnimatedCounter**: `src/components/AnimatedCounter.tsx` — scroll-triggered number counter with cubic easing
- **SchoolFinderQuiz**: `src/components/SchoolFinderQuiz.tsx` — 4-step AI-guided school finder modal
- **Premium Hero**: Full mesh-gradient hero with floating glassmorphism stat cards, animated trust badges
- **Scroll Reveals**: All major sections use Framer Motion `whileInView` animations via local `Reveal` wrapper
- **Pages**: HomePage, EventsPage, TutorsPage, SchoolsPage, ComparePage, CommunityPage, AuthPage — all premium

### Dashboard Panels (All Upgraded)
- **AdminLayout** — white sidebar, grouped OVERVIEW/CONTENT/APPLICATIONS/MODERATION nav with icon badges
- **ParentPanelLayout** — white sidebar, grouped OVERVIEW/MY FAMILY/EDUCATION nav
- **TeacherPanelLayout** — white sidebar, grouped OVERVIEW/MY PROFILE/STUDENTS & WORK nav
- **SchoolPanelLayout** — white sidebar (was already white)
- **TuitionPanelLayout** — white sidebar
- **AdminDashboard** — premium stat cards (colored rings), bar chart, Quick Access
- **PPDashboard** (Parent) — premium stat cards, fee/admissions panels with notification badge
- **SPDashboard** (School) — gradient welcome banner + purple/green/blue/amber stat cards with sparklines + gradient upgrade banner
- **TPDashboard** (Teacher) — premium stat cards, experience/achievements/skills panels all upgraded
- **TuPDashboard** (Tuition) — teal/cyan gradient welcome banner + stat cards + batches table + gradient upgrade banner

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
