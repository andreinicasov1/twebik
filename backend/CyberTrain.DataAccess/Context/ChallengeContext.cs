using CyberTrain.Domain.Entities.Challenge;
using Microsoft.EntityFrameworkCore;

namespace CyberTrain.DataAccess.Context
{
    public class ChallengeContext : DbContext
    {
        public DbSet<ChallengeData> Challenges { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(DbSession.ConnectionString);
        }
    }
}
