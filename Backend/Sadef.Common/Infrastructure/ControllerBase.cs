using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sadef.Common.Domain;
using Sadef.Common.Infrastructure.EfCore.Extensions;

namespace Sadef.Common.Infrastructure.AspNetCore
{
    [ApiController]
    public abstract class EvtControllerBase : Controller
    {
    }

    [ApiController]
    public abstract class EfCoreControllerBase<TEntity> : Controller
        where TEntity : AggregateRootBase
    {
        protected readonly IRepositoryAsync<TEntity> MutateRepository;
        protected readonly IQueryRepository<TEntity> QueryRepository;

        protected EfCoreControllerBase(IQueryRepository<TEntity> queryRepository, IRepositoryAsync<TEntity> mutateRepository)
        {
            QueryRepository = queryRepository;
            MutateRepository = mutateRepository;
        }
    }

    /// <summary>
    ///     https://github.com/FabianGosebrink/ASPNETCore-WebAPI-Sample/blob/master/SampleWebApiAspNetCore/Controllers/v1/FoodsController.cs
    /// </summary>
    /// <typeparam name="TEntity"></typeparam>
    [ApiController]
    public abstract class CrudControllerBase<TEntity> : EfCoreControllerBase<TEntity>
        where TEntity : AggregateRootBase
    {
        protected CrudControllerBase(IQueryRepository<TEntity> queryRepository, IRepositoryAsync<TEntity> mutateRepository)
            : base(queryRepository, mutateRepository)
        {
        }

        [HttpGet(Name = nameof(GetAllItems))]
        public async Task<ActionResult<PaginatedItem<TEntity>>> GetAllItems([FromQuery] Criterion criterion)
        {
            criterion = criterion ?? new Criterion();
            return await QueryRepository.QueryAsync<DbContext, TEntity, int, TEntity>(criterion, entity => entity);
        }

        [HttpGet("{id}", Name = nameof(GetItem))]
        public async Task<ActionResult<TEntity>> GetItem(int id)
        {
            return await QueryRepository.GetByIdAsync<DbContext, TEntity, int>(id);
        }

        [HttpPost(Name = nameof(PostItem))]
        public async Task<TEntity> PostItem(TEntity entity)
        {
            return await MutateRepository.AddAsync(entity);
        }

        [HttpPut("{id}", Name = nameof(PutItem))]
        public async Task<TEntity> PutItem(int id, TEntity entity)
        {
            return await MutateRepository.UpdateAsync(entity);
        }

        [HttpDelete("{id}", Name = nameof(DeleteItem))]
        public async Task<TEntity> DeleteItem(int id)
        {
            return await MutateRepository.DeleteAsync(await QueryRepository.GetByIdAsync<DbContext, TEntity, int>(id));
        }
    }
}
