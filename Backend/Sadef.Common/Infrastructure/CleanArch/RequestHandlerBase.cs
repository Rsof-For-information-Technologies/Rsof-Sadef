using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Sadef.Common.Domain;

namespace Sadef.Common.Infrastructure.AspNetCore.CleanArch
{
    public abstract class RequestHandlerBase<TRequest, TResponse> : IEventHandler<TRequest, TResponse>
        where TRequest : IRequest<TResponse>
    {
        protected RequestHandlerBase(IQueryRepositoryFactory queryRepositoryFactory)
        {
            QueryFactory = queryRepositoryFactory;
        }

        public IQueryRepositoryFactory QueryFactory { get; }

        public abstract Task<TResponse> Handle(TRequest request, CancellationToken cancellationToken);
    }
}
