using CyberTrain.BusinessLayer.Core;
using CyberTrain.BusinessLayer.Interfaces;
using CyberTrain.Domain.Models.Common;
using CyberTrain.Domain.Models.User;

namespace CyberTrain.BusinessLayer.Structure
{
    public class CommonExecution : CommonActions, ICommonAction
    {
        public List<LeaderboardEntryDto> GetLeaderboardAction() => GetLeaderboardActionExecution();
        public DashboardDto GetDashboardAction(int userId) => GetDashboardActionExecution(userId);
        public UserDto? GetProfileAction(int userId) => GetProfileActionExecution(userId);
    }
}
