using System.Collections.Generic;
using Sadef.Common.Infrastructure.Validator;
using Microsoft.AspNetCore.Mvc;

namespace Sadef.Common.Infrastructure.AspNetCore.Validation
{
    public class ValidationProblemDetails : ProblemDetails
    {
        public ICollection<ValidationError> ValidationErrors { get; set; }
    }
}
