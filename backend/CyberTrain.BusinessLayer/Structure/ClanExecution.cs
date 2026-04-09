using CyberTrain.BusinessLayer.Core;
using CyberTrain.BusinessLayer.Interfaces;
using CyberTrain.Domain.Models.Clan;
using CyberTrain.Domain.Models.Responces;

namespace CyberTrain.BusinessLayer.Structure
{
    public class ClanExecution : ClanActions, IClanAction
    {
        public List<ClanDto> GetAllClansAction() => GetAllClansActionExecution();

        public ClanDto? GetClanByIdAction(int id) => GetClanByIdActionExecution(id);

        public ActionResponce CreateClanAction(CreateClanDto data, int creatorUserId)
            => CreateClanActionExecution(data, creatorUserId);

        public ActionResponce DeleteClanAction(int id) => DeleteClanActionExecution(id);

        public ActionResponce JoinClanAction(int clanId, int userId)
            => JoinClanActionExecution(clanId, userId);

        public ActionResponce LeaveClanAction(int userId) => LeaveClanActionExecution(userId);

        public List<ClanLeaderboardDto> GetClanLeaderboardAction() => GetClanLeaderboardActionExecution();
    }
}
