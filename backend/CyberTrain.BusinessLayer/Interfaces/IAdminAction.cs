using CyberTrain.Domain.Models.Common;
using CyberTrain.Domain.Models.Responces;
using CyberTrain.Domain.Models.User;

namespace CyberTrain.BusinessLayer.Interfaces
{
    public interface IAdminAction
    {
        AdminStatsDto GetAdminStatsAction();
        List<UserDto> GetAllUsersAction();
        ActionResponce ChangeUserRoleAction(int userId, string role);
        ActionResponce DeleteUserAction(int userId);
    }
}
