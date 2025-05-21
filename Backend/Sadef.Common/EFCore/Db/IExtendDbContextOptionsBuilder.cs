using Microsoft.EntityFrameworkCore;

namespace Sadef.Common.Infrastructure.EfCore.Db
{
    public interface IExtendDbContextOptionsBuilder
    {
        DbContextOptionsBuilder Extend(DbContextOptionsBuilder optionsBuilder,
            IDbConnStringFactory connectionStringFactory, string assemblyName);
    }
}
