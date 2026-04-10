using CyberTrain.BusinessLayer.Core;
using CyberTrain.BusinessLayer.Interfaces;
using CyberTrain.Domain.Models.Responces;
using CyberTrain.Domain.Models.User;

namespace CyberTrain.BusinessLayer.Structure
{
    public class UserAuthAction : UserActions, IUserLoginAction
    {
        public UserAuthAction() { }

        public ActionResponce UserLoginDataValidation(UserLoginDto udata)
        {
            return UserLoginDataValidationExecution(udata);
        }

        public UserDto? GetUserById(int id)
        {
            return GetUserByIdExecution(id);
        }
    }
}
