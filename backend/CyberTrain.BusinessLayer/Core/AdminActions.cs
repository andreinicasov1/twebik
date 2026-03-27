using CyberTrain.BusinessLayer.Structure;
using CyberTrain.DataAccess.Context;
using CyberTrain.Domain.Entities.User;
using CyberTrain.Domain.Models.Common;
using CyberTrain.Domain.Models.Responces;
using CyberTrain.Domain.Models.Submission;
using CyberTrain.Domain.Models.User;

namespace CyberTrain.BusinessLayer.Core
{
    public class AdminActions
    {
        protected AdminActions() { }

        protected AdminStatsDto GetAdminStatsActionExecution()
        {
            int usersCount, challengesCount, submissionsCount;
            List<SubmissionDto> recent;

            using (var udb = new UserContext())
                usersCount = udb.Users.Count(u => !u.IsDeleted);
            using (var cdb = new ChallengeContext())
                challengesCount = cdb.Challenges.Count(c => !c.IsDeleted);
            using (var sdb = new SubmissionContext())
            {
                submissionsCount = sdb.Submissions.Count();
                var raw = sdb.Submissions.OrderByDescending(s => s.SubmittedAt).Take(15).ToList();

                var userIds = raw.Select(r => r.UserId).Distinct().ToList();
                var chIds = raw.Select(r => r.ChallengeId).Distinct().ToList();

                Dictionary<int, string> userMap, chMap;
                using (var udb2 = new UserContext())
                {
                    userMap = udb2.Users.Where(u => userIds.Contains(u.Id))
                        .ToDictionary(u => u.Id, u => u.UserName);
                }
                using (var cdb2 = new ChallengeContext())
                {
                    chMap = cdb2.Challenges.Where(c => chIds.Contains(c.Id))
                        .ToDictionary(c => c.Id, c => c.Title);
                }

                recent = raw.Select(s => new SubmissionDto
                {
                    Id = s.Id, UserId = s.UserId,
                    Username = userMap.TryGetValue(s.UserId, out var un) ? un : null,
                    ChallengeId = s.ChallengeId,
                    ChallengeTitle = chMap.TryGetValue(s.ChallengeId, out var ct) ? ct : null,
                    IsCorrect = s.IsCorrect, SubmittedAt = s.SubmittedAt
                }).ToList();
            }

            return new AdminStatsDto
            {
                UsersCount = usersCount, ChallengesCount = challengesCount,
                SubmissionsCount = submissionsCount, RecentActivity = recent
            };
        }

        protected List<UserDto> GetAllUsersActionExecution()
        {
            Dictionary<int, string> clanMap;
            using (var cdb = new ClanContext())
                clanMap = cdb.Clans.Where(c => !c.IsDeleted).ToDictionary(c => c.Id, c => c.Name);

            using var udb = new UserContext();
            return udb.Users.Where(u => !u.IsDeleted).OrderBy(u => u.Id).ToList()
                .Select(u => UserMapper.ToDto(u,
                    u.ClanId.HasValue && clanMap.TryGetValue(u.ClanId.Value, out var n) ? n : null))
                .ToList();
        }

        protected ActionResponce ChangeUserRoleActionExecution(int userId, string role)
        {
            if (role != "user" && role != "admin")
                return new ActionResponce { IsSuccess = false, Message = "Rol invalid." };

            using var udb = new UserContext();
            var u = udb.Users.FirstOrDefault(x => x.Id == userId && !x.IsDeleted);
            if (u == null) return new ActionResponce { IsSuccess = false, Message = "Utilizator inexistent." };

            u.Role = role == "admin" ? UserRole.Admin : UserRole.User;
            udb.SaveChanges();
            return new ActionResponce { IsSuccess = true, Message = "Rol actualizat." };
        }

        protected ActionResponce DeleteUserActionExecution(int userId)
        {
            using var udb = new UserContext();
            var u = udb.Users.FirstOrDefault(x => x.Id == userId && !x.IsDeleted);
            if (u == null) return new ActionResponce { IsSuccess = false, Message = "Utilizator inexistent." };

            u.IsDeleted = true;
            udb.SaveChanges();
            return new ActionResponce { IsSuccess = true, Message = "Utilizator șters." };
        }
    }
}
