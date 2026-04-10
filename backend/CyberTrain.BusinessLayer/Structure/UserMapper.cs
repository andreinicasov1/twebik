using CyberTrain.Domain.Entities.User;
using CyberTrain.Domain.Models.User;

namespace CyberTrain.BusinessLayer.Structure
{
    public static class UserMapper
    {
        public static int LevelFromXp(int xp) => 1 + (int)Math.Floor(Math.Sqrt(xp / 50.0));

        public static string RankFromXp(int xp) => xp switch
        {
            >= 5000 => "Hacker Legendar",
            >= 2500 => "Expert Cyber",
            >= 1000 => "Veteran",
            >= 500 => "Avansat",
            >= 100 => "Intermediar",
            _ => "Recrut"
        };

        public static UserDto ToDto(UserData u, string? clanName = null) => new()
        {
            Id = u.Id,
            Username = u.UserName,
            Email = u.Email,
            Role = u.Role == UserRole.Admin ? "admin" : "user",
            Xp = u.Xp,
            Level = LevelFromXp(u.Xp),
            Rank = RankFromXp(u.Xp),
            ClanId = u.ClanId,
            ClanName = clanName,
            CreatedAt = u.RegisteredOn
        };
    }
}
