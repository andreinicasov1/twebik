using System.ComponentModel.DataAnnotations;

namespace CyberTrain.Domain.Models.Message
{
    public class MessageDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Message { get; set; } = null!;
        public string Status { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
    }

    public class CreateMessageDto
    {
        [Required, StringLength(100)] public string Name { get; set; } = null!;
        [Required, DataType(DataType.EmailAddress)] public string Email { get; set; } = null!;
        [Required, MinLength(3), StringLength(2000)] public string Message { get; set; } = null!;
    }

    public class UpdateMessageDto
    {
        [Required] public string Status { get; set; } = null!;
    }
}
