using CyberTrain.Domain.Entities.News;
using Microsoft.EntityFrameworkCore;

namespace CyberTrain.DataAccess.Context
{
    public class NewsContext : DbContext
    {
        public DbSet<NewsData> News { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(DbSession.ConnectionString);
        }
    }
}
