using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.Extensions.Logging;
using static Sadef.Common.Utils.Helpers.IdHelper;

namespace Sadef.Common.Infrastructure.AspNetCore.Middlewares
{
    public class LogHandlerMiddleware
    {
        private readonly ILogger<LogHandlerMiddleware> _logger;
        private readonly RequestDelegate _next;

        public LogHandlerMiddleware(ILoggerFactory loggerFactory, RequestDelegate next)
        {
            _logger = loggerFactory.CreateLogger<LogHandlerMiddleware>();
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            context.Items["CorrelationId"] = GenerateId();
            _logger.LogInformation(
                $"About to start {context.Request?.Method} {context.Request?.GetDisplayUrl()} request");

            await _next(context);

            _logger.LogInformation($"Request completed with status code: {context.Response?.StatusCode} ");
        }
    }
}
