using CyberTrain.Domain.Entities.Clan;
using Microsoft.EntityFrameworkCore;

namespace CyberTrain.DataAccess.Context
{
    public class ClanContext : DbContext
    {
        public DbSet<ClanData> Clans { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(DbSession.ConnectionString);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ClanData>().HasIndex(x => x.Name).IsUnique();
        }
    }
}
