using System.Text;
using Sadef.Common.Infrastructure;
using Sadef.Common.Infrastructure.AspNetCore.All;
using Sadef.Common.Infrastructure.AspNetCore.CleanArch;
using Sadef.Common.Infrastructure.EfCore;
using Sadef.Common.Infrastructure.EfCore.Db;
using Sadef.Common.Infrastructure.EFCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

namespace Sadef.Common.RestTemplate
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddCustomTemplate<TDbContext>(this IServiceCollection services,
            Action<IServiceCollection> preDbWorkHook = null,
            Action<IServiceCollection, IServiceProvider> postDbWorkHook = null)
            where TDbContext : DbContext
        {

            using (var scope = services.BuildServiceProvider().GetService<IServiceScopeFactory>().CreateScope())
            {
                var svcProvider = scope.ServiceProvider;
                var config = svcProvider.GetRequiredService<IConfiguration>();
                var env = svcProvider.GetRequiredService<IWebHostEnvironment>();

                preDbWorkHook?.Invoke(services);


                services.AddDbContext<TDbContext>((sp, o) =>
                {
                    var extendOptionsBuilder = sp.GetRequiredService<IExtendDbContextOptionsBuilder>();
                    var connStringFactory = sp.GetRequiredService<IDbConnStringFactory>();
                    extendOptionsBuilder.Extend(o, connStringFactory,
                        config.LoadApplicationAssemblies().FirstOrDefault()?.GetName().Name);
                });
                if (typeof(TDbContext).BaseType == typeof(AppDbContextIdentity))
                {
                    services.AddIdentity<ApplicationUser, ApplicationRole>(options =>
                        {
                            options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
                            options.Lockout.MaxFailedAccessAttempts = 5;
                            options.Lockout.AllowedForNewUsers = true;
                        })
                       .AddEntityFrameworkStores<TDbContext>()
                       .AddDefaultTokenProviders();
                }


                services.AddScoped<DbContext>(resolver => resolver.GetService<TDbContext>());
                services.AddGenericRepository();

                postDbWorkHook?.Invoke(services, svcProvider);

                services.AddRestClientCore();

                services.AddAutoMapperCore(config.LoadFullAssemblies());

                services.AddMediatRCore(config.LoadFullAssemblies());


                services.AddCleanArch();

                services.AddCacheCore();

                services.AddApiVersionCore(config);

                services.AddMvcCore(config);

                services.AddDetailExceptionCore();
                services.AddJwtAuth(config, env);

                services.AddCorsCore();

                services.AddHeaderForwardCore(env);
                services.AddResponseCompression();
                services.AddSwaggerGen(options =>
                {
                    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()
                    {
                        Name = "Authorization",
                        In = ParameterLocation.Header,
                        Type = SecuritySchemeType.Http,
                        Scheme = "Bearer"
                    });

                    options.AddSecurityRequirement(new OpenApiSecurityRequirement
                    {
                        {
                            new OpenApiSecurityScheme
                            {
                                Reference = new OpenApiReference
                                {
                                    Type = ReferenceType.SecurityScheme,
                                    Id = "Bearer"
                                }
                            },
                            Array.Empty<string>()
                        }
                    });
                });
            }

            return services;
        }
    }
}
