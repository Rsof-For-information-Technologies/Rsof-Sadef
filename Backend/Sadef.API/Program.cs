using Microsoft.Extensions.DependencyInjection.Extensions;
using Sadef.Application.Abstractions.Interfaces;
using Sadef.Application.Services.Blogs;
using Sadef.Application.Services.Email;
using Sadef.Application.Services.Favorites;
using Sadef.Application.Services.Lead;
using Sadef.Application.Services.MaintenanceRequest;
using Sadef.Application.Services.PropertyListing;
using Sadef.Application.Services.User;
using Sadef.Application.Services.Notification;
using Sadef.Common.EFCore.Middleware;
using Sadef.Common.Infrastructure.EfCore.Db;
using Sadef.Common.Infrastructure.Validator;
using Sadef.Common.RestTemplate;
using Sadef.Common.RestTemplate.Db;
using Sadef.Infrastructure.DBContext;
using Sadef.Application.Hubs;

var builder = WebApplication.CreateBuilder(args);

// CORS policy to allow local frontend access with credentials
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalFrontend", policy =>
    {
        policy.WithOrigins(
            "http://localhost:5500",
            "http://127.0.0.1:5500"
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

builder.Services.AddCustomTemplate<SadefDbContext>(
    svc =>
    {
        svc.AddScoped<AuditInterceptor>();
        svc.Replace(ServiceDescriptor.Scoped<IDbConnStringFactory, SqlServerDbConnStringFactory>());
        svc.Replace(ServiceDescriptor.Scoped<IExtendDbContextOptionsBuilder, DbContextOptionsBuilderFactory>());
        svc.AddTransient<IEmailService, EmailService>();
        svc.AddScoped<IUserManagementService, UserManagementService>();
        svc.AddScoped<INotificationService, NotificationService>();
        svc.AddCustomValidators<UserRegisterValidator>();
        svc.AddScoped<IPropertyService, PropertyService>();
        svc.AddScoped<IBlogService, BlogService>();
        svc.AddScoped<IFavoriteService, FavoriteService>();
        svc.AddScoped<ILeadService, LeadService>();
        svc.AddScoped<IMaintenanceRequestService, MaintenanceRequestService>();
    }
);

// Add SignalR
builder.Services.AddSignalR();

var app = builder.Build();

// Apply CORS before SignalR hub mapping
app.UseCors("AllowLocalFrontend");
app.UseCustomTemplate();
app.MapHub<NotificationHub>("/notification-hub").RequireCors("AllowLocalFrontend");
app.Run();
