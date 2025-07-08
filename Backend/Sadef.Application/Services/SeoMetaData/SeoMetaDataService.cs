using AutoMapper;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Sadef.Application.Abstractions.Interfaces;
using Sadef.Application.DTOs.SeoMetaDtos;
using Sadef.Common.Domain;
using Sadef.Common.Infrastructure.Validator;
using Sadef.Common.Infrastructure.Wrappers;

namespace Sadef.Application.Services.SeoMetaData
{
    public class SeoMetaDataService : ISeoMetaDataService
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWorkAsync _uow;
        private readonly IQueryRepositoryFactory _queryRepositoryFactory;
        private readonly IValidator<CreateSeoMetaDataDto> _createValidator;

        public SeoMetaDataService(IUnitOfWorkAsync uow, IMapper mapper, IQueryRepositoryFactory queryRepositoryFactory, IValidator<CreateSeoMetaDataDto> createValidator)
        {
            _uow = uow;
            _mapper = mapper;
            _queryRepositoryFactory = queryRepositoryFactory;
            _createValidator = createValidator;
        }

        public async Task<Response<SeoMetaDataDto>> CreateSeoMetaAsync<T>(int entityId, CreateSeoMetaDetailsDto meta)
        {

            var dto = new CreateSeoMetaDataDto
            {
                EntityId = entityId,
                EntityType = typeof(T).Name,
                Slug = meta.Slug,
                MetaTitle = meta.MetaTitle,
                MetaDescription = meta.MetaDescription,
                MetaKeywords = meta.MetaKeywords,
                CanonicalUrl = meta.CanonicalUrl
            };

            var validation = await _createValidator.ValidateAsync(dto);
            if (!validation.IsValid)
            {
                var errorMessage = validation.Errors.First().ErrorMessage;

                return new Response<SeoMetaDataDto>
                {
                    Succeeded = false,
                    Message = errorMessage,
                    ValidationResultModel = new ValidationResultModel(validation)
                };
            }

            var entity = _mapper.Map<Domain.SeoMetaEntity.SeoMetaData>(dto);
            entity.CreatedAt = DateTime.UtcNow;

            await _uow.RepositoryAsync<Domain.SeoMetaEntity.SeoMetaData>().AddAsync(entity);
            await _uow.SaveChangesAsync(CancellationToken.None);

            var responseDto = _mapper.Map<SeoMetaDataDto>(entity);
            return new Response<SeoMetaDataDto>(responseDto, "SEO metadata created successfully.");
        }

        public async Task<Response<SeoMetaDataDto>> GetByEntityAsync(int entityId, string entityType)
        {
            var repo = _queryRepositoryFactory.QueryRepository<Domain.SeoMetaEntity.SeoMetaData>();
            var entity = await repo.Queryable()
                .FirstOrDefaultAsync(m => m.EntityId == entityId && m.EntityType == entityType);

            if (entity == null)
                return new Response<SeoMetaDataDto>("SEO metadata not found");

            return new Response<SeoMetaDataDto>(_mapper.Map<SeoMetaDataDto>(entity));
        }

        public async Task<Response<bool>> DeleteByEntityAsync(int entityId, string entityType)
        {
            var repo = _uow.RepositoryAsync<Domain.SeoMetaEntity.SeoMetaData>();
            var entity = await _queryRepositoryFactory
                .QueryRepository<Domain.SeoMetaEntity.SeoMetaData>()
                .Queryable()
                .FirstOrDefaultAsync(m => m.EntityId == entityId && m.EntityType == entityType);

            if (entity == null)
                return new Response<bool>(false, "No SEO metadata found for deletion.");

            await repo.DeleteAsync(entity);
            await _uow.SaveChangesAsync(CancellationToken.None);

            return new Response<bool>(true, "SEO metadata deleted successfully.");
        }

        public async Task<Response<SeoMetaDataDto>> UpdateSeoMetaAsync<T>(int entityId, CreateSeoMetaDetailsDto meta)
        {
            var entityType = typeof(T).Name;

            var repo = _uow.RepositoryAsync<Domain.SeoMetaEntity.SeoMetaData>();
            var existing = await _queryRepositoryFactory
                .QueryRepository<Domain.SeoMetaEntity.SeoMetaData>()
                .Queryable()
                .FirstOrDefaultAsync(m => m.EntityId == entityId && m.EntityType == entityType);

            if (existing == null)
            {
                // If not found, treat it as create
                return await CreateSeoMetaAsync<T>(entityId, meta);
            }

            // Update fields
            existing.Slug = meta.Slug;
            existing.MetaTitle = meta.MetaTitle;
            existing.MetaDescription = meta.MetaDescription;
            existing.MetaKeywords = meta.MetaKeywords;
            existing.CanonicalUrl = meta.CanonicalUrl;
            existing.UpdatedAt = DateTime.UtcNow;

            await repo.UpdateAsync(existing);
            await _uow.SaveChangesAsync(CancellationToken.None);

            var updatedDto = _mapper.Map<SeoMetaDataDto>(existing);
            return new Response<SeoMetaDataDto>(updatedDto, "SEO metadata updated successfully.");
        }


    }
}
