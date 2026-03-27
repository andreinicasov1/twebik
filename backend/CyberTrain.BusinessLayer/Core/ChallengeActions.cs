using CyberTrain.DataAccess.Context;
using CyberTrain.Domain.Entities.Challenge;
using CyberTrain.Domain.Entities.Submission;
using CyberTrain.Domain.Entities.User;
using CyberTrain.Domain.Models.Challenge;
using CyberTrain.Domain.Models.Responces;
using CyberTrain.Domain.Models.Submission;

namespace CyberTrain.BusinessLayer.Core
{
    public class ChallengeActions
    {
        protected ChallengeActions() { }

        protected List<ChallengeDto> GetAllChallengesActionExecution(int userId)
        {
            int? userClanId = null;
            using (var udb = new UserContext())
            {
                var u = udb.Users.FirstOrDefault(x => x.Id == userId);
                userClanId = u?.ClanId;
            }

            List<ChallengeData> list;
            using (var db = new ChallengeContext())
            {
                list = db.Challenges
                    .Where(c => !c.IsDeleted &&
                        (!c.IsClanOnly || (userClanId != null && c.ClanId == userClanId)))
                    .OrderBy(c => c.Id).ToList();
            }

            return list.Select(MapToDto).ToList();
        }

        protected ChallengeDto? GetChallengeByIdActionExecution(int id, int userId)
        {
            ChallengeData? c;
            using (var db = new ChallengeContext())
            {
                c = db.Challenges.FirstOrDefault(x => x.Id == id && !x.IsDeleted);
            }
            if (c == null) return null;

            if (c.IsClanOnly)
            {
                using var udb = new UserContext();
                var u = udb.Users.FirstOrDefault(x => x.Id == userId);
                if (u == null || u.ClanId != c.ClanId) return null;
            }

            return MapToDto(c);
        }

        protected ActionResponce CreateChallengeActionExecution(CreateChallengeDto data)
        {
            var validation = ValidateChallengeInput(data);
            if (!validation.IsSuccess) return validation;

            using var db = new ChallengeContext();
            var c = new ChallengeData
            {
                Title = data.Title,
                Description = data.Description,
                Category = data.Category,
                Difficulty = data.Difficulty,
                CorrectAnswer = data.CorrectAnswer,
                XpReward = data.XpReward,
                ClanId = data.ClanId,
                IsClanOnly = data.IsClanOnly,
                CreatedAt = DateTime.UtcNow
            };
            db.Challenges.Add(c);
            db.SaveChanges();

            return new ActionResponce { IsSuccess = true, Message = "Exercițiu creat.", Data = MapToAdminDto(c) };
        }

        protected ActionResponce UpdateChallengeActionExecution(int id, CreateChallengeDto data)
        {
            using var db = new ChallengeContext();
            var c = db.Challenges.FirstOrDefault(x => x.Id == id && !x.IsDeleted);
            if (c == null) return new ActionResponce { IsSuccess = false, Message = "Exercițiul nu a fost găsit." };

            c.Title = data.Title;
            c.Description = data.Description;
            c.Category = data.Category;
            c.Difficulty = data.Difficulty;
            c.CorrectAnswer = data.CorrectAnswer;
            c.XpReward = data.XpReward;
            c.ClanId = data.ClanId;
            c.IsClanOnly = data.IsClanOnly;
            c.UpdatedAt = DateTime.UtcNow;

            db.Challenges.Update(c);
            db.SaveChanges();
            return new ActionResponce { IsSuccess = true, Message = "Exercițiu actualizat.", Data = MapToAdminDto(c) };
        }

        protected ActionResponce DeleteChallengeActionExecution(int id)
        {
            using var db = new ChallengeContext();
            var c = db.Challenges.FirstOrDefault(x => x.Id == id && !x.IsDeleted);
            if (c == null) return new ActionResponce { IsSuccess = false, Message = "Exercițiul nu a fost găsit." };

            c.IsDeleted = true;
            db.Challenges.Update(c);
            db.SaveChanges();
            return new ActionResponce { IsSuccess = true, Message = "Exercițiu șters." };
        }

        protected SubmitResultDto SubmitAnswerActionExecution(int challengeId, int userId, string answer)
        {
            ChallengeData? challenge;
            using (var db = new ChallengeContext())
            {
                challenge = db.Challenges.FirstOrDefault(x => x.Id == challengeId && !x.IsDeleted);
            }
            if (challenge == null)
            {
                return new SubmitResultDto { IsCorrect = false, XpGained = 0, Message = "Exercițiul nu există." };
            }

            var isCorrect = string.Equals(
                (answer ?? "").Trim(), challenge.CorrectAnswer.Trim(),
                StringComparison.OrdinalIgnoreCase);

            bool alreadySolved;
            using (var sdb = new SubmissionContext())
            {
                alreadySolved = sdb.Submissions.Any(s =>
                    s.UserId == userId && s.ChallengeId == challengeId && s.IsCorrect);
                sdb.Submissions.Add(new SubmissionData
                {
                    UserId = userId,
                    ChallengeId = challengeId,
                    Answer = answer,
                    IsCorrect = isCorrect,
                    SubmittedAt = DateTime.UtcNow
                });
                sdb.SaveChanges();
            }

            int xpGained = 0;
            if (isCorrect && !alreadySolved)
            {
                xpGained = challenge.XpReward;
                using var udb = new UserContext();
                var user = udb.Users.FirstOrDefault(x => x.Id == userId);
                if (user != null)
                {
                    user.Xp += xpGained;
                    udb.SaveChanges();
                }
            }

            return new SubmitResultDto
            {
                IsCorrect = isCorrect,
                XpGained = xpGained,
                Message = isCorrect
                    ? (alreadySolved ? "Corect (deja rezolvat, fără XP suplimentar)." : $"Corect! +{xpGained} XP.")
                    : "Răspuns incorect. Mai încearcă."
            };
        }

        private static ActionResponce ValidateChallengeInput(CreateChallengeDto d)
        {
            if (string.IsNullOrWhiteSpace(d.Title))
                return new ActionResponce { IsSuccess = false, Message = "Titlul este obligatoriu." };
            if (string.IsNullOrWhiteSpace(d.CorrectAnswer))
                return new ActionResponce { IsSuccess = false, Message = "Răspunsul corect este obligatoriu." };
            if (d.XpReward <= 0)
                return new ActionResponce { IsSuccess = false, Message = "XP-ul trebuie să fie pozitiv." };
            if (d.Difficulty != "usor" && d.Difficulty != "mediu" && d.Difficulty != "greu")
                return new ActionResponce { IsSuccess = false, Message = "Dificultate invalidă." };
            return new ActionResponce { IsSuccess = true };
        }

        private static ChallengeDto MapToDto(ChallengeData c) => new()
        {
            Id = c.Id, Title = c.Title, Description = c.Description,
            Category = c.Category, Difficulty = c.Difficulty,
            XpReward = c.XpReward, ClanId = c.ClanId, IsClanOnly = c.IsClanOnly
        };

        private static ChallengeAdminDto MapToAdminDto(ChallengeData c) => new()
        {
            Id = c.Id, Title = c.Title, Description = c.Description,
            Category = c.Category, Difficulty = c.Difficulty,
            XpReward = c.XpReward, ClanId = c.ClanId, IsClanOnly = c.IsClanOnly,
            CorrectAnswer = c.CorrectAnswer
        };
    }
}
