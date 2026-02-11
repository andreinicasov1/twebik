using System.ComponentModel.DataAnnotations;

namespace CyberTrain.Domain.Models.Achievement
{
    public class AchievementDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string Description { get; set; } = "";
        public int XpRequired { get; set; }
    }

    public class CreateAchievementDto
    {
        [Required, StringLength(120)] public string Title { get; set; } = null!;
        [StringLength(400)] public string Description { get; set; } = "";
        [Range(1, 1000000)] public int XpRequired { get; set; }
    }

    public class UserAchievementDto
    {
        public int Id { get; set; }
        public int AchievementId { get; set; }
        public string Title { get; set; } = null!;
        public string Description { get; set; } = "";
        public DateTime UnlockedAt { get; set; }
    }
}
