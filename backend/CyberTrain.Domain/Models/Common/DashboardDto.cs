using CyberTrain.Domain.Models.Submission;

namespace CyberTrain.Domain.Models.Common
{
    public class LeaderboardEntryDto
    {
        public int UserId { get; set; }
        public string Username { get; set; } = null!;
        public int Xp { get; set; }
        public int Level { get; set; }
        public string? ClanName { get; set; }
    }

    public class DashboardDto
    {
        public int Xp { get; set; }
        public int Level { get; set; }
        public int Completed { get; set; }
        public List<SubmissionDto> RecentActivity { get; set; } = new();
    }

    public class AdminStatsDto
    {
        public int UsersCount { get; set; }
        public int ChallengesCount { get; set; }
        public int SubmissionsCount { get; set; }
        public List<SubmissionDto> RecentActivity { get; set; } = new();
    }
}
