using Sadef.Infrastructure.DBContext;
using Microsoft.EntityFrameworkCore;

namespace Sadef.API.Configs
{
    public static class AppUseExtensions
    {
        public static IApplicationBuilder AppUse(this IApplicationBuilder app)
        {
            using var scope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>().CreateScope();
            var context = scope.ServiceProvider.GetService<SadefDbContext>();
            context?.Database.Migrate();

            return app;
        }
    }
}
