namespace Sadef.Common.Domain
{
    public interface IAggregateRoot : IAggregateRootWithId<int>
    {
    }
    public interface IAggregateRootWithId<TId> : IEntityWithId<TId>
    {

    }

    // integer identity based columns have been chose as default. Projects requiring Guid as the default idetity need a change here with default guid generation
    public abstract class AggregateRootBase : EntityWithIdBase<int>, IAggregateRoot
    {
        protected AggregateRootBase()
        {
        }
    }

}
