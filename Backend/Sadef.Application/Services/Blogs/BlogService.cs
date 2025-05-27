using Sadef.Common.Infrastructure.Wrappers;
using AutoMapper;
using Sadef.Application.Abstractions.Interfaces;
using Sadef.Application.DTOs.BlogDtos;
using Sadef.Common.Domain;
using Sadef.Domain.BlogsEntity;
using Microsoft.EntityFrameworkCore;
using Sadef.Application.DTOs.PropertyDtos;
using Azure.Core;
using FluentValidation;
using Sadef.Application.Services.PropertyListing;

namespace Sadef.Application.Services.Blogs
{
    public class BlogService : IBlogService
    {
        private readonly IUnitOfWorkAsync _uow;
        private readonly IQueryRepositoryFactory _queryFactory;
        private readonly IMapper _mapper;
        private readonly IValidator<CreateBlogDto> _createBlogValidator;
        private readonly IValidator<UpdateBlogDto> _updateBlogValidator;

        public BlogService(IUnitOfWorkAsync uow, IQueryRepositoryFactory queryFactory, IMapper mapper , IValidator<CreateBlogDto> createBlogValidator , IValidator<UpdateBlogDto> updateBlogValidator)
        {
            _uow = uow;
            _queryFactory = queryFactory;
            _mapper = mapper;
            _createBlogValidator = createBlogValidator;
            _updateBlogValidator = updateBlogValidator;
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
                using (var memoryStream = new MemoryStream())
                {
                    await dto.CoverImage.CopyToAsync(memoryStream);
                    var base64Logo = Convert.ToBase64String(memoryStream.ToArray());

                    blog.CoverImage = base64Logo;
                }
            }
            await _uow.RepositoryAsync<Blog>().AddAsync(blog);
            await _uow.SaveChangesAsync(CancellationToken.None);
            var blogDto = _mapper.Map<BlogDto>(blog);
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
            var updatedDto = _mapper.Map<BlogDto>(blog);
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
            return new Response<string>("Blog deleted successfully");
        }
    }
}
