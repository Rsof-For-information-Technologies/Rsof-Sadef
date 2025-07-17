using Sadef.Common.Infrastructure.Wrappers;
using AutoMapper;
using Sadef.Application.Abstractions.Interfaces;
using Sadef.Application.DTOs.BlogDtos;
using Sadef.Common.Domain;
using Sadef.Domain.BlogsEntity;
using Microsoft.EntityFrameworkCore;
using Sadef.Application.DTOs.PropertyDtos;
using FluentValidation;
using Sadef.Application.DTOs.SeoMetaDtos;

namespace Sadef.Application.Services.Blogs
{
    public class BlogService : IBlogService
    {
        private readonly IUnitOfWorkAsync _uow;
        private readonly IQueryRepositoryFactory _queryFactory;
        private readonly IMapper _mapper;
        private readonly IValidator<CreateBlogDto> _createBlogValidator;
        private readonly IValidator<UpdateBlogDto> _updateBlogValidator;
        private readonly ISeoMetaDataService _seoMetaDataService;
        private readonly IValidator<CreateSeoMetaDetailsDto> _seoValidator;

        public BlogService(IUnitOfWorkAsync uow, IQueryRepositoryFactory queryFactory, IMapper mapper , IValidator<CreateBlogDto> createBlogValidator , IValidator<UpdateBlogDto> updateBlogValidator, ISeoMetaDataService seoMetaDataService, IValidator<CreateSeoMetaDetailsDto> seoValidator)
        {
            _uow = uow;
            _queryFactory = queryFactory;
            _mapper = mapper;
            _createBlogValidator = createBlogValidator;
            _updateBlogValidator = updateBlogValidator;
            _seoMetaDataService = seoMetaDataService;
            _seoValidator = seoValidator;
        }
        public async Task<Response<PaginatedResponse<BlogDto>>> GetPaginatedAsync(int pageNumber, int pageSize)
        {
            var repo = _queryFactory.QueryRepository<Blog>();
            var query = repo.Queryable().OrderByDescending(b => b.PublishedAt);

            var total = await query.CountAsync();
            var items = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
            var dtoList = _mapper.Map<List<BlogDto>>(items);

            var paged = new PaginatedResponse<BlogDto>(dtoList, total, pageNumber, pageSize);
            return new Response<PaginatedResponse<BlogDto>>(paged);
        }
        public async Task<Response<List<BlogDto>>> GetAllAsync()
        {
            var repo = _queryFactory.QueryRepository<Blog>();
            var list = await repo.Queryable().OrderByDescending(b => b.PublishedAt).ToListAsync();
            var dtoList = _mapper.Map<List<BlogDto>>(list);
            return new Response<List<BlogDto>>(dtoList);
        }

        public async Task<Response<BlogDto>> GetByIdAsync(int id)
        {
            var repo = _queryFactory.QueryRepository<Blog>();
            var blog = await repo.Queryable().FirstOrDefaultAsync(b => b.Id == id);
            if (blog == null) return new Response<BlogDto>("Blog not found");
            var blogDto = _mapper.Map<BlogDto>(blog);

            var seoResponse = await _seoMetaDataService.GetByEntityAsync(id, nameof(Blog));
            if (seoResponse.Succeeded && seoResponse.Data != null)
            {
                blogDto.SeoMeta = seoResponse.Data;
            }

            return new Response<BlogDto>(blogDto);
        }

        public async Task<Response<BlogDto>> CreateAsync(CreateBlogDto dto)
        {
            var validationResult = await _createBlogValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                var errorMessage = validationResult.Errors.First().ErrorMessage;
                return new Response<BlogDto>(errorMessage);
            }
            if (dto.SeoMeta != null)
            {
                var seoValidation = await _seoValidator.ValidateAsync(dto.SeoMeta);
                if (!seoValidation.IsValid)
                {
                    var errorMessage = seoValidation.Errors.First().ErrorMessage;
                    return new Response<BlogDto>(errorMessage);
                }
            }
            var blog = _mapper.Map<Blog>(dto);
            if (dto.CoverImage != null)
            {
                using (var memoryStream = new MemoryStream())
                {
                    await dto.CoverImage.CopyToAsync(memoryStream);
                    var base64Logo = Convert.ToBase64String(memoryStream.ToArray());

                    blog.CoverImage = base64Logo;
                }
            }
            await _uow.RepositoryAsync<Blog>().AddAsync(blog);
            await _uow.SaveChangesAsync(CancellationToken.None);

            // Seo Meta Details
            SeoMetaDataDto? seoDto = null;
            if (dto.SeoMeta != null)
            {
                var seoResponse = await _seoMetaDataService.CreateSeoMetaAsync<Blog>(blog.Id, dto.SeoMeta);
                if (!seoResponse.Succeeded)
                    return new Response<BlogDto>(seoResponse.Message);
                seoDto = seoResponse.Data;
            }

            var blogDto = _mapper.Map<BlogDto>(blog);
            blogDto.SeoMeta = seoDto;
            return new Response<BlogDto>(blogDto, "Blog created successfully");
        }

        public async Task<Response<BlogDto>> UpdateAsync(UpdateBlogDto dto)
        {
            var validationResult = await _updateBlogValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                var errorMessage = validationResult.Errors.First().ErrorMessage;
                return new Response<BlogDto>(errorMessage);
            }
            if (dto.SeoMeta != null)
            {
                var seoValidation = await _seoValidator.ValidateAsync(dto.SeoMeta);
                if (!seoValidation.IsValid)
                {
                    var errorMessage = seoValidation.Errors.First().ErrorMessage;
                    return new Response<BlogDto>(errorMessage);
                }
            }
            var repo = _uow.RepositoryAsync<Blog>();
            var blog = await _queryFactory
                .QueryRepository<Blog>()
                .Queryable()
                .FirstOrDefaultAsync(x => x.Id == dto.Id);
            if (blog == null) return new Response<BlogDto>("Blog not found");
        
            _mapper.Map(dto, blog);
            if (dto.CoverImage != null)
            {
                using (var memoryStream = new MemoryStream())
                {
                    await dto.CoverImage.CopyToAsync(memoryStream);
                    var base64Logo = Convert.ToBase64String(memoryStream.ToArray());

                    blog.CoverImage = base64Logo;
                }
            }
            await repo.UpdateAsync(blog);
            await _uow.SaveChangesAsync(CancellationToken.None);

            SeoMetaDataDto? seoDto = null;
            if (dto.SeoMeta != null)
            {
                var seoResponse = await _seoMetaDataService.UpdateSeoMetaAsync<Blog>(blog.Id, dto.SeoMeta);
                if (!seoResponse.Succeeded)
                    return new Response<BlogDto>(seoResponse.Message);
                seoDto = seoResponse.Data;
            }

            var updatedDto = _mapper.Map<BlogDto>(blog);
            updatedDto.SeoMeta = seoDto;
            return new Response<BlogDto>(updatedDto, "Blog updated successfully");
        }

        public async Task<Response<string>> DeleteAsync(int id)
        {
            var repo = _uow.RepositoryAsync<Blog>();
            var blog = await _queryFactory
                .QueryRepository<Blog>()
                .Queryable()
                .FirstOrDefaultAsync(x => x.Id == id);
            if (blog == null) return new Response<string>("Blog not found");
            await repo.DeleteAsync(blog);
            await _uow.SaveChangesAsync(CancellationToken.None);
            await _seoMetaDataService.DeleteByEntityAsync(id, nameof(Blog));

            return new Response<string>("Blog deleted successfully", "Blog deleted successfully");
        }
    }
}
