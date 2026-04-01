using CyberTrain.Domain.Models.Message;
using CyberTrain.Domain.Models.Responces;

namespace CyberTrain.BusinessLayer.Interfaces
{
    public interface IMessageAction
    {
        ActionResponce CreateMessageAction(CreateMessageDto data);
        List<MessageDto> GetAllMessagesAction();
        ActionResponce UpdateMessageStatusAction(int id, string status);
        ActionResponce DeleteMessageAction(int id);
    }
}
