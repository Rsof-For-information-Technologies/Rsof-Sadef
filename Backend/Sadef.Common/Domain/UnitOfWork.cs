namespace Sadef.Common.Domain
{

    public interface IUnitOfWorkAsync : IRepositoryFactoryAsync, IDisposable
    {
        int SaveChanges();
        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    }

    public interface IRepositoryFactoryAsync
    {
        IRepositoryWithIdAsync<TEntity, TId> RepositoryAsync<TEntity, TId>() where TEntity : class, IAggregateRootWithId<TId>;
        IRepositoryAsync<TEntity> RepositoryAsync<TEntity>() where TEntity : class, IAggregateRoot;
    }

    public interface IRepositoryAsync<TEntity> : IRepositoryWithIdAsync<TEntity, int> where TEntity : IAggregateRoot
    {
    }

    public interface IRepositoryWithIdAsync<TEntity, TId> where TEntity : IAggregateRootWithId<TId>
    {
        Task<TEntity> AddAsync(TEntity entity);
        Task<List<TEntity>> AddAsync(List<TEntity> entity);
        Task<List<TEntity>> UpdateAsync(List<TEntity> entity);
        Task<TEntity> UpdateAsync(TEntity entity, List<string> includeProperties);
        Task<TEntity> UpdateAsync(TEntity entity);
        Task<TEntity> DeleteAsync(TEntity entity);
        Task<List<TEntity>> DeleteAsync(List<TEntity> entity);
    }
}
