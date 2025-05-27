using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Sadef.Common.EFCore.Middleware;
using Sadef.Common.Infrastructure.EfCore.Db;
using Sadef.Domain.BlogsEntity;
using Sadef.Domain.PropertyEntity;

namespace Sadef.Infrastructure.DBContext
{
    public class SadefDbContext : AppDbContextIdentity
    {
        public readonly IConfiguration _configuration;
        private readonly AuditInterceptor _auditInterceptor;

        public SadefDbContext(DbContextOptions<SadefDbContext> options, IConfiguration config, AuditInterceptor auditInterceptor)
            : base(options, config)
        {
            _configuration = config;
            _auditInterceptor = auditInterceptor;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.AddInterceptors(_auditInterceptor);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            //Value conversion for List<string> Features
            modelBuilder.Entity<Property>()
                .Property(p => p.Features)
                .HasConversion(
                    v => string.Join(';', v),
                    v => v.Split(';', StringSplitOptions.RemoveEmptyEntries).ToList());
        }

        public DbSet<Blog> Blogs { get; set; }
        public DbSet<Property> Properties { get; set; }
    }
}
