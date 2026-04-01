using CyberTrain.Domain.Models.News;
using CyberTrain.Domain.Models.Responces;

namespace CyberTrain.BusinessLayer.Interfaces
{
    public interface INewsAction
    {
        List<NewsDto> GetAllNewsAction();
        ActionResponce CreateNewsAction(CreateNewsDto data, int authorId);
        ActionResponce UpdateNewsAction(int id, CreateNewsDto data);
        ActionResponce DeleteNewsAction(int id);
    }
}
