using System.ComponentModel.DataAnnotations;

namespace CyberTrain.Domain.Models.News
{
    public class NewsDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string Content { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public string? Author { get; set; }
    }

    public class CreateNewsDto
    {
        [Required, StringLength(200)] public string Title { get; set; } = null!;
        [Required, StringLength(4000)] public string Content { get; set; } = null!;
    }
}
