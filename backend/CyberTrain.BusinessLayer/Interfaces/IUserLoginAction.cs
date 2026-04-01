using CyberTrain.Domain.Models.Responces;
using CyberTrain.Domain.Models.User;

namespace CyberTrain.BusinessLayer.Interfaces
{
    public interface IUserLoginAction
    {
        ActionResponce UserLoginDataValidation(UserLoginDto udata);
        UserDto? GetUserById(int id);
    }
}
