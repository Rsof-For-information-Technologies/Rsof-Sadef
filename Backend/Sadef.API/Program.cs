using Microsoft.Extensions.DependencyInjection.Extensions;
using Sadef.Application.Abstractions.Interfaces;
using Sadef.Application.Services.Email;
using Sadef.Application.Services.PropertyListing;
using Sadef.Application.Services.User;
using Sadef.Common.EFCore.Middleware;
using Sadef.Common.Infrastructure.EfCore.Db;
using Sadef.Common.Infrastructure.Validator;
using Sadef.Common.RestTemplate;
using Sadef.Common.RestTemplate.Db;
using Sadef.Infrastructure.DBContext;

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
                   svc.AddScoped<IPropertyService , PropertyService>();
               }
           );

var app = builder.Build();
app.UseCustomTemplate();
app.Run();
