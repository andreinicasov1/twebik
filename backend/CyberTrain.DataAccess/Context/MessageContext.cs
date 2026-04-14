using CyberTrain.Domain.Entities.Message;
using Microsoft.EntityFrameworkCore;

namespace CyberTrain.DataAccess.Context
{
    public class MessageContext : DbContext
    {
        public DbSet<MessageData> Messages { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(DbSession.ConnectionString);
        }
    }
}
