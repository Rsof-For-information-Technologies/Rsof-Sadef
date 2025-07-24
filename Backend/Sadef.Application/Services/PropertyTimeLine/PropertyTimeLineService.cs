using AutoMapper;
using Sadef.Common.Domain;
using Sadef.Application.DTOs.OrderTimeLineDtos;
using Sadef.Common.Infrastructure.Wrappers;
using Sadef.Application.Abstractions.Interfaces;


namespace Sadef.Application.Services.PropertyTimeLine
{
    public class PropertyTimeLineService : IPropertyTimeLineService
    {
        private readonly IUnitOfWorkAsync _uow;
        private readonly IMapper _mapper;
        private readonly IQueryRepositoryFactory _queryRepositoryFactory;

        public PropertyTimeLineService(IUnitOfWorkAsync uow, IMapper mapper, IQueryRepositoryFactory queryRepositoryFactory)
        {
            _uow = uow;
            _mapper = mapper;
            _queryRepositoryFactory = queryRepositoryFactory;
        }

        public async Task<Response<PropertyTimeLineLogDto>> AddPropertyTimeLineLogAsync(CreatePropertyTimeLineLogDto dto)
        {
            var result = new Response<PropertyTimeLineLogDto>();
            return await Task.FromResult(result);
        }
    }
}
