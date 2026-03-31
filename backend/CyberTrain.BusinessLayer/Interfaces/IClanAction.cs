using CyberTrain.Domain.Models.Clan;
using CyberTrain.Domain.Models.Responces;

namespace CyberTrain.BusinessLayer.Interfaces
{
    public interface IClanAction
    {
        List<ClanDto> GetAllClansAction();
        ClanDto? GetClanByIdAction(int id);
        ActionResponce CreateClanAction(CreateClanDto data, int creatorUserId);
        ActionResponce DeleteClanAction(int id);
        ActionResponce JoinClanAction(int clanId, int userId);
        ActionResponce LeaveClanAction(int userId);
        List<ClanLeaderboardDto> GetClanLeaderboardAction();
    }
}
