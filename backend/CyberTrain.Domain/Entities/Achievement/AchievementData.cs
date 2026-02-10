using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CyberTrain.Domain.Entities.Achievement
{
    public class AchievementData
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [StringLength(120)]
        public string Title { get; set; } = null!;

        [StringLength(400)]
        public string Description { get; set; } = "";

        public int XpRequired { get; set; }

        public bool IsDeleted { get; set; }

        [DataType(DataType.Date)]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class UserAchievementData
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public int UserId { get; set; }

        public int AchievementId { get; set; }

        [DataType(DataType.Date)]
        public DateTime UnlockedAt { get; set; } = DateTime.UtcNow;
    }
}
