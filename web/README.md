# MySchool — Web App

The web application source code lives at:

```
artifacts/myschool/
```

## Tech Stack
- React 18 + Vite
- Tailwind CSS v4
- shadcn/ui components
- Framer Motion
- React Router v6

## Run locally
```bash
pnpm --filter @workspace/myschool run dev
```

## Key folders
```
artifacts/myschool/
├── src/
│   ├── components/     # Shared UI components
│   ├── pages/          # Route pages (Home, Schools, Events, Tutors, …)
│   ├── panels/         # Role dashboards (parent-panel, school-panel, …)
│   ├── context/        # AuthContext, ThemeContext
│   └── lib/            # Data, utils
└── index.html
```
