using CyberTrain.DataAccess.Context;
using CyberTrain.Domain.Entities.Message;
using CyberTrain.Domain.Models.Message;
using CyberTrain.Domain.Models.Responces;

namespace CyberTrain.BusinessLayer.Core
{
    public class MessageActions
    {
        protected MessageActions() { }

        protected ActionResponce CreateMessageActionExecution(CreateMessageDto data)
        {
            using var db = new MessageContext();
            db.Messages.Add(new MessageData
            {
                Name = data.Name.Trim(),
                Email = data.Email.Trim().ToLower(),
                Content = data.Message,
                Status = "nou"
            });
            db.SaveChanges();
            return new ActionResponce { IsSuccess = true, Message = "Mesaj primit. Mulțumim!" };
        }

        protected List<MessageDto> GetAllMessagesActionExecution()
        {
            using var db = new MessageContext();
            return db.Messages.Where(x => !x.IsDeleted)
                .OrderByDescending(x => x.CreatedAt)
                .Select(m => new MessageDto
                {
                    Id = m.Id, Name = m.Name, Email = m.Email,
                    Message = m.Content, Status = m.Status, CreatedAt = m.CreatedAt
                }).ToList();
        }

        protected ActionResponce UpdateMessageStatusActionExecution(int id, string status)
        {
            if (status != "nou" && status != "rezolvat")
                return new ActionResponce { IsSuccess = false, Message = "Status invalid." };

            using var db = new MessageContext();
            var m = db.Messages.FirstOrDefault(x => x.Id == id && !x.IsDeleted);
            if (m == null) return new ActionResponce { IsSuccess = false, Message = "Mesajul nu există." };

            m.Status = status;
            db.Messages.Update(m);
            db.SaveChanges();
            return new ActionResponce { IsSuccess = true, Message = "Status actualizat." };
        }

        protected ActionResponce DeleteMessageActionExecution(int id)
        {
            using var db = new MessageContext();
            var m = db.Messages.FirstOrDefault(x => x.Id == id && !x.IsDeleted);
            if (m == null) return new ActionResponce { IsSuccess = false, Message = "Mesajul nu există." };

            m.IsDeleted = true;
            db.Messages.Update(m);
            db.SaveChanges();
            return new ActionResponce { IsSuccess = true, Message = "Mesaj șters." };
        }
    }
}
