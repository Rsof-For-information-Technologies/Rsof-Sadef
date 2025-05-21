using Microsoft.EntityFrameworkCore;

namespace Sadef.Common.Infrastructure.EfCore.Db
{
    public interface ICustomModelBuilder
    {
        void Build(ModelBuilder modelBuilder);
    }
}
