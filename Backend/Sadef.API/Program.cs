using Microsoft.Extensions.DependencyInjection.Extensions;
using Quartz;
using Sadef.Application.Abstractions.Interfaces;
using Sadef.Application.Services.AuditLog;
using Sadef.Application.Services.Blogs;
using Sadef.Application.Services.Email;
using Sadef.Application.Services.Favorites;
using Sadef.Application.Services.Lead;
using Sadef.Application.Services.MaintenanceRequest;
using Sadef.Application.Services.PropertyListing;
using Sadef.Application.Services.User;
using Sadef.Application.Services.Whatsapp;
using Sadef.Common.EFCore.Middleware;
using Sadef.Common.Infrastructure.EfCore.Db;
using Sadef.Common.Infrastructure.Validator;
using Sadef.Common.RestTemplate;
using Sadef.Common.RestTemplate.Db;
using Sadef.Infrastructure.DBContext;
using Quartz;
using Quartz.Impl;
using Quartz.Spi;
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCustomTemplate<SadefDbContext>(
               svc =>
               {
                   svc.AddScoped<AuditInterceptor>();
                   svc.Replace(ServiceDescriptor.Scoped<IDbConnStringFactory, SqlServerDbConnStringFactory>());
                   svc.Replace(ServiceDescriptor.Scoped<IExtendDbContextOptionsBuilder, DbContextOptionsBuilderFactory>());
                   svc.AddTransient<IEmailService, EmailService>();
                   svc.AddScoped<IUserManagementService, UserManagementService>();
                   svc.AddCustomValidators<UserRegisterValidator>();
                   svc.AddScoped<IPropertyService, PropertyService>();
                   svc.AddScoped<IBlogService, BlogService>();
                   svc.AddScoped<IFavoriteService, FavoriteService>();
                   svc.AddScoped<ILeadService, LeadService>();
                   svc.AddScoped<IMaintenanceRequestService, MaintenanceRequestService>();
                   svc.AddScoped<IAuditLogService, AuditLogService>();
                   svc.AddCors(options =>
                   {
                       options.AddPolicy("AllowFrontend", policy =>
                       {
                           policy.WithOrigins("http://localhost:5173", "https://highly-welcomed-gecko.ngrok-free.app", "https://rsof-dev.com", "https://lemon.rsof-dev.com", "https://lemon-rsoffed1-rsofs-projects.vercel.app", "https://lemon-tawny.vercel.app", "https://lemon-rsofs-projects.vercel.app", "https://lemon-pharmacy.vercel.app", "https://stellular-marigold-36ab45.netlify.app", "https://insync-rsof.web.app" , "https://lucid-motors-poc.vercel.app")
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
app.UseCors("AllowFrontend");
app.UseCustomTemplate();
app.Run();
