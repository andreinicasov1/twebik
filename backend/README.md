# CyberTrain Backend (.NET 8) — structură eBookStore

Backend-ul urmează **exact** patternul proiectului de referință `eBookStore (25 mar)`:

```
backend/
├── CyberTrain.sln
├── CyberTrain.Api/              (Controllers · Program.cs · JWT · Middleware · Swagger)
│   ├── Controller/
│   │   ├── HealthController.cs        — api/health
│   │   ├── AuthController.cs          — api/auth/login · api/auth/register · api/auth/me
│   │   ├── ChallengesController.cs    — api/challenges (CRUD + submit)
│   │   ├── ClansController.cs         — api/clans (CRUD + join/leave + leaderboard)
│   │   ├── AchievementsController.cs  — api/achievements (CRUD + me)
│   │   ├── NewsController.cs          — api/news (CRUD)
│   │   ├── ContactController.cs       — api/contact (CRUD mesaje)
│   │   ├── CommonController.cs        — api/leaderboard · /dashboard · /profile
│   │   └── AdminController.cs         — api/admin/stats · /users · /users/{id}/role
│   ├── Middleware/ExceptionMiddleware.cs
│   ├── DbSeeder.cs                    — populează schema la prima pornire
│   ├── Properties/launchSettings.json
│   ├── Program.cs                     — setup DbSession + JWT + CORS + Swagger
│   └── appsettings.json               — ConnectionStrings + Jwt + Cors
├── CyberTrain.Domain/
│   ├── Entities/                      — câte un folder / feature
│   │   ├── User/        UserData.cs · UserRole.cs
│   │   ├── Challenge/   ChallengeData.cs
│   │   ├── Clan/        ClanData.cs
│   │   ├── Achievement/ AchievementData.cs (+ UserAchievementData)
│   │   ├── News/        NewsData.cs
│   │   ├── Message/     MessageData.cs
│   │   └── Submission/  SubmissionData.cs
│   └── Models/                        — DTO-uri per feature
│       ├── User/        UserLoginDto · UserRegisterDto · UserDto · AuthResponseDto · ChangeRoleDto
│       ├── Challenge/   ChallengeDto · ChallengeAdminDto · CreateChallengeDto · SubmitAnswerDto
│       ├── Clan/        ClanDto · CreateClanDto · ClanLeaderboardDto
│       ├── Achievement/ AchievementDto · CreateAchievementDto · UserAchievementDto
│       ├── News/        NewsDto · CreateNewsDto
│       ├── Message/     MessageDto · CreateMessageDto · UpdateMessageDto
│       ├── Submission/  SubmissionDto · SubmitResultDto
│       ├── Common/      LeaderboardEntryDto · DashboardDto · AdminStatsDto
│       └── Responces/   ActionResponce.cs   (păstrat cu typo-ul din eBookStore)
├── CyberTrain.BusinessLayer/
│   ├── BusinessLogic.cs               — factory: return new XxxExecution()
│   ├── Interfaces/                    — IUserLoginAction, IChallengeAction, etc.
│   ├── Core/                          — XxxActions cu metode protected/internal
│   └── Structure/                     — XxxExecution : XxxActions, IXxxAction
│       ├── TokenService.cs            — generare JWT (înlocuiește GUID-ul din eBookStore)
│       └── UserMapper.cs              — XP → Level · XP → Rank
└── CyberTrain.DataAccess/
    ├── DbSession.cs                   — ConnectionString static (stil eBookStore)
    └── Context/                       — un DbContext / feature
        ├── UserContext.cs
        ├── ChallengeContext.cs
        ├── ClanContext.cs
        ├── AchievementContext.cs
        ├── NewsContext.cs
        ├── MessageContext.cs
        └── SubmissionContext.cs
```

## Patternul eBookStore aplicat

1. **Connection string** se setează static în `Program.cs`:
   ```csharp
   CyberTrain.DataAccess.DbSession.ConnectionString =
       builder.Configuration.GetConnectionString("DefaultConnection");
   ```
2. **DbContext per feature**, fiecare cu `OnConfiguring` → `UseSqlServer(DbSession.ConnectionString)`.
3. **BusinessLogic** — factory cu metode `XxxAction() => new XxxExecution();`.
4. **Controllere** — fără DI, instanțiază direct:
   ```csharp
   public ChallengesController() {
       var bl = new BusinessLayer.BusinessLogic();
       _challenge = bl.ChallengeAction();
   }
   ```
5. **Core + Structure**: logica stă în `XxxActions` (metode `protected`/`internal` numite `XxxActionExecution`), iar `XxxExecution : XxxActions, IXxxAction` doar le apelează.
6. **ActionResponce** (păstrat cu typo-ul din eBookStore) — `IsSuccess` + `Message` + `Data`.

## Rulare

```bash
cd backend
dotnet restore
dotnet run --project CyberTrain.Api
```

La prima pornire, `DbSeeder.Seed()` creează automat toate tabelele (câte o schemă per context) și
inserează un admin și un user demo.

### Dacă vrei migrații explicite (profesorul cere asta):

```bash
dotnet ef migrations add Initial_User       -p CyberTrain.DataAccess -s CyberTrain.Api -c UserContext        -o Migrations/User
dotnet ef migrations add Initial_Challenge  -p CyberTrain.DataAccess -s CyberTrain.Api -c ChallengeContext   -o Migrations/Challenge
dotnet ef migrations add Initial_Clan       -p CyberTrain.DataAccess -s CyberTrain.Api -c ClanContext        -o Migrations/Clan
dotnet ef migrations add Initial_Achievement -p CyberTrain.DataAccess -s CyberTrain.Api -c AchievementContext -o Migrations/Achievement
dotnet ef migrations add Initial_News       -p CyberTrain.DataAccess -s CyberTrain.Api -c NewsContext        -o Migrations/News
dotnet ef migrations add Initial_Message    -p CyberTrain.DataAccess -s CyberTrain.Api -c MessageContext     -o Migrations/Message
dotnet ef migrations add Initial_Submission -p CyberTrain.DataAccess -s CyberTrain.Api -c SubmissionContext  -o Migrations/Submission

dotnet ef database update -p CyberTrain.DataAccess -s CyberTrain.Api -c UserContext
dotnet ef database update -p CyberTrain.DataAccess -s CyberTrain.Api -c ChallengeContext
dotnet ef database update -p CyberTrain.DataAccess -s CyberTrain.Api -c ClanContext
dotnet ef database update -p CyberTrain.DataAccess -s CyberTrain.Api -c AchievementContext
dotnet ef database update -p CyberTrain.DataAccess -s CyberTrain.Api -c NewsContext
dotnet ef database update -p CyberTrain.DataAccess -s CyberTrain.Api -c MessageContext
dotnet ef database update -p CyberTrain.DataAccess -s CyberTrain.Api -c SubmissionContext
```

## Conturi seedate implicit

| Rol   | Email                          | Parolă   |
|-------|--------------------------------|----------|
| admin | `admin@cybertrain.local`       | admin123 |
| user  | `demo@cybertrain.local`        | demo123  |

## Conexiune SQL Server

Ajustează `ConnectionStrings:DefaultConnection` din `appsettings.json`. Pentru Docker:

```bash
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=Parola#123" \
  -p 1433:1433 --name mssql -d mcr.microsoft.com/mssql/server:2022-latest
```

String-ul implicit se potrivește cu acest container.
