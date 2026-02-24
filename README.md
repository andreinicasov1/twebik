# CodePulse Arena

Platformă modernă de concursuri între programatori, construită cu React + TypeScript + Vite.
Include experiență completă pentru utilizatori (dashboard, concursuri, probleme, clasament, profil) și panou de administrare separat cu acțiuni CRUD demo.

## Tehnologii

- React 19 + TypeScript
- Vite
- React Router
- Axios (instanță + interceptori)
- React Hook Form + Zod
- i18n (i18next + react-i18next, localizare RO)
- Monaco Editor
- Recharts
- react-hot-toast

## Instalare

```bash
npm install
```

## Rulare locală

```bash
npm run dev
```

## Build producție

```bash
npm run build
```

## Conturi demo

- Admin:
  - Email: `admin@codepulse.ro`
  - Parolă: `Admin123!`
- User:
  - Email: `andrei@codepulse.ro`
  - Parolă: `Parola123!`

## Funcționalități principale

- Autentificare / înregistrare / resetare parolă (demo)
- Rute protejate pentru utilizator autentificat
- Rute admin protejate pe rol
- Dashboard utilizator cu indicatori, notificări și grafic
- Listă concursuri cu filtre, căutare și paginare
- Detalii concurs + countdown + participare
- Detalii problemă + editor cod + trimitere soluție demo
- Clasament global și per concurs cu căutare
- Profil utilizator cu statistici, insigne și istoric
- Panou admin:
  - Statistici platformă
  - Gestionare utilizatori (rol, ban, reset parolă, rating)
  - Gestionare concursuri (CRUD)
  - Gestionare probleme (CRUD + import/export JSON)
  - Moderare raportări

## Structură proiect

Sunt respectate directoarele și fișierele principale solicitate în `src`:
bazar djekson

- `_mock`, `assets`, `auth`, `axios`, `components`, `layouts`, `locales`, `pages`, `routes`, `sections`, `theme`, `types`, `utils`
- `app.tsx`, `global-config.ts`, `global.css`, `main.tsx`, `vite-env.d.ts`
# twebik
# twebik
