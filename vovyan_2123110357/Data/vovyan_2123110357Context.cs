using Microsoft.EntityFrameworkCore;
using vovyan_2123110357.Model;

namespace vovyan_2123110357.Data
{
    public class vovyan_2123110357Context : DbContext
    {
        public vovyan_2123110357Context(DbContextOptions<vovyan_2123110357Context> options)
            : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Product>(entity =>
            {
                entity.Property(p => p.Price).HasPrecision(18, 2);
            });
        }
    }
}