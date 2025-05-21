using System;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Sadef.Common.Domain;
using Newtonsoft.Json;
using FluentValidation;

namespace Sadef.Common.Infrastructure.AspNetCore.Middlewares
{
    public class ErrorHandlerMiddleware
    {
        private readonly RequestDelegate _next;

        public ErrorHandlerMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (System.Exception exception)
            {
                await HandleErrorAsync(context, exception);
            }
        }

        private static Task HandleErrorAsync(HttpContext context, System.Exception exception)
        {
            const string errorCode = "error";
            const HttpStatusCode statusCode = HttpStatusCode.BadRequest;
            var message = exception.Message;
            switch (exception)
            {
                case DbUpdateException e:
                    message = e.InnerException?.Message;
                    break;
                case DomainException e:
                    break;
            }

            string payload = string.Empty;

            if (exception is Validator.ValidationException)
            {
                var validationException = exception as Validator.ValidationException;
                
                var response = new
                {
                    errors = validationException.ValidationResultModel?.Errors,
                    errorCode = validationException.ValidationResultModel?.ErrorCode.ToString(),
                    message = validationException.ValidationResultModel?.Message
                };
                payload = JsonConvert.SerializeObject(response);

            }
            else
            {
                var response = new
                {
                    errorCode,
                    message
                };

                payload = JsonConvert.SerializeObject(response);
            }
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)statusCode;

            return context.Response.WriteAsync(payload);
        }
    }
}
