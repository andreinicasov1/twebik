using CyberTrain.BusinessLayer.Interfaces;
using CyberTrain.BusinessLayer.Structure;

namespace CyberTrain.BusinessLayer
{
    public class BusinessLogic
    {
        public BusinessLogic() { }

        public IUserLoginAction UserLoginAction()
        {
            return new UserAuthAction();
        }

        public IUserRegAction UserRegAction()
        {
            return new UserRegActionExecution();
        }

        public IChallengeAction ChallengeAction()
        {
            return new ChallengeExecution();
        }

        public IClanAction ClanAction()
        {
            return new ClanExecution();
        }

        public IAchievementAction AchievementAction()
        {
            return new AchievementExecution();
        }

        public INewsAction NewsAction()
        {
            return new NewsExecution();
        }

        public IMessageAction MessageAction()
        {
            return new MessageExecution();
        }

        public ICommonAction CommonAction()
        {
            return new CommonExecution();
        }

        public IAdminAction AdminAction()
        {
            return new AdminExecution();
        }
    }
}
