using Asp.Versioning;
using MediatR;
using Sadef.Common.Infrastructure.AspNetCore.Configuration;
using Sadef.Common.Infrastructure.AspNetCore.Validation;
using Sadef.Common.Infrastructure.Auth;
using Sadef.Common.Infrastructure.Logging;
using Sadef.Common.Infrastructure.Validator;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Reflection;
using System.Text;

namespace Sadef.Common.Infrastructure.AspNetCore.All
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddAutoMapperCore(this IServiceCollection services,
            IEnumerable<Assembly> registeredAssemblies)
        {
            return services.AddAutoMapper(registeredAssemblies);
        }

        public static IServiceCollection AddMediatRCore(this IServiceCollection services,
            IEnumerable<Assembly> registeredAssemblies, Action<IServiceCollection> doMoreActions = null)
        {
            //services.AddMediatR(registeredAssemblies.ToArray())
            foreach (var item in registeredAssemblies.ToArray())
            {
                services = services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(item));
            }
            services.AddScoped(typeof(IPipelineBehavior<,>), typeof(RequestValidationBehavior<,>))
                .AddScoped(typeof(IPipelineBehavior<,>), typeof(LoggingBehavior<,>));

            doMoreActions?.Invoke(services);

            return services;
        }

        public static IServiceCollection AddRestClientCore(this IServiceCollection services)
        {
            services.AddHttpContextAccessor();
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddSingleton<IActionContextAccessor, ActionContextAccessor>();
            services.AddSingleton<IUrlHelper>(fac =>
                new UrlHelper(fac.GetService<IActionContextAccessor>().ActionContext));

            return services;
        }

        public static IServiceCollection AddCacheCore(this IServiceCollection services)
        {
            services.AddMemoryCache();
            services.AddResponseCaching();

            return services;
        }

        public static IServiceCollection AddApiVersionCore(this IServiceCollection services, IConfiguration config)
        {
            services.AddRouting(o => o.LowercaseUrls = true);

            services
                .AddMvcCore()
                .AddDataAnnotations();

            services
                 .AddApiVersioning(o =>
                 {
                     o.ReportApiVersions = true;
                     o.AssumeDefaultVersionWhenUnspecified = true;
                     o.DefaultApiVersion = ApiVersion.Default;
                 }).AddApiExplorer(options =>
                 {
                     options.GroupNameFormat = "'v'VVV";
                     options.SubstituteApiVersionInUrl = true;
                 });

            return services;
        }

        public static IMvcBuilder AddMvcCore(this IServiceCollection services, IConfiguration config,
            bool withDapr = false)
        {
            services.AddControllers().AddNewtonsoftJson();
            var mvcBuilder = services.AddMvc();

            if (config.LoadFullAssemblies() != null && config.LoadFullAssemblies().Any())
                foreach (var assembly in config.LoadFullAssemblies())
                    mvcBuilder = mvcBuilder.AddApplicationPart(assembly);

            return mvcBuilder;
        }

        public static IServiceCollection AddDetailExceptionCore(this IServiceCollection services)
        {
            services.Configure<ApiBehaviorOptions>(options =>
            {
                options.InvalidModelStateResponseFactory = ctx => new ValidationProblemDetailsResult();
            });

            return services;
        }

        public static IServiceCollection AddJwtAuth(this IServiceCollection services, IConfiguration config,
          IWebHostEnvironment env)
        {
            JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            // Adding Jwt Bearer  
            .AddJwtBearer(options =>
            {
                options.SaveToken = true;
                options.RequireHttpsMetadata = false;
                options.TokenValidationParameters = new TokenValidationParameters()
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidAudience = config.GetAuthNOptions().Audience,  //config["JWT:ValidAudience"],
                    ValidIssuer = config.GetAuthNOptions().Issuer, // config["JWT:ValidIssuer"],config["JWT:Secret"]
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config.GetAuthNOptions().Secret))
                };
            });

            services.AddScoped(typeof(IPipelineBehavior<,>), typeof(AuthBehavior<,>));

            // Assembly scanning and decorator extension of Microsoft DI using Scrutor
            services.Scan(s => s
                .FromAssemblies(config.LoadApplicationAssemblies())
                .AddClasses(c => c
                    .AssignableTo<IAuthorizationHandler>()).As<IAuthorizationHandler>()
                .AddClasses(c => c
                    .AssignableTo<IAuthorizationRequirement>()).As<IAuthorizationRequirement>()
            );

            return services;
        }

        public static IServiceCollection AddCorsCore(this IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("AllRequestPolicy",
                    policy => policy
                        .AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .SetIsOriginAllowedToAllowWildcardSubdomains());
            });

            return services;
        }

        public static IServiceCollection AddHeaderForwardCore(this IServiceCollection services, IWebHostEnvironment env)
        {
            if (!env.IsDevelopment())
                services.Configure<ForwardedHeadersOptions>(options =>
                {
                    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
                });

            return services;
        }

    }
}
