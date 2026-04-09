using CyberTrain.BusinessLayer.Core;
using CyberTrain.BusinessLayer.Interfaces;
using CyberTrain.Domain.Models.Common;
using CyberTrain.Domain.Models.Responces;
using CyberTrain.Domain.Models.User;

namespace CyberTrain.BusinessLayer.Structure
{
    public class AdminExecution : AdminActions, IAdminAction
    {
        public AdminStatsDto GetAdminStatsAction() => GetAdminStatsActionExecution();
        public List<UserDto> GetAllUsersAction() => GetAllUsersActionExecution();
        public ActionResponce ChangeUserRoleAction(int userId, string role) => ChangeUserRoleActionExecution(userId, role);
        public ActionResponce DeleteUserAction(int userId) => DeleteUserActionExecution(userId);
    }
}
