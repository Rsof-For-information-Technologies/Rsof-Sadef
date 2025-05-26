using Sadef.Common.Infrastructure.Validator;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;

namespace Sadef.Common.Infrastructure.AspNetCore.Validation
{
    /// <inheritdoc />
    /// <summary>
    ///     Reference at
    ///     https://www.strathweb.com/2018/07/centralized-exception-handling-and-request-validation-in-asp-net-core
    /// </summary>
    public class ValidationProblemDetailsResult : IActionResult
    {
        public Task ExecuteResultAsync(ActionContext context)
        {
            var modelStateEntries = context.ModelState.Where(e => e.Value.Errors.Count > 0).ToArray();
            var errors = new List<ValidationError>();

            var details = "See ValidationErrors for details";

            if (modelStateEntries.Any())
            {
                if (modelStateEntries.Length == 1
                    && modelStateEntries[0].Value.Errors.Count == 1
                    && modelStateEntries[0].Key == string.Empty)
                    details = modelStateEntries[0].Value.Errors[0].ErrorMessage;
                else
                    foreach (var modelStateEntry in modelStateEntries)
                        foreach (var modelStateError in modelStateEntry.Value.Errors)
                        {

                            var error = new ValidationError(modelStateEntry.Key, modelStateError.ErrorMessage);
                            errors.Add(error);
                        }
            }

            //var problemDetails = new ValidationProblemDetails
            //{
            //    Status = 400,
            //    Title = "Request Validation Error",
            //    Instance = $"urn:myorganization:badrequest:{GenerateId()}",
            //    Detail = details,
            //    ValidationErrors = errors
            //};
            var problemDetails = new ValidationResultModel(errors);
            //context.HttpContext.Response.WriteJson(problemDetails);
            //throw new ValidationException(problemDetails);
            context.HttpContext.Response.StatusCode = 400;
            context.HttpContext.Response.ContentType = "application/json";
            return context.HttpContext.Response.WriteAsJsonAsync(problemDetails);
            //return Task.CompletedTask;
        }
    }
}
