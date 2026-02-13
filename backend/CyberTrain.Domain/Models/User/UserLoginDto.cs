using System.ComponentModel.DataAnnotations;

namespace CyberTrain.Domain.Models.User
{
    public class UserLoginDto
    {
        [Required]
        [DataType(DataType.EmailAddress)]
        public string Email { get; set; } = null!;

        [Required]
        [StringLength(48, MinimumLength = 6)]
        public string Password { get; set; } = null!;
    }
}
