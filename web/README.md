# MySchool — Web Portal

A fully standalone React + Vite web app. Import this folder directly into **Lovable** or run it locally — no monorepo setup needed.

## Quick Start

```bash
npm install       # or: yarn install / pnpm install
npm run dev       # starts dev server at http://localhost:5173
npm run build     # production build → dist/
```

## Tech Stack

| Layer | Library |
|---|---|
| Framework | React 19 + Vite 7 |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Routing | React Router v6 |
| Data fetching | TanStack Query v5 |
| Auth / DB | Supabase |
| Animations | Framer Motion |
| Charts | Recharts |
| Maps | Leaflet + React Leaflet |
| Forms | React Hook Form + Zod |
| ERP routing | Wouter |

## Folder Structure

```
web/
├── src/
│   ├── components/         # Shared UI (Navbar, Footer, SchoolCard, shadcn ui/*)
│   ├── pages/
│   │   ├── admin/          # Super-admin portal (schools, events, jobs, admissions)
│   │   ├── school-panel/   # School management dashboard
│   │   ├── teacher-panel/  # Teacher dashboard
│   │   ├── tuition-panel/  # Tuition centre dashboard
│   │   └── parent-panel/   # Parent portal (children, fees, admissions)
│   ├── erp/                # Full ERP sub-app (attendance, fees, timetable, exams)
│   ├── hooks/              # useAuth, useDemoMode, useData, useRazorpay
│   ├── integrations/
│   │   └── supabase/       # Supabase client + generated types
│   ├── lib/
│   │   └── shared-data/    # Demo credentials (inlined — no workspace dep)
│   ├── data/               # dummyData.ts — fallback mock data
│   └── App.tsx             # Root router
├── public/                 # favicon, opengraph, robots.txt
├── index.html
├── vite.config.ts
└── package.json
```

## Environment Variables

Create a `.env` file at the root of this folder:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Without these the app runs in **demo mode** automatically (no login required, all data is local mock data).

## Demo Login

All demo accounts use password: `Demo@1234`

| Role    | Email                     |
|---------|---------------------------|
| Parent  | parent@myschool.demo      |
| School  | school@myschool.demo      |
| Teacher | teacher@myschool.demo     |
| Admin   | admin@myschool.demo       |
| Tuition | tuition@myschool.demo     |

## Opening in Lovable

1. Download this `web/` folder as a zip
2. In Lovable → **Import project** → upload the zip
3. Lovable will detect `vite.config.ts` and set up the project automatically
4. Add your Supabase env vars in Lovable's **Settings → Environment Variables**
