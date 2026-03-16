using CyberTrain.DataAccess.Context;
using CyberTrain.Domain.Entities.Achievement;
using CyberTrain.Domain.Entities.Challenge;
using CyberTrain.Domain.Entities.Clan;
using CyberTrain.Domain.Entities.News;
using CyberTrain.Domain.Entities.User;

namespace CyberTrain.Api
{
    public static class DbSeeder
    {
        public static void Seed()
        {
            using (var udb = new UserContext())
            {
                udb.Database.EnsureCreated();
                if (!udb.Users.Any())
                {
                    udb.Users.Add(new UserData
                    {
                        UserName = "admin",
                        Email = "admin@cybertrain.local",
                        Password = BCrypt.Net.BCrypt.HashPassword("admin123"),
                        Role = UserRole.Admin,
                        Xp = 0
                    });
                    udb.Users.Add(new UserData
                    {
                        UserName = "demo",
                        Email = "demo@cybertrain.local",
                        Password = BCrypt.Net.BCrypt.HashPassword("demo123"),
                        Role = UserRole.User,
                        Xp = 150
                    });
                    udb.SaveChanges();
                }
            }

            using (var cdb = new ClanContext())
            {
                cdb.Database.EnsureCreated();
                if (!cdb.Clans.Any())
                {
                    cdb.Clans.Add(new ClanData { Name = "Red Team", Description = "Atacatori pricepuți" });
                    cdb.Clans.Add(new ClanData { Name = "Blue Defenders", Description = "Apărare activă" });
                    cdb.SaveChanges();
                }
            }

            using (var chdb = new ChallengeContext())
            {
                chdb.Database.EnsureCreated();
                if (!chdb.Challenges.Any())
                {
                    chdb.Challenges.AddRange(
                        new ChallengeData
                        {
                            Title = "SQL Injection de bază",
                            Category = "Securitate Web",
                            Difficulty = "usor",
                            CorrectAnswer = "' OR '1'='1",
                            Description = "Exploatează un formular de login care folosește concatenare SQL pentru a ocoli autentificarea. Răspunde cu payload-ul minimal.",
                            XpReward = 50
                        },
                        new ChallengeData
                        {
                            Title = "Cifru Cezar",
                            Category = "Criptografie",
                            Difficulty = "usor",
                            CorrectAnswer = "HELLO",
                            Description = "Decodifică mesajul \"KHOOR\" criptat cu un cifru Cezar cu deplasare 3.",
                            XpReward = 30
                        },
                        new ChallengeData
                        {
                            Title = "XSS reflectat",
                            Category = "Securitate Web",
                            Difficulty = "mediu",
                            CorrectAnswer = "<script>alert(1)</script>",
                            Description = "Construiește un payload XSS de bază pentru un parametru reflectat.",
                            XpReward = 80
                        },
                        new ChallengeData
                        {
                            Title = "Port SSH",
                            Category = "Securitate Rețea",
                            Difficulty = "usor",
                            CorrectAnswer = "22",
                            Description = "Ce port standard folosește SSH?",
                            XpReward = 20
                        },
                        new ChallengeData
                        {
                            Title = "Hash depășit",
                            Category = "Criptografie",
                            Difficulty = "mediu",
                            CorrectAnswer = "md5",
                            Description = "Ce algoritm de hash de 128 de biți este considerat depășit criptografic?",
                            XpReward = 40
                        }
                    );
                    chdb.SaveChanges();
                }
            }

            using (var adb = new AchievementContext())
            {
                adb.Database.EnsureCreated();
                if (!adb.Achievements.Any())
                {
                    adb.Achievements.AddRange(
                        new AchievementData { Title = "Primul pas", Description = "Primul exercițiu rezolvat", XpRequired = 1 },
                        new AchievementData { Title = "Sprinter", Description = "100 XP obținut", XpRequired = 100 },
                        new AchievementData { Title = "Avansat", Description = "500 XP obținut", XpRequired = 500 },
                        new AchievementData { Title = "Veteran", Description = "1000 XP obținut", XpRequired = 1000 }
                    );
                    adb.SaveChanges();
                }
            }

            using (var ndb = new NewsContext())
            {
                ndb.Database.EnsureCreated();
                if (!ndb.News.Any())
                {
                    ndb.News.Add(new NewsData
                    {
                        Title = "Bun venit pe CyberTrain!",
                        Content = "Platforma este online. Explorează exercițiile, alătură-te unui clan și urcă în clasament."
                    });
                    ndb.SaveChanges();
                }
            }

            using (var mdb = new MessageContext())
            {
                mdb.Database.EnsureCreated();
            }

            using (var sdb = new SubmissionContext())
            {
                sdb.Database.EnsureCreated();
            }
        }
    }
}
