using System.ComponentModel.DataAnnotations;

namespace CyberTrain.Domain.Models.Clan
{
    public class ClanDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Description { get; set; } = "";
        public int MemberCount { get; set; }
        public int TotalXp { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateClanDto
    {
        [Required, MinLength(2), StringLength(60)]
        public string Name { get; set; } = null!;

        [StringLength(400)]
        public string Description { get; set; } = "";
    }

    public class ClanLeaderboardDto
    {
        public int ClanId { get; set; }
        public string Name { get; set; } = null!;
        public int MemberCount { get; set; }
        public int TotalXp { get; set; }
    }
}
