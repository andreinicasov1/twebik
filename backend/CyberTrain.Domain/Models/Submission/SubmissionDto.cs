namespace CyberTrain.Domain.Models.Submission
{
    public class SubmissionDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string? Username { get; set; }
        public int ChallengeId { get; set; }
        public string? ChallengeTitle { get; set; }
        public bool IsCorrect { get; set; }
        public DateTime SubmittedAt { get; set; }
    }

    public class SubmitResultDto
    {
        public bool IsCorrect { get; set; }
        public int XpGained { get; set; }
        public string Message { get; set; } = null!;
    }
}
