using CyberTrain.DataAccess.Context;
using CyberTrain.Domain.Entities.News;
using CyberTrain.Domain.Models.News;
using CyberTrain.Domain.Models.Responces;

namespace CyberTrain.BusinessLayer.Core
{
    public class NewsActions
    {
        protected NewsActions() { }

        protected List<NewsDto> GetAllNewsActionExecution()
        {
            List<NewsData> list;
            using (var db = new NewsContext())
            {
                list = db.News.Where(x => !x.IsDeleted).OrderByDescending(x => x.CreatedAt).ToList();
            }

            var authorIds = list.Where(x => x.AuthorId.HasValue).Select(x => x.AuthorId!.Value).Distinct().ToList();
            Dictionary<int, string> authorMap = new();
            if (authorIds.Count > 0)
            {
                using var udb = new UserContext();
                authorMap = udb.Users.Where(u => authorIds.Contains(u.Id))
                    .ToDictionary(u => u.Id, u => u.UserName);
            }

            return list.Select(n => new NewsDto
            {
                Id = n.Id, Title = n.Title, Content = n.Content,
                CreatedAt = n.CreatedAt,
                Author = n.AuthorId.HasValue && authorMap.TryGetValue(n.AuthorId.Value, out var name) ? name : null
            }).ToList();
        }

        protected ActionResponce CreateNewsActionExecution(CreateNewsDto data, int authorId)
        {
            if (string.IsNullOrWhiteSpace(data.Title) || string.IsNullOrWhiteSpace(data.Content))
                return new ActionResponce { IsSuccess = false, Message = "Titlul și conținutul sunt obligatorii." };

            using var db = new NewsContext();
            var n = new NewsData { Title = data.Title, Content = data.Content, AuthorId = authorId };
            db.News.Add(n);
            db.SaveChanges();
            return new ActionResponce { IsSuccess = true, Message = "Postare creată.", Data = new NewsDto {
                Id = n.Id, Title = n.Title, Content = n.Content, CreatedAt = n.CreatedAt
            }};
        }

        protected ActionResponce UpdateNewsActionExecution(int id, CreateNewsDto data)
        {
            using var db = new NewsContext();
            var n = db.News.FirstOrDefault(x => x.Id == id && !x.IsDeleted);
            if (n == null) return new ActionResponce { IsSuccess = false, Message = "Postarea nu există." };

            n.Title = data.Title; n.Content = data.Content; n.UpdatedAt = DateTime.UtcNow;
            db.News.Update(n);
            db.SaveChanges();
            return new ActionResponce { IsSuccess = true, Message = "Postare actualizată.", Data = new NewsDto {
                Id = n.Id, Title = n.Title, Content = n.Content, CreatedAt = n.CreatedAt
            }};
        }

        protected ActionResponce DeleteNewsActionExecution(int id)
        {
            using var db = new NewsContext();
            var n = db.News.FirstOrDefault(x => x.Id == id && !x.IsDeleted);
            if (n == null) return new ActionResponce { IsSuccess = false, Message = "Postarea nu există." };

            n.IsDeleted = true;
            db.News.Update(n);
            db.SaveChanges();
            return new ActionResponce { IsSuccess = true, Message = "Postare ștearsă." };
        }
    }
}
