using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Sadef.Common.EFCore.Middleware;
using Sadef.Common.Infrastructure.EfCore.Db;
using Sadef.Domain.BlogsEntity;
using Sadef.Domain.PropertyEntity;
using Sadef.Domain.LeadEntity;
using Sadef.Domain.ContactEntity;
using Sadef.Domain.MaintenanceRequestEntity;
using Sadef.Domain.Users;
using Sadef.Common.Domain;
using Sadef.Domain;
using Sadef.Domain.Constants;
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

            //Value conversion for List<FeatureList> Features
            modelBuilder.Entity<Property>()
                .Property(p => p.Features)
                .HasConversion(
                    v => string.Join(';', v.Select(f => f.ToString())),
                    v => v.Split(';', StringSplitOptions.RemoveEmptyEntries)
                        .Select(s => Enum.Parse<FeatureList>(s))
                        .ToList());
        }

        public DbSet<Blog> Blogs { get; set; }
        public DbSet<Property> Properties { get; set; }
        public DbSet<PropertyTranslation> PropertyTranslations { get; set; }
        public DbSet<FavoriteProperty> FavoriteProperties { get; set; }
        public DbSet<Lead> Lead { get; set; }
        public DbSet<Contact> Contacts { get; set; }
        public DbSet<Timeslot> Timeslots { get; set; }
        public DbSet<UserInfo> UserInfo { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }
        public DbSet<MaintenanceRequest> MaintenanceRequests { get; set; }
    }
}
