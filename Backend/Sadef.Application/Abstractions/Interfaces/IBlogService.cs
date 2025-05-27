using Sadef.Common.Infrastructure.Wrappers;
using Sadef.Application.DTOs.BlogDtos;
using Sadef.Application.DTOs.PropertyDtos;

namespace Sadef.Application.Abstractions.Interfaces
{
    public interface IBlogService
    {
        Task<Response<PaginatedResponse<BlogDto>>> GetPaginatedAsync(int pageNumber, int pageSize);
        Task<Response<List<BlogDto>>> GetAllAsync();
        Task<Response<BlogDto>> GetByIdAsync(int id);
        Task<Response<BlogDto>> CreateAsync(CreateBlogDto dto);
        Task<Response<BlogDto>> UpdateAsync(UpdateBlogDto dto);
        Task<Response<string>> DeleteAsync(int id);
    }

}
