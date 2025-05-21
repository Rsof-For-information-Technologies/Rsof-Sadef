using Sadef.Common.EFCore.Middleware;
using Sadef.Common.Infrastructure.EfCore.Db;
using Sadef.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

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

    }
}
