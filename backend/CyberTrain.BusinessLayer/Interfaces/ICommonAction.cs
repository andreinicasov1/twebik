using CyberTrain.Domain.Models.Common;
using CyberTrain.Domain.Models.User;

namespace CyberTrain.BusinessLayer.Interfaces
{
    public interface ICommonAction
    {
        List<LeaderboardEntryDto> GetLeaderboardAction();
        DashboardDto GetDashboardAction(int userId);
        UserDto? GetProfileAction(int userId);
    }
}
