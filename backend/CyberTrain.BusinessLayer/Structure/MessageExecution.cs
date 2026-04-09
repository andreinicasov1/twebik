using CyberTrain.BusinessLayer.Core;
using CyberTrain.BusinessLayer.Interfaces;
using CyberTrain.Domain.Models.Message;
using CyberTrain.Domain.Models.Responces;

namespace CyberTrain.BusinessLayer.Structure
{
    public class MessageExecution : MessageActions, IMessageAction
    {
        public ActionResponce CreateMessageAction(CreateMessageDto data) => CreateMessageActionExecution(data);
        public List<MessageDto> GetAllMessagesAction() => GetAllMessagesActionExecution();
        public ActionResponce UpdateMessageStatusAction(int id, string status) => UpdateMessageStatusActionExecution(id, status);
        public ActionResponce DeleteMessageAction(int id) => DeleteMessageActionExecution(id);
    }
}
