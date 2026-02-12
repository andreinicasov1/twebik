using System.ComponentModel.DataAnnotations;

namespace CyberTrain.Domain.Models.Challenge
{
    public class ChallengeDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string Category { get; set; } = null!;
        public string Difficulty { get; set; } = null!;
        public int XpReward { get; set; }
        public int? ClanId { get; set; }
        public bool IsClanOnly { get; set; }
    }

    public class ChallengeAdminDto : ChallengeDto
    {
        public string CorrectAnswer { get; set; } = null!;
    }

    public class CreateChallengeDto
    {
        [Required] public string Title { get; set; } = null!;
        [Required] public string Description { get; set; } = null!;
        [Required] public string Category { get; set; } = null!;
        [Required] public string Difficulty { get; set; } = null!;
        [Required] public string CorrectAnswer { get; set; } = null!;
        [Range(1, 10000)] public int XpReward { get; set; }
        public int? ClanId { get; set; }
        public bool IsClanOnly { get; set; }
    }

    public class SubmitAnswerDto
    {
        [Required] public string Answer { get; set; } = null!;
    }
}
