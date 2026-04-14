using CyberTrain.Domain.Entities.Achievement;
using Microsoft.EntityFrameworkCore;

namespace CyberTrain.DataAccess.Context
{
    public class AchievementContext : DbContext
    {
        public DbSet<AchievementData> Achievements { get; set; } = null!;
        public DbSet<UserAchievementData> UserAchievements { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(DbSession.ConnectionString);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserAchievementData>()
                .HasIndex(x => new { x.UserId, x.AchievementId }).IsUnique();
        }
    }
}
