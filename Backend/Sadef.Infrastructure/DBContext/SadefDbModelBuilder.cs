using Sadef.Common.Infrastructure.EfCore.Db;
using Sadef.Domain;
using Microsoft.EntityFrameworkCore;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace Sadef.Infrastructure.DBContext
{
    public class SadefDbModelBuilder : ICustomModelBuilder
    {
        private const string Schema = "dbo";
        public void Build(ModelBuilder modelBuilder)
        {

        }
    }
}
