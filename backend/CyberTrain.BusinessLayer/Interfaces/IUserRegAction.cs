using CyberTrain.Domain.Models.Responces;
using CyberTrain.Domain.Models.User;

namespace CyberTrain.BusinessLayer.Interfaces
{
    public interface IUserRegAction
    {
        ActionResponce UserRegDataValidation(UserRegisterDto uReg);
    }
}
