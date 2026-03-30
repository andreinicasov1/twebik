using CyberTrain.DataAccess.Context;
using CyberTrain.Domain.Entities.Clan;
using CyberTrain.Domain.Models.Clan;
using CyberTrain.Domain.Models.Responces;

namespace CyberTrain.BusinessLayer.Core
{
    public class ClanActions
    {
        protected ClanActions() { }

        protected List<ClanDto> GetAllClansActionExecution()
        {
            List<ClanData> clans;
            using (var db = new ClanContext())
            {
                clans = db.Clans.Where(x => !x.IsDeleted).ToList();
            }

            // agregăm memberii și XP-ul din UserContext
            var result = new List<ClanDto>();
            using var udb = new UserContext();
            foreach (var c in clans)
            {
                var members = udb.Users.Where(u => u.ClanId == c.Id && !u.IsDeleted).ToList();
                result.Add(new ClanDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Description = c.Description,
                    CreatedAt = c.CreatedAt,
                    MemberCount = members.Count,
                    TotalXp = members.Sum(m => m.Xp)
                });
            }
            return result;
        }

        protected ClanDto? GetClanByIdActionExecution(int id)
        {
            ClanData? c;
            using (var db = new ClanContext())
            {
                c = db.Clans.FirstOrDefault(x => x.Id == id && !x.IsDeleted);
            }
            if (c == null) return null;

            using var udb = new UserContext();
            var members = udb.Users.Where(u => u.ClanId == c.Id && !u.IsDeleted).ToList();
            return new ClanDto
            {
                Id = c.Id, Name = c.Name, Description = c.Description,
                CreatedAt = c.CreatedAt, MemberCount = members.Count,
                TotalXp = members.Sum(m => m.Xp)
            };
        }

        protected ActionResponce CreateClanActionExecution(CreateClanDto data, int creatorUserId)
        {
            var status = ValidateClanName(data.Name);
            if (!status.IsSuccess) return status;

            ClanData c;
            using (var db = new ClanContext())
            {
                c = new ClanData { Name = data.Name, Description = data.Description ?? "" };
                db.Clans.Add(c);
                db.SaveChanges();
            }

            // creatorul se alătură automat clanului
            using (var udb = new UserContext())
            {
                var user = udb.Users.FirstOrDefault(u => u.Id == creatorUserId && !u.IsDeleted);
                if (user != null)
                {
                    user.ClanId = c.Id;
                    udb.SaveChanges();
                }
            }

            return new ActionResponce
            {
                IsSuccess = true, Message = "Clan creat.",
                Data = new ClanDto { Id = c.Id, Name = c.Name, Description = c.Description, CreatedAt = c.CreatedAt, MemberCount = 1, TotalXp = 0 }
            };
        }

        protected ActionResponce DeleteClanActionExecution(int id)
        {
            using var db = new ClanContext();
            var c = db.Clans.FirstOrDefault(x => x.Id == id && !x.IsDeleted);
            if (c == null) return new ActionResponce { IsSuccess = false, Message = "Clanul nu există." };

            c.IsDeleted = true;
            db.Clans.Update(c);
            db.SaveChanges();

            // scoatem membrii
            using (var udb = new UserContext())
            {
                var members = udb.Users.Where(u => u.ClanId == id).ToList();
                foreach (var m in members) m.ClanId = null;
                udb.SaveChanges();
            }
            return new ActionResponce { IsSuccess = true, Message = "Clan șters." };
        }

        protected ActionResponce JoinClanActionExecution(int clanId, int userId)
        {
            using (var db = new ClanContext())
            {
                if (!db.Clans.Any(x => x.Id == clanId && !x.IsDeleted))
                    return new ActionResponce { IsSuccess = false, Message = "Clanul nu există." };
            }
            using var udb = new UserContext();
            var user = udb.Users.FirstOrDefault(u => u.Id == userId && !u.IsDeleted);
            if (user == null) return new ActionResponce { IsSuccess = false, Message = "Utilizator inexistent." };

            user.ClanId = clanId;
            udb.SaveChanges();
            return new ActionResponce { IsSuccess = true, Message = "Te-ai alăturat clanului." };
        }

        protected ActionResponce LeaveClanActionExecution(int userId)
        {
            using var udb = new UserContext();
            var user = udb.Users.FirstOrDefault(u => u.Id == userId && !u.IsDeleted);
            if (user == null) return new ActionResponce { IsSuccess = false, Message = "Utilizator inexistent." };

            user.ClanId = null;
            udb.SaveChanges();
            return new ActionResponce { IsSuccess = true, Message = "Ai părăsit clanul." };
        }

        protected List<ClanLeaderboardDto> GetClanLeaderboardActionExecution()
        {
            List<ClanData> clans;
            using (var db = new ClanContext())
            {
                clans = db.Clans.Where(x => !x.IsDeleted).ToList();
            }
            var result = new List<ClanLeaderboardDto>();
            using var udb = new UserContext();
            foreach (var c in clans)
            {
                var members = udb.Users.Where(u => u.ClanId == c.Id && !u.IsDeleted).ToList();
                result.Add(new ClanLeaderboardDto
                {
                    ClanId = c.Id, Name = c.Name,
                    MemberCount = members.Count, TotalXp = members.Sum(m => m.Xp)
                });
            }
            return result.OrderByDescending(x => x.TotalXp).ToList();
        }

        private ActionResponce ValidateClanName(string name)
        {
            using var db = new ClanContext();
            if (db.Clans.Any(x => x.Name.ToLower() == name.ToLower() && !x.IsDeleted))
                return new ActionResponce { IsSuccess = false, Message = "Există deja un clan cu acest nume." };
            return new ActionResponce { IsSuccess = true };
        }
    }
}
