using System.Text.Json;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Sadef.Common.Infrastructure.Validator
{
    public class RequestValidationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
        where TRequest : IRequest<TResponse>
    {
        private readonly IValidator<TRequest> _validator;
        private readonly ILogger<RequestValidationBehavior<TRequest, TResponse>> _logger;

        public RequestValidationBehavior(IServiceProvider serviceProvider,
            ILogger<RequestValidationBehavior<TRequest, TResponse>> logger)
        {
            _validator = (IValidator<TRequest>)serviceProvider.GetService(typeof(IValidator<TRequest>));  //_validator = validator ?? throw new ArgumentNullException(nameof(validator));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<TResponse> Handle(TRequest request,
            RequestHandlerDelegate<TResponse> next,
            CancellationToken cancellationToken)
        {
            if (_validator != null)
            {
                _logger.LogInformation($"Handling {typeof(TRequest).FullName}");
                _logger.LogDebug($"Handling {typeof(TRequest).FullName} with content {JsonSerializer.Serialize(request)}");
                await _validator.HandleValidation(request);
                var response = await next();
                _logger.LogInformation($"Handled {typeof(TRequest).FullName}");
                return response;
            }
            _logger.LogInformation($"Validator not found for : {typeof(TRequest).FullName}");
            return await next();
        }
    }
}