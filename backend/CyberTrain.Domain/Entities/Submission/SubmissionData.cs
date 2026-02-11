using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CyberTrain.Domain.Entities.Submission
{
    public class SubmissionData
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public int UserId { get; set; }

        public int ChallengeId { get; set; }

        [StringLength(500)]
        public string? Answer { get; set; }

        public bool IsCorrect { get; set; }

        [DataType(DataType.Date)]
        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
    }
}
