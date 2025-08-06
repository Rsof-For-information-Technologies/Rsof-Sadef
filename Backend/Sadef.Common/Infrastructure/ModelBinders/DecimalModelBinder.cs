using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.Globalization;

namespace Sadef.Common.Infrastructure.ModelBinders
{
    public class DecimalModelBinder : IModelBinder
    {
        public Task BindModelAsync(ModelBindingContext bindingContext)
        {
            if (bindingContext == null)
                throw new ArgumentNullException(nameof(bindingContext));

            var valueProviderResult = bindingContext.ValueProvider.GetValue(bindingContext.ModelName);
            if (valueProviderResult == ValueProviderResult.None)
                return Task.CompletedTask;

            bindingContext.ModelState.SetModelValue(bindingContext.ModelName, valueProviderResult);
            var value = valueProviderResult.FirstValue;

            if (string.IsNullOrEmpty(value))
                return Task.CompletedTask;

            // Try to parse as decimal
            if (decimal.TryParse(value, NumberStyles.Any, CultureInfo.InvariantCulture, out decimal decimalValue))
            {
                bindingContext.Result = ModelBindingResult.Success(decimalValue);
                return Task.CompletedTask;
            }

            // Try to parse as double for double properties
            if (bindingContext.ModelType == typeof(double) || bindingContext.ModelType == typeof(double?))
            {
                if (double.TryParse(value, NumberStyles.Any, CultureInfo.InvariantCulture, out double doubleValue))
                {
                    bindingContext.Result = ModelBindingResult.Success(doubleValue);
                    return Task.CompletedTask;
                }
            }

            // If parsing fails, add an error
            bindingContext.ModelState.TryAddModelError(bindingContext.ModelName, 
                $"The value '{value}' is not valid for {bindingContext.ModelName}.");

            return Task.CompletedTask;
        }
    }

    public class DoubleModelBinder : IModelBinder
    {
        public Task BindModelAsync(ModelBindingContext bindingContext)
        {
            if (bindingContext == null)
                throw new ArgumentNullException(nameof(bindingContext));

            var valueProviderResult = bindingContext.ValueProvider.GetValue(bindingContext.ModelName);
            if (valueProviderResult == ValueProviderResult.None)
                return Task.CompletedTask;

            bindingContext.ModelState.SetModelValue(bindingContext.ModelName, valueProviderResult);
            var value = valueProviderResult.FirstValue;

            if (string.IsNullOrEmpty(value))
                return Task.CompletedTask;

            // Try to parse as double
            if (double.TryParse(value, NumberStyles.Any, CultureInfo.InvariantCulture, out double doubleValue))
            {
                bindingContext.Result = ModelBindingResult.Success(doubleValue);
                return Task.CompletedTask;
            }

            // If parsing fails, add an error
            bindingContext.ModelState.TryAddModelError(bindingContext.ModelName, 
                $"The value '{value}' is not valid for {bindingContext.ModelName}.");

            return Task.CompletedTask;
        }
    }
} 