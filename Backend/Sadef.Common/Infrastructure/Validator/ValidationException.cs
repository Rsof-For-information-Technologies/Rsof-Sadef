using System;
using System.Runtime.Serialization;
using Sadef.Common.Domain;

namespace Sadef.Common.Infrastructure.Validator
{
    [Serializable]
    public class ValidationException : CoreException
    {
        public ValidationException(ValidationResultModel validationResultModel)
        {
            ValidationResultModel = validationResultModel;
        }

        public ValidationResultModel ValidationResultModel { get; }

        protected ValidationException(SerializationInfo info, StreamingContext context)
           : base(info, context)
        {
        }
    }
}