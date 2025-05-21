using System;
using Microsoft.EntityFrameworkCore;
using Sadef.Common.Infrastructure.EfCore.Db;
namespace Sadef.Common.RestTemplate.Db
{
    public sealed class DbContextOptionsBuilderFactory : IExtendDbContextOptionsBuilder
    {
        public DbContextOptionsBuilder Extend(
            DbContextOptionsBuilder optionsBuilder,
            IDbConnStringFactory connectionStringFactory,
            string assemblyName)
        {
            return optionsBuilder.UseSqlServer(
                    connectionStringFactory.Create() ?? throw new InvalidOperationException("DB Connection String is empty."),
                    sqlOptions =>
                    {
                        // sqlOptions.MigrationsAssembly(assemblyName)
                        sqlOptions.EnableRetryOnFailure(
                            15,
                            TimeSpan.FromSeconds(30),
                            null);
                    })
                .EnableSensitiveDataLogging();
        }
    }
}
