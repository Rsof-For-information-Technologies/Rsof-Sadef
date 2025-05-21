using System.Reflection;
using Humanizer;
using Sadef.Common.Domain;
using Sadef.Common.Infrastructure.EfCore.Db;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Sadef.Common.Infrastructure.EfCore.Extensions
{
    public static class DbContextExtensions
    {
        public static bool AllMigrationsApplied(this DbContext context)
        {
            var applied = context.GetService<IHistoryRepository>()
                .GetAppliedMigrations()
                .Select(m => m.MigrationId);

            var total = context.GetService<IMigrationsAssembly>()
                .Migrations
                .Select(m => m.Key);

            return !total.Except(applied).Any();
        }


        public static ModelBuilder RegisterEntities(this ModelBuilder builder, IEnumerable<Type> typeToRegisters)
        {
            var concreteTypes = typeToRegisters.Where(x => !x.GetTypeInfo().IsAbstract && !x.GetTypeInfo().IsInterface);
            var types = new List<Type>();

            foreach (var concreteType in concreteTypes)
            {
                if (concreteType.BaseType != null &&
                    (typeof(AggregateRootBase).IsAssignableFrom(concreteType)))
                {
                    builder.Entity(concreteType);
                }
            }
            return builder;
        }

        public static ModelBuilder RegisterConvention(this ModelBuilder modelBuilder)
        {
            var types = modelBuilder.Model.GetEntityTypes()
              .Where(entity => entity.ClrType.Namespace != null);

            foreach (var entityType in types)
                modelBuilder.Entity(entityType.Name).ToTable(entityType.ClrType.Name.Pluralize());
            return modelBuilder;
        }

        public static ModelBuilder RegisterCustomMappings(this ModelBuilder modelBuilder, IEnumerable<Type> typeToRegisters)
        {
            var customModelBuilderTypes =
                typeToRegisters.Where(x => typeof(ICustomModelBuilder).IsAssignableFrom(x));

            foreach (var builderType in customModelBuilderTypes)
                if (builderType != null && builderType != typeof(ICustomModelBuilder))
                {
                    var builder = (ICustomModelBuilder)Activator.CreateInstance(builderType);
                    builder.Build(modelBuilder);
                }
            return modelBuilder;
        }
    }
}
