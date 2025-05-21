namespace Sadef.Common.Domain
{
    public interface IQueryRepositoryFactory
    {
        IQueryRepositoryWithId<TEntity, TId> QueryRepository<TEntity, TId>() where TEntity : class, IAggregateRootWithId<TId>;
        IQueryRepository<TEntity> QueryRepository<TEntity>() where TEntity : class, IAggregateRoot;
    }

    public interface IQueryRepository<TEntity> : IQueryRepositoryWithId<TEntity, int> where TEntity : IAggregateRoot
    {
    }

    public interface IQueryRepositoryWithId<TEntity, TId> where TEntity : IAggregateRootWithId<TId>
    {
        IQueryable<TEntity> Queryable();
        //System.Threading.Tasks.Task<List<TResponse>> ExecuteProcedureAsync<TResponse>(string query,  object parms);
        //System.Threading.Tasks.Task<List<TResponse>> ExecuteProcedureAsync<TResponse>(string conStr, string query, object parms);

    }
}

