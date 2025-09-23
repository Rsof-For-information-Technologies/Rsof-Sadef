using Sadef.Application.DTOs.FormSubmissionDtos;
using Sadef.Application.DTOs.PropertyDtos;
using Sadef.Common.Infrastructure.Wrappers;

namespace Sadef.Application.Abstractions.Interfaces
{
    public interface IFormSubmissionService
    {
        Task<Response<FormSubmissionDto>> SubmitFormAsync(SubmitFormDto dto);
        Task<Response<PaginatedResponse<FormSubmissionDto>>> GetPaginatedAsync(int pageNumber, int pageSize);
        Task<Response<FormSubmissionDto>> GetByIdAsync(int id);
    }
}
