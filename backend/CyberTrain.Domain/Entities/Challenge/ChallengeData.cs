using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CyberTrain.Domain.Entities.Challenge
{
    public class ChallengeData
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; } = null!;

        [Required]
        [StringLength(2000)]
        public string Description { get; set; } = null!;

        [Required]
        [StringLength(50)]
        public string Category { get; set; } = null!;

        [Required]
        [StringLength(20)]
        public string Difficulty { get; set; } = "usor";

        [Required]
        [StringLength(500)]
        public string CorrectAnswer { get; set; } = null!;

        public int XpReward { get; set; }

        public int? ClanId { get; set; }

        public bool IsClanOnly { get; set; }

        public bool IsDeleted { get; set; }

        [DataType(DataType.Date)]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [DataType(DataType.Date)]
        public DateTime? UpdatedAt { get; set; }
    }
}
