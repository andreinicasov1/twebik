namespace CyberTrain.Domain.Models.User
{
    public class UserDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Role { get; set; } = null!;
        public int Xp { get; set; }
        public int Level { get; set; }
        public string Rank { get; set; } = null!;
        public int? ClanId { get; set; }
        public string? ClanName { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class AuthResponseDto
    {
        public string Token { get; set; } = null!;
        public UserDto User { get; set; } = null!;
    }

    public class ChangeRoleDto
    {
        public string Role { get; set; } = null!;
    }
}
