using Microsoft.EntityFrameworkCore;

namespace Sadef.Common.Infrastructure.EfCore.Migration
{
    public interface ISeedData<in TDbContext>
        where TDbContext : DbContext
    {
        Task SeedAsync(TDbContext context);
    }

    public interface IAuthConfigSeedData<in TDbContext> : ISeedData<TDbContext>
        where TDbContext : DbContext
    {
    }
}
