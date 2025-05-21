using System.Runtime.Serialization;

namespace Sadef.Common.Domain
{
    [Serializable]
    public class CoreException : Exception
    {
        public CoreException() { }

        public CoreException(string message) : base(message) { }


        public CoreException(string message, Exception innerEx)
            : base(message, innerEx)
        {
        }

        protected CoreException(SerializationInfo info, StreamingContext context)
            : base(info, context)
        {
        }

        public static CoreException Exception(string message)
        {
            return new CoreException(message);
        }

        public static CoreException NullArgument(string arg)
        {
            return new CoreException($"{arg} cannot be null");
        }

        public static CoreException InvalidArgument(string arg)
        {
            return new CoreException($"{arg} is invalid");
        }

        public static CoreException NotFound(string arg)
        {
            return new CoreException($"{arg} was not found");
        }
    }

    [Serializable]
    public class DomainException : CoreException
    {
        public DomainException(string message)
            : base(message, null)
        {
        }

        protected DomainException(SerializationInfo info, StreamingContext context)
           : base(info, context)
        {
        }
    }

    [Serializable]
    public class ViolateSecurityException : CoreException
    {
        public ViolateSecurityException(string message)
            : base(message, null)
        {
        }

        protected ViolateSecurityException(SerializationInfo info, StreamingContext context)
           : base(info, context)
        {
        }
    }
}
