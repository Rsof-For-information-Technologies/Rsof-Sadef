using Sadef.Common.Infrastructure.Wrappers;
using AutoMapper;
using Sadef.Application.Abstractions.Interfaces;
using Sadef.Application.DTOs.BlogDtos;
using Sadef.Common.Domain;
using Sadef.Domain.BlogsEntity;
using Microsoft.EntityFrameworkCore;
using Sadef.Application.DTOs.PropertyDtos;
using FluentValidation;
using Sadef.Application.Utils;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Configuration;

namespace Sadef.Application.Services.Blogs
{
    public class BlogService : IBlogService
    {
        private readonly IUnitOfWorkAsync _uow;
        private readonly IQueryRepositoryFactory _queryFactory;
        private readonly IMapper _mapper;
        private readonly IValidator<CreateBlogDto> _createBlogValidator;
        private readonly IValidator<UpdateBlogDto> _updateBlogValidator;
        private readonly IConfiguration _configuration;
        private readonly IStringLocalizer _localizer;

        public BlogService(IUnitOfWorkAsync uow, IQueryRepositoryFactory queryFactory, IMapper mapper , IValidator<CreateBlogDto> createBlogValidator , IValidator<UpdateBlogDto> updateBlogValidator, IStringLocalizerFactory localizerFactory, IConfiguration configuration)
        {
            _uow = uow;
            _queryFactory = queryFactory;
            _mapper = mapper;
            _createBlogValidator = createBlogValidator;
            _updateBlogValidator = updateBlogValidator;
            _configuration = configuration;
            _localizer = localizerFactory.Create("Messages", "Sadef.Application");
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
            if (blog == null) return new Response<BlogDto>(_localizer["Blog_NotFound"]);
            return new Response<BlogDto>(_mapper.Map<BlogDto>(blog));
        }

        public async Task<Response<BlogDto>> CreateAsync(CreateBlogDto dto)
        {
            var validationResult = await _createBlogValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                var errorMessage = validationResult.Errors.First().ErrorMessage;
                return new Response<BlogDto>(errorMessage);
            }

            var blog = _mapper.Map<Blog>(dto);
            if (dto.CoverImage != null)
            {
                var basePath = _configuration["UploadSettings:BlogMedia"] ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "blog");
                var virtualPathBase = "uploads/blog";
                var savedFiles = await FileUploadHelper.SaveFilesAsync(new[] { dto.CoverImage }, basePath, "cover", virtualPathBase);

                var coverImageUrl = savedFiles.FirstOrDefault().Url;
                if (!string.IsNullOrWhiteSpace(coverImageUrl))
                {
                    blog.CoverImage = coverImageUrl;
                }
            }

            await _uow.RepositoryAsync<Blog>().AddAsync(blog);
            await _uow.SaveChangesAsync(CancellationToken.None);

            var blogDto = _mapper.Map<BlogDto>(blog);
            return new Response<BlogDto>(blogDto, _localizer["Blog_Created"]);
        }

        public async Task<Response<BlogDto>> UpdateAsync(UpdateBlogDto dto)
        {
            var validationResult = await _updateBlogValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                var errorMessage = validationResult.Errors.First().ErrorMessage;
                return new Response<BlogDto>(errorMessage);
            }

            var repo = _uow.RepositoryAsync<Blog>();
            var blog = await _queryFactory
                .QueryRepository<Blog>()
                .Queryable()
                .FirstOrDefaultAsync(x => x.Id == dto.Id);
            if (blog == null) return new Response<BlogDto>(_localizer["Blog_NotFound"]);
        
            _mapper.Map(dto, blog);
            if (dto.CoverImage != null)
            {
                if (!string.IsNullOrWhiteSpace(blog.CoverImage))
                    FileUploadHelper.RemoveFileIfExists(blog.CoverImage);

                var basePath = _configuration["UploadSettings:BlogMedia"] ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "blog");
                var virtualPathBase = "uploads/blog";
                var savedFiles = await FileUploadHelper.SaveFilesAsync(new[] { dto.CoverImage }, basePath, "cover", virtualPathBase);

                var coverImageUrl = savedFiles.FirstOrDefault().Url;
                if (!string.IsNullOrWhiteSpace(coverImageUrl))
                {
                    blog.CoverImage = coverImageUrl;
                }
            }

            await repo.UpdateAsync(blog);
            await _uow.SaveChangesAsync(CancellationToken.None);

            var updatedDto = _mapper.Map<BlogDto>(blog);
            return new Response<BlogDto>(updatedDto, _localizer["Blog_Updated"]);
        }

        public async Task<Response<string>> DeleteAsync(int id)
        {
            var repo = _uow.RepositoryAsync<Blog>();
            var blog = await _queryFactory
                .QueryRepository<Blog>()
                .Queryable()
                .FirstOrDefaultAsync(x => x.Id == id);
            if (blog == null) return new Response<string>(_localizer["Blog_NotFound"]);
            await repo.DeleteAsync(blog);
            await _uow.SaveChangesAsync(CancellationToken.None);
            return new Response<string>(_localizer["Blog_Deleted"]);
        }
    }
}
