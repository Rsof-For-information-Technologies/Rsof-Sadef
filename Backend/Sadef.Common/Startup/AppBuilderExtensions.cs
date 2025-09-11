using Sadef.Common.Infrastructure.AspNetCore.All;
using Sadef.Common.Infrastructure.AspNetCore.Configuration;
using Sadef.Common.Infrastructure.AspNetCore.Middlewares;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.Reflection;


namespace Sadef.Common.RestTemplate
{
    public static class AppBuilderExtensions
    {
        public static IApplicationBuilder UseCustomTemplate(this IApplicationBuilder app)
        {
            var config = app.ApplicationServices.GetRequiredService<IConfiguration>();
            var loggerFactory = app.ApplicationServices.GetRequiredService<ILoggerFactory>();
            var env = app.ApplicationServices.GetRequiredService<IWebHostEnvironment>();

            // #1 Log exception handler
            app.UseMiddleware<LogHandlerMiddleware>();

            // #2 Default response cache
            app.UseResponseCaching();

            app.UseResponseCompression();

            // #3 configure Exception handling
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/error");
            }

            app.UseExceptionHandlerCore();
            app.UseMiddleware<ErrorHandlerMiddleware>();

          
            // #6 liveness endpoint
#pragma warning disable CS1998 // Async method lacks 'await' operators and will run synchronously
            app.Map("/liveness", lapp => lapp.Run(async ctx => ctx.Response.StatusCode = 200));
#pragma warning restore CS1998 // Async method lacks 'await' operators and will run synchronously

            // #7 Re-configure the base path
            var basePath = config.GetBasePath();
            if (!string.IsNullOrEmpty(basePath))
            {
                var logger = loggerFactory.CreateLogger("init");
                logger.LogInformation($"Using PATH BASE '{basePath}'");
                app.UsePathBase(basePath);
            }

            // #8 ForwardHeaders
            if (!env.IsDevelopment())
                app.UseForwardedHeaders();

            app.UseHttpsRedirection();

            app.UseRouting();

            // #9 Cors
            app.UseCors("AllRequestPolicy");

            // #10 AuthN
            app.UseAuthentication();
            app.UseAuthorization();
            // #11 Mvc
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            // #12 Open API

            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API v1");
               
            });

            return app;
        }
    }
}
