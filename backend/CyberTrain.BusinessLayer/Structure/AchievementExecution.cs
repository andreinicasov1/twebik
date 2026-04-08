using CyberTrain.BusinessLayer.Core;
using CyberTrain.BusinessLayer.Interfaces;
using CyberTrain.Domain.Models.Achievement;
using CyberTrain.Domain.Models.Responces;

namespace CyberTrain.BusinessLayer.Structure
{
    public class AchievementExecution : AchievementActions, IAchievementAction
    {
        public List<AchievementDto> GetAllAchievementsAction() => GetAllAchievementsActionExecution();
        public List<UserAchievementDto> GetUserAchievementsAction(int userId)
            => GetUserAchievementsActionExecution(userId);
        public ActionResponce CreateAchievementAction(CreateAchievementDto data)
            => CreateAchievementActionExecution(data);
        public ActionResponce UpdateAchievementAction(int id, CreateAchievementDto data)
            => UpdateAchievementActionExecution(id, data);
        public ActionResponce DeleteAchievementAction(int id) => DeleteAchievementActionExecution(id);
        public void CheckAndGrantAction(int userId) => CheckAndGrantActionExecution(userId);
    }
}
