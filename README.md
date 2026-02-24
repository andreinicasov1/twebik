# CyberTrain — Platformă de Antrenament Cibernetic

Full-stack React + .NET pentru practică de securitate a informației.

- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS (UI complet în română, dark theme neon).
- **Backend**: ASP.NET Core 8 cu structură identică proiectului de referință `eBookStore (25 mar)`
  — 4 straturi (`.Api`, `.Domain`, `.BusinessLayer`, `.DataAccess`), `BusinessLogic` factory,
  `DbSession` static, un `DbContext` per feature, `Core`/`Structure`/`Interfaces`.
- **Bază de date**: MS SQL Server (Docker recomandat).

## Structură

```
CyberTrain/
├── frontend/     React + Vite + TS + Tailwind
└── backend/
    ├── CyberTrain.sln
    ├── CyberTrain.Api/
    ├── CyberTrain.Domain/
    ├── CyberTrain.BusinessLayer/
    └── CyberTrain.DataAccess/
```

Detalii complete: [backend/README.md](backend/README.md) și [frontend/README.md](frontend/README.md).

## Pornire rapidă

### 1. SQL Server (Docker)

```bash
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=Parola#123" \
  -p 1433:1433 --name mssql -d mcr.microsoft.com/mssql/server:2022-latest
```

### 2. Backend .NET

```bash
cd backend
dotnet restore
dotnet run --project CyberTrain.Api
```

API: `http://localhost:5080` · Swagger: `/swagger` · Health: `/api/health`

### 3. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

UI: `http://localhost:5173`

## Conturi implicite

| Rol   | Email                       | Parolă   |
|-------|-----------------------------|----------|
| admin | `admin@cybertrain.local`    | admin123 |
| user  | `demo@cybertrain.local`     | demo123  |

## Funcționalități principale

- Autentificare JWT (înregistrare **fără confirmare email** — login automat)
- Dashboard (XP, nivel, exerciții rezolvate, activitate recentă)
- Exerciții CRUD pe 3 categorii: Securitate Web, Rețea, Criptografie
- Submission cu validare + XP + realizări automate
- Clanuri (creare, alăturare, părăsire, leaderboard, exerciții dedicate)
- Noutăți, Contact, Profil, Clasament
- Admin Panel: statistici, utilizatori (rol/ștergere), exerciții, clanuri, realizări, noutăți, mesaje
- Axios Provider (context + hook + interceptori) cu redirect automat la `/500`
- Health controller + validare DTOs + tratare excepții + HTTP status codes

## Conformitate cu cerințele profesorului

- ✅ Structura identică eBookStore: `.Api`, `.Domain`, `.BusinessLayer`, `.DataAccess`
- ✅ `DbSession.ConnectionString` static (nu DI)
- ✅ `BusinessLogic` factory (`UserLoginAction()`, `ChallengeAction()`, etc.)
- ✅ `Core/XxxActions` cu metode `protected`/`internal XxxActionExecution()`
- ✅ `Structure/XxxExecution : XxxActions, IXxxAction`
- ✅ Controllere cu `_x = new BusinessLogic().XxxAction()` în constructor (fără DI)
- ✅ Entități în `Entities/Feature/XxxData.cs` cu Data Annotations
- ✅ DTOs în `Models/Feature/` + `Models/Responces/ActionResponce.cs`
- ✅ Health controller + status codes + mesaje + Swagger
- ✅ CRUD complet pe minim 3 entități: Challenge, Clan, Achievement, News, Message, User (6 total)
- ✅ Axios provider cu interceptori + redirect la /500 când backend-ul e jos
