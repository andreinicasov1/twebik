using CyberTrain.BusinessLayer.Core;
using CyberTrain.BusinessLayer.Interfaces;
using CyberTrain.Domain.Models.Responces;
using CyberTrain.Domain.Models.User;

namespace CyberTrain.BusinessLayer.Structure
{
    public class UserRegActionExecution : UserActions, IUserRegAction
    {
        public ActionResponce UserRegDataValidation(UserRegisterDto uReg)
        {
            return UserRegDataValidationAction(uReg);
        }
    }
}
