# CyberTrain Frontend

React + Vite + TypeScript + Tailwind CSS, UI complet în română, dark mode cu accente neon-green.

## Setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Aplicația rulează la `http://localhost:5173`. API-ul .NET trebuie să ruleze la `http://localhost:5080` (vezi `.env`).

## Structură

```
src/
├── _mock/              # date mock (fallback)
├── assets/             # resurse statice
├── auth/               # AuthContext + guards (AuthGuard, AdminGuard, GuestGuard)
├── axios/              # AxiosProvider (context + interceptori + endpoints)
├── components/         # componente reutilizabile UI + layout
├── layouts/            # MainLayout (auth) + PublicLayout
├── locales/            # i18n (ro.json)
├── pages/              # pagini (Home, Dashboard, Exerciții, Clanuri, Admin...)
├── routes/             # rutare completă
├── sections/           # secțiuni complexe (HealthCheck)
├── services/           # servicii API (ChallengeService, ClanService, etc.)
├── theme/              # constante temă
├── types/              # tipuri TS
├── utils/              # format, helpers
├── app.tsx
├── global-config.ts
├── global.css
└── main.tsx
```

## Features

- Autentificare JWT (login / register fără confirmare email / logout)
- Protected routes (user / admin)
- Dashboard cu XP, nivel, exerciții rezolvate, activitate recentă
- Exerciții pe categorii (Securitate Web, Rețea, Criptografie)
- Submission cu validare și XP
- Profil + realizări deblocate
- Clanuri (creare, join, leave, leaderboard, exerciții dedicate)
- Clasament global
- Noutăți (admin creează, toți citesc)
- Contact (public, salvat în DB)
- Admin panel complet: exerciții, utilizatori, clanuri, realizări, noutăți, mesaje
- Redirect automat la pagina `/500` dacă backend-ul .NET nu răspunde (prin interceptor axios)

## Scripturi

- `npm run dev` — dev server
- `npm run build` — build producție
- `npm run preview` — servește build-ul
