using CyberTrain.BusinessLayer.Core;
using CyberTrain.BusinessLayer.Interfaces;
using CyberTrain.Domain.Models.Challenge;
using CyberTrain.Domain.Models.Responces;
using CyberTrain.Domain.Models.Submission;

namespace CyberTrain.BusinessLayer.Structure
{
    public class ChallengeExecution : ChallengeActions, IChallengeAction
    {
        public List<ChallengeDto> GetAllChallengesAction(int userId)
            => GetAllChallengesActionExecution(userId);

        public ChallengeDto? GetChallengeByIdAction(int id, int userId)
            => GetChallengeByIdActionExecution(id, userId);

        public ActionResponce CreateChallengeAction(CreateChallengeDto data)
            => CreateChallengeActionExecution(data);

        public ActionResponce UpdateChallengeAction(int id, CreateChallengeDto data)
            => UpdateChallengeActionExecution(id, data);

        public ActionResponce DeleteChallengeAction(int id)
            => DeleteChallengeActionExecution(id);

        public SubmitResultDto SubmitAnswerAction(int challengeId, int userId, string answer)
        {
            var result = SubmitAnswerActionExecution(challengeId, userId, answer);
            if (result.IsCorrect)
            {
                // trigger grant achievements
                new AchievementExecution().CheckAndGrantAction(userId);
            }
            return result;
        }
    }
}
