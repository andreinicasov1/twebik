using CyberTrain.BusinessLayer.Structure;
using CyberTrain.DataAccess.Context;
using CyberTrain.Domain.Models.Common;
using CyberTrain.Domain.Models.Submission;
using CyberTrain.Domain.Models.User;

namespace CyberTrain.BusinessLayer.Core
{
    public class CommonActions
    {
        protected CommonActions() { }

        protected List<LeaderboardEntryDto> GetLeaderboardActionExecution()
        {
            Dictionary<int, string> clanMap;
            using (var cdb = new ClanContext())
            {
                clanMap = cdb.Clans.Where(c => !c.IsDeleted).ToDictionary(c => c.Id, c => c.Name);
            }

            using var udb = new UserContext();
            var top = udb.Users.Where(u => !u.IsDeleted)
                .OrderByDescending(u => u.Xp).Take(100).ToList();

            return top.Select(u => new LeaderboardEntryDto
            {
                UserId = u.Id,
                Username = u.UserName,
                Xp = u.Xp,
                Level = UserMapper.LevelFromXp(u.Xp),
                ClanName = u.ClanId.HasValue && clanMap.TryGetValue(u.ClanId.Value, out var n) ? n : null
            }).ToList();
        }

        protected DashboardDto GetDashboardActionExecution(int userId)
        {
            int xp;
            using (var udb = new UserContext())
            {
                var u = udb.Users.FirstOrDefault(x => x.Id == userId && !x.IsDeleted);
                if (u == null) return new DashboardDto();
                xp = u.Xp;
            }

            int completed;
            List<SubmissionDto> recent;
            using (var sdb = new SubmissionContext())
            {
                completed = sdb.Submissions.Where(s => s.UserId == userId && s.IsCorrect)
                    .Select(s => s.ChallengeId).Distinct().Count();

                var raw = sdb.Submissions.Where(s => s.UserId == userId)
                    .OrderByDescending(s => s.SubmittedAt).Take(10).ToList();

                var chIds = raw.Select(r => r.ChallengeId).Distinct().ToList();
                Dictionary<int, string> titles;
                using (var cdb = new ChallengeContext())
                {
                    titles = cdb.Challenges.Where(c => chIds.Contains(c.Id))
                        .ToDictionary(c => c.Id, c => c.Title);
                }

                recent = raw.Select(s => new SubmissionDto
                {
                    Id = s.Id, UserId = s.UserId, ChallengeId = s.ChallengeId,
                    ChallengeTitle = titles.TryGetValue(s.ChallengeId, out var t) ? t : null,
                    IsCorrect = s.IsCorrect, SubmittedAt = s.SubmittedAt
                }).ToList();
            }

            return new DashboardDto
            {
                Xp = xp, Level = UserMapper.LevelFromXp(xp),
                Completed = completed, RecentActivity = recent
            };
        }

        protected UserDto? GetProfileActionExecution(int userId)
        {
            using var udb = new UserContext();
            var u = udb.Users.FirstOrDefault(x => x.Id == userId && !x.IsDeleted);
            if (u == null) return null;

            string? clanName = null;
            if (u.ClanId.HasValue)
            {
                using var cdb = new ClanContext();
                clanName = cdb.Clans.FirstOrDefault(c => c.Id == u.ClanId.Value)?.Name;
            }
            return UserMapper.ToDto(u, clanName);
        }
    }
}
