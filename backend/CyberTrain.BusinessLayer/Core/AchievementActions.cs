using CyberTrain.DataAccess.Context;
using CyberTrain.Domain.Entities.Achievement;
using CyberTrain.Domain.Models.Achievement;
using CyberTrain.Domain.Models.Responces;

namespace CyberTrain.BusinessLayer.Core
{
    public class AchievementActions
    {
        protected AchievementActions() { }

        protected List<AchievementDto> GetAllAchievementsActionExecution()
        {
            using var db = new AchievementContext();
            return db.Achievements.Where(a => !a.IsDeleted)
                .OrderBy(a => a.XpRequired)
                .Select(a => new AchievementDto
                {
                    Id = a.Id, Title = a.Title, Description = a.Description, XpRequired = a.XpRequired
                }).ToList();
        }

        protected List<UserAchievementDto> GetUserAchievementsActionExecution(int userId)
        {
            using var db = new AchievementContext();
            return (from ua in db.UserAchievements
                    join a in db.Achievements on ua.AchievementId equals a.Id
                    where ua.UserId == userId && !a.IsDeleted
                    select new UserAchievementDto
                    {
                        Id = ua.Id,
                        AchievementId = ua.AchievementId,
                        Title = a.Title,
                        Description = a.Description,
                        UnlockedAt = ua.UnlockedAt
                    }).ToList();
        }

        protected ActionResponce CreateAchievementActionExecution(CreateAchievementDto data)
        {
            if (string.IsNullOrWhiteSpace(data.Title))
                return new ActionResponce { IsSuccess = false, Message = "Titlul este obligatoriu." };
            if (data.XpRequired <= 0)
                return new ActionResponce { IsSuccess = false, Message = "XP-ul trebuie pozitiv." };

            using var db = new AchievementContext();
            var a = new AchievementData
            {
                Title = data.Title, Description = data.Description ?? "", XpRequired = data.XpRequired
            };
            db.Achievements.Add(a);
            db.SaveChanges();
            return new ActionResponce
            {
                IsSuccess = true, Message = "Realizare creată.",
                Data = new AchievementDto { Id = a.Id, Title = a.Title, Description = a.Description, XpRequired = a.XpRequired }
            };
        }

        protected ActionResponce UpdateAchievementActionExecution(int id, CreateAchievementDto data)
        {
            using var db = new AchievementContext();
            var a = db.Achievements.FirstOrDefault(x => x.Id == id && !x.IsDeleted);
            if (a == null) return new ActionResponce { IsSuccess = false, Message = "Realizarea nu există." };

            a.Title = data.Title; a.Description = data.Description ?? ""; a.XpRequired = data.XpRequired;
            db.Achievements.Update(a);
            db.SaveChanges();
            return new ActionResponce
            {
                IsSuccess = true, Message = "Realizare actualizată.",
                Data = new AchievementDto { Id = a.Id, Title = a.Title, Description = a.Description, XpRequired = a.XpRequired }
            };
        }

        protected ActionResponce DeleteAchievementActionExecution(int id)
        {
            using var db = new AchievementContext();
            var a = db.Achievements.FirstOrDefault(x => x.Id == id && !x.IsDeleted);
            if (a == null) return new ActionResponce { IsSuccess = false, Message = "Realizarea nu există." };

            a.IsDeleted = true;
            db.Achievements.Update(a);
            db.SaveChanges();
            return new ActionResponce { IsSuccess = true, Message = "Realizare ștearsă." };
        }

        /// <summary>
        /// Verifică XP-ul utilizatorului și acordă toate realizările la care s-a calificat.
        /// </summary>
        protected void CheckAndGrantActionExecution(int userId)
        {
            int xp;
            using (var udb = new UserContext())
            {
                var u = udb.Users.FirstOrDefault(x => x.Id == userId && !x.IsDeleted);
                if (u == null) return;
                xp = u.Xp;
            }

            using var db = new AchievementContext();
            var eligible = db.Achievements.Where(a => !a.IsDeleted && a.XpRequired <= xp).ToList();
            var owned = db.UserAchievements.Where(u => u.UserId == userId)
                .Select(u => u.AchievementId).ToHashSet();

            foreach (var a in eligible)
            {
                if (!owned.Contains(a.Id))
                {
                    db.UserAchievements.Add(new UserAchievementData
                    {
                        UserId = userId, AchievementId = a.Id, UnlockedAt = DateTime.UtcNow
                    });
                }
            }
            db.SaveChanges();
        }
    }
}
