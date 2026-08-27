---
name: SchoolSocial end-to-end UI testing
description: How to run, log in to, and audit the SchoolSocial CRM/ERP monorepo web app on a local Vite dev server.
---

# SchoolSocial end-to-end UI testing

## Dev server
- The web app lives in `artifacts/myschool`.
- It is a Vite + React app. The default port is `19910` (`PORT` env var overrides it in `vite.config.ts`).
- The repo blueprint recommends `pnpm`, but `pnpm` may not be installed in the environment. If `pnpm` is missing, run `npm install` and `npm run dev` from `artifacts/myschool` instead.
- The Node version check in recent Vite may warn; the server still starts and is reachable on `http://localhost:19910`.

## Demo credentials (single source of truth)
All demo accounts share password `Demo@1234`:
- `admin@myschool.demo` → CRM `/admin`, ERP `/erp/super-admin`
- `school@myschool.demo` → CRM `/school-panel`, ERP `/erp/school-admin`
- `parent@myschool.demo` → CRM `/parent-panel`, ERP `/erp/parent`
- `teacher@myschool.demo` → CRM `/teacher-panel`, ERP `/erp/teacher`
- `tuition@myschool.demo` → CRM `/tuition-panel`

## Auth / session mechanics
- CRM auth stores `demo_user_email` and `myschool_token` in `localStorage`.
- ERP `use-auth` reads the same `demo_user_email`/`myschool_token` and maps the email to an ERP role, so the same demo login works for both CRM and ERP without a separate ERP login.
- To switch roles in the browser, set `localStorage.setItem('demo_user_email', '<role>@myschool.demo')` and navigate to the target panel/ERP route.

## Common gotchas
- Radix `Select` components and HTML `type="date"` inputs do not respond to `browser(action="select_option")` and may fail `browser(action="type")`. Use click-to-open + click-option for selects, and set date values via console or real keyboard interactions when the tool does not support the native date picker.
- Many pages show console 404s for Supabase REST endpoints (`rest/v1/schools`, `events`, `news`, `jobs`, `reviews`, `tutors`) and 404/403s for external image URLs (Unsplash, Google Maps static map with `key=placeholder`). The app falls back to local/demo data, so pages still render, but the console noise should be noted.
- `/cookies` contains the word "Error" in its body ("Error reporting") and may be flagged as a false positive by naive text-based smoke tests.

## Full feature test checklist
1. Public marketplace: home, `/schools`, `/school/:slug`, `/tutors`, `/tutor/:id`, `/events`, `/news`, `/jobs`, `/community`, `/compare`, `/plans`, `/upload-school`, `/tuition-enquiry`, `/scanner`, `/privacy`, `/terms`, `/cookies`, `/auth`.
2. CRM role dashboards: `/admin/*`, `/school-panel/*`, `/parent-panel/*`, `/teacher-panel/*`, `/tuition-panel/*`.
3. ERP: `/erp/`, `/erp/login`, `/erp/schools/leaderboard`, `/erp/career`, then role routes under `/erp/super-admin/*`, `/erp/school-admin/*`, `/erp/teacher/*`, `/erp/parent/*`, `/erp/student/*`.
4. Cross-system integration: submit admission as parent in CRM, approve as school in CRM, verify student + pending fee appear in ERP school admin, mark fee paid in ERP, verify parent panel updates.

## Useful artifacts
- Smoke results are normally saved to `/tmp/schoolsocial-smoke-results.json`.
- Network failure logs are normally saved to `/tmp/network-report-public.json`.
- Recordings are saved under `/home/ubuntu/screencasts/<recording_id>/`.

## Devin Secrets Needed
None for local demo testing; the Supabase URL and publishable key are present in `artifacts/myschool/.env.local`.
