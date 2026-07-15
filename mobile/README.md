# MySchool — Mobile App

The mobile application source code lives at:

```
artifacts/myschool-mobile/
```

## Tech Stack
- Expo (React Native)
- Expo Router (file-based routing)
- @tanstack/react-query
- TypeScript

## Run locally
```bash
pnpm --filter @workspace/myschool-mobile run dev
```

## Key folders
```
artifacts/myschool-mobile/
├── app/
│   ├── (tabs)/         # Bottom tab screens (index, schools, events, tutors, profile)
│   ├── dashboard.tsx   # Role-based dashboard (parent/school/teacher/admin)
│   ├── scanner.tsx     # QR scanner (Camera / Manual / History)
│   └── _layout.tsx     # Root layout + stack config
├── components/         # Shared RN components
├── context/            # AuthContext (5 demo roles)
├── hooks/              # useColors (locked to light theme)
└── lib/                # Static data (schools, events, tutors, …)
```

## Demo login
All roles use password: `Demo@1234`

| Role    | Email                    |
|---------|--------------------------|
| Parent  | parent@demo.com          |
| School  | school@demo.com          |
| Teacher | teacher@demo.com         |
| Admin   | admin@demo.com           |
| Tuition | tuition@demo.com         |
