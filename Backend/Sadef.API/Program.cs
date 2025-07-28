using System.Globalization;
using AutoMapper;
using FluentValidation;
using Microsoft.AspNetCore.Localization;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Localization;
using Quartz;
using Sadef.Application.Abstractions.Interfaces;
using Sadef.Application.DTOs.BlogDtos;
using Sadef.Application.DTOs.LeadDtos;
using Sadef.Application.DTOs.MaintenanceRequestDtos;
using Sadef.Application.DTOs.PropertyDtos;
using Sadef.Application.DTOs.UserDtos;
using Sadef.Application.Services.AuditLog;
using Sadef.Application.Services.Blogs;
using Sadef.Application.Services.Email;
using Sadef.Application.Services.Favorites;
using Sadef.Application.Services.Lead;
using Sadef.Application.Services.MaintenanceRequest;
using Sadef.Application.Services.PropertyListing;
using Sadef.Application.Services.User;
using Sadef.Application.Services.Whatsapp;
using Sadef.Common.Domain;
using Sadef.Common.EFCore.Middleware;
using Sadef.Common.Infrastructure.EfCore.Db;
using Sadef.Common.RestTemplate;
using Sadef.Common.RestTemplate.Db;
using Sadef.Infrastructure.DBContext;
var builder = WebApplication.CreateBuilder(args);

// Add localization services
builder.Services.AddLocalization(options => options.ResourcesPath = "Resources");

// Configure supported cultures
var supportedCultures = new[] { "en", "ar" };
builder.Services.Configure<RequestLocalizationOptions>(options =>
{
    options.DefaultRequestCulture = new RequestCulture("en");
    options.SupportedCultures = supportedCultures.Select(c => new CultureInfo(c)).ToList();
    options.SupportedUICultures = supportedCultures.Select(c => new CultureInfo(c)).ToList();
    options.FallBackToParentCultures = true;
    options.FallBackToParentUICultures = true;
    // Accept-Language header provider
    options.RequestCultureProviders = new[]
    {
        new AcceptLanguageHeaderRequestCultureProvider()
    };
});

builder.Services.AddCustomTemplate<SadefDbContext>(
               svc =>
               {
                   svc.AddScoped<AuditInterceptor>();
                   svc.Replace(ServiceDescriptor.Scoped<IDbConnStringFactory, SqlServerDbConnStringFactory>());
                   svc.Replace(ServiceDescriptor.Scoped<IExtendDbContextOptionsBuilder, DbContextOptionsBuilderFactory>());
                   svc.AddTransient<IEmailService>(provider =>
                   {
                       var config = provider.GetRequiredService<IConfiguration>();
                       var localizerFactory = provider.GetRequiredService<IStringLocalizerFactory>();
                       return new EmailService(config, localizerFactory);
                   });
                   svc.AddScoped<IUserManagementService, UserManagementService>();
                   // User validators
                   svc.AddScoped<IValidator<RegisterUserWithEmailDto>, UserRegisterValidator>();
                   svc.AddScoped<IValidator<LoginUserDto>, UserLoginValidator>();
                   svc.AddScoped<IValidator<ResetPasswordDto>, ResetPasswordValidator>();
                   svc.AddScoped<IValidator<ForgotPasswordDto>, ForgotPasswordValidator>();
                   svc.AddScoped<IValidator<UpdateUserDto>, UpdateUserValidator>();
                   svc.AddScoped<IValidator<UpdateUserPasswordDto>, UpdateUserPasswordValidator>();
                   svc.AddScoped<IValidator<RefreshTokenDto>, RefreshTokenValidator>();

                   // Property validators
                   svc.AddScoped<IValidator<CreatePropertyDto>>(provider =>
                   {
                       var factory = provider.GetRequiredService<IStringLocalizerFactory>();
                       var localizer = factory.Create("Validation", "Sadef.Application");
                       return new CreatePropertyValidator(localizer);
                   });
                   svc.AddScoped<IValidator<UpdatePropertyDto>>(provider =>
                   {
                       var factory = provider.GetRequiredService<IStringLocalizerFactory>();
                       var localizer = factory.Create("Validation", "Sadef.Application");
                       return new UpdatePropertyValidator(localizer);
                   });
                   svc.AddScoped<IValidator<PropertyExpiryUpdateDto>, PropertyExpiryUpdateValidator>();

                   //// Lead validators
                   svc.AddScoped<IValidator<CreateLeadDto>>(provider =>
                   {
                       var factory = provider.GetRequiredService<IStringLocalizerFactory>();
                       var localizer = factory.Create("Validation", "Sadef.Application");
                       return new CreateLeadValidator(localizer);
                   });
                   svc.AddScoped<IValidator<UpdateLeadDto>>(provider =>
                   {
                       var factory = provider.GetRequiredService<IStringLocalizerFactory>();
                       var localizer = factory.Create("Validation", "Sadef.Application");
                       return new UpdateLeadValidator(localizer);
                   });

                   //// Maintenance request validators
                   svc.AddScoped<IValidator<CreateMaintenanceRequestDto>, CreateMaintenanceRequestValidator>();
                   svc.AddScoped<IValidator<UpdateMaintenanceRequestDto>, UpdateMaintenanceRequestStatusValidator>();
                   svc.AddScoped<IValidator<CreateBlogDto>>(provider =>
                   {
                       var factory = provider.GetRequiredService<IStringLocalizerFactory>();
                       var localizer = factory.Create("Validation", typeof(CreateBlogValidator).Assembly.GetName().Name);
                       return new CreateBlogValidator(localizer);
                   });
                   svc.AddScoped<IValidator<UpdateBlogDto>>(provider =>
                   {
                       var factory = provider.GetRequiredService<IStringLocalizerFactory>();
                       var localizer = factory.Create("Validation", typeof(UpdateBlogValidator).Assembly.GetName().Name);
                       return new UpdateBlogValidator(localizer);
                   });
                   svc.AddScoped<IPropertyService>(provider =>
                   {
                       var uow = provider.GetRequiredService<IUnitOfWorkAsync>();
                       var mapper = provider.GetRequiredService<IMapper>();
                       var queryFactory = provider.GetRequiredService<IQueryRepositoryFactory>();
                       var updateValidator = provider.GetRequiredService<IValidator<UpdatePropertyDto>>();
                       var createValidator = provider.GetRequiredService<IValidator<CreatePropertyDto>>();
                       var cache = provider.GetRequiredService<IDistributedCache>();
                       var expireValidator = provider.GetRequiredService<IValidator<PropertyExpiryUpdateDto>>();
                       var localizerFactory = provider.GetRequiredService<IStringLocalizerFactory>();
                       return new PropertyService(uow, mapper, queryFactory, updateValidator, createValidator, cache, expireValidator, localizerFactory);
                   });
                   svc.AddScoped<IBlogService>(provider =>
                   {
                       var uow = provider.GetRequiredService<IUnitOfWorkAsync>();
                       var queryFactory = provider.GetRequiredService<IQueryRepositoryFactory>();
                       var mapper = provider.GetRequiredService<IMapper>();
                       var createValidator = provider.GetRequiredService<IValidator<CreateBlogDto>>();
                       var updateValidator = provider.GetRequiredService<IValidator<UpdateBlogDto>>();
                       var localizerFactory = provider.GetRequiredService<IStringLocalizerFactory>();
                       return new BlogService(uow, queryFactory, mapper, createValidator, updateValidator, localizerFactory);
                   });
                   svc.AddScoped<IFavoriteService, FavoriteService>();
                   svc.AddScoped<ILeadService>(provider =>
                   {
                       var uow = provider.GetRequiredService<IUnitOfWorkAsync>();
                       var mapper = provider.GetRequiredService<IMapper>();
                       var createValidator = provider.GetRequiredService<IValidator<CreateLeadDto>>();
                       var queryFactory = provider.GetRequiredService<IQueryRepositoryFactory>();
                       var updateValidator = provider.GetRequiredService<IValidator<UpdateLeadDto>>();
                       var cache = provider.GetRequiredService<IDistributedCache>();
                       var localizerFactory = provider.GetRequiredService<IStringLocalizerFactory>();
                       return new LeadService(uow, mapper, createValidator, queryFactory, updateValidator, cache, localizerFactory);
                   });
                   svc.AddScoped<IMaintenanceRequestService, MaintenanceRequestService>();
                   svc.AddScoped<IAuditLogService, AuditLogService>();
                   svc.AddCors(options =>
                   {
                       options.AddPolicy("AllowFrontend", policy =>
                       {
                           policy.WithOrigins("http://localhost:5173", "https://highly-welcomed-gecko.ngrok-free.app", "https://rsof-dev.com", "https://lemon.rsof-dev.com", "https://lemon-rsoffed1-rsofs-projects.vercel.app", "https://lemon-tawny.vercel.app", "https://lemon-rsofs-projects.vercel.app", "https://lemon-pharmacy.vercel.app", "https://stellular-marigold-36ab45.netlify.app", "https://insync-rsof.web.app", "https://lucid-motors-poc.vercel.app")
                                 .AllowAnyHeader()
                                 .AllowAnyMethod()
                                 .AllowCredentials();
                       });
                   });
                   svc.AddHttpClient<IWhatsappService, WhatsappService>();
                   builder.Services.AddSingleton(provider =>
                   {
                       var schedulerFactory = provider.GetRequiredService<Quartz.ISchedulerFactory>();
                       return schedulerFactory.GetScheduler().GetAwaiter().GetResult();
                   });
                   builder.Services.AddQuartz(q =>
                   {
                       q.UseMicrosoftDependencyInjectionJobFactory();
                   });
                   builder.Services.AddQuartzHostedService(q => q.WaitForJobsToComplete = true);

               }

           );

var app = builder.Build();

// Use localization middleware
var locOptions = app.Services.GetService<Microsoft.Extensions.Options.IOptions<RequestLocalizationOptions>>()?.Value;
if (locOptions != null)
{
    app.UseRequestLocalization(locOptions);
}
app.UseCors("AllowFrontend");
app.UseCustomTemplate();
app.Run();
