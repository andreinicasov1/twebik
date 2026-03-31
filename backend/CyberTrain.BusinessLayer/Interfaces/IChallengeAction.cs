using CyberTrain.Domain.Models.Challenge;
using CyberTrain.Domain.Models.Responces;
using CyberTrain.Domain.Models.Submission;

namespace CyberTrain.BusinessLayer.Interfaces
{
    public interface IChallengeAction
    {
        List<ChallengeDto> GetAllChallengesAction(int userId);
        ChallengeDto? GetChallengeByIdAction(int id, int userId);
        ActionResponce CreateChallengeAction(CreateChallengeDto data);
        ActionResponce UpdateChallengeAction(int id, CreateChallengeDto data);
        ActionResponce DeleteChallengeAction(int id);
        SubmitResultDto SubmitAnswerAction(int challengeId, int userId, string answer);
    }
}
