# MySchool — Mobile App

A fully standalone Expo (React Native) app. Clone this folder and run it independently — no monorepo setup needed.

## Quick Start

```bash
npm install       # or: yarn install / pnpm install
npx expo start    # opens Expo dev tools
```

Scan the QR code with **Expo Go** on your phone, or press `a` for Android emulator / `i` for iOS simulator.

## Tech Stack

| Layer | Library |
|---|---|
| Framework | Expo SDK 54 + React Native 0.81 |
| Navigation | Expo Router v6 (file-based) |
| Data fetching | TanStack Query v5 |
| Animations | React Native Reanimated v4 |
| Storage | AsyncStorage |
| Icons | Expo Vector Icons |
| Fonts | Expo Google Fonts (Inter) |

## Folder Structure

```
app/
├── app/
│   ├── (tabs)/             # Bottom tab screens
│   │   ├── index.tsx       # Home
│   │   ├── schools.tsx     # School discovery
│   │   ├── events.tsx      # School events
│   │   ├── tutors.tsx      # Tutor finder
│   │   └── profile.tsx     # Login / profile (5 role panels)
│   ├── school/[id].tsx     # School detail page
│   ├── event/[id].tsx      # Event detail
│   ├── tutor/[id].tsx      # Tutor profile
│   ├── article/[id].tsx    # News article
│   ├── dashboard.tsx       # Role-based dashboard
│   ├── scanner.tsx         # QR scanner
│   ├── compare.tsx         # Side-by-side school comparison
│   ├── news.tsx            # Education news
│   ├── plans.tsx           # Pricing plans
│   └── _layout.tsx         # Root stack layout
├── components/             # Reusable RN components (SchoolCard, EventCard, TutorCard)
├── context/
│   └── AuthContext.tsx     # Auth state + 5 demo users
├── hooks/
│   └── useColors.ts        # Always-light colour palette
├── lib/
│   ├── data.ts             # Static mock data (schools, events, tutors)
│   └── shared-data/        # Demo credentials (inlined — no workspace dep)
├── constants/
│   └── colors.ts           # Brand colour tokens
├── assets/                 # App icon, splash, images
├── app.json                # Expo config (light theme locked)
└── package.json
```

## Demo Login

All demo accounts use password: `Demo@1234`

| Role    | Email                     |
|---------|---------------------------|
| Parent  | parent@myschool.demo      |
| School  | school@myschool.demo      |
| Teacher | teacher@myschool.demo     |
| Admin   | admin@myschool.demo       |
| Tuition | tuition@myschool.demo     |

## Building for Production

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure your project
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```
