using CyberTrain.BusinessLayer.Core;
using CyberTrain.BusinessLayer.Interfaces;
using CyberTrain.Domain.Models.News;
using CyberTrain.Domain.Models.Responces;

namespace CyberTrain.BusinessLayer.Structure
{
    public class NewsExecution : NewsActions, INewsAction
    {
        public List<NewsDto> GetAllNewsAction() => GetAllNewsActionExecution();
        public ActionResponce CreateNewsAction(CreateNewsDto data, int authorId)
            => CreateNewsActionExecution(data, authorId);
        public ActionResponce UpdateNewsAction(int id, CreateNewsDto data)
            => UpdateNewsActionExecution(id, data);
        public ActionResponce DeleteNewsAction(int id) => DeleteNewsActionExecution(id);
    }
}
