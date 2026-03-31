using CyberTrain.Domain.Models.Achievement;
using CyberTrain.Domain.Models.Responces;

namespace CyberTrain.BusinessLayer.Interfaces
{
    public interface IAchievementAction
    {
        List<AchievementDto> GetAllAchievementsAction();
        List<UserAchievementDto> GetUserAchievementsAction(int userId);
        ActionResponce CreateAchievementAction(CreateAchievementDto data);
        ActionResponce UpdateAchievementAction(int id, CreateAchievementDto data);
        ActionResponce DeleteAchievementAction(int id);
        void CheckAndGrantAction(int userId);
    }
}
