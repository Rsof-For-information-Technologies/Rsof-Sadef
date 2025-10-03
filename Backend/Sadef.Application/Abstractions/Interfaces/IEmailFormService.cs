using Sadef.Application.DTOs.FormSubmissionDtos;
using Sadef.Common.Infrastructure.Wrappers;

namespace Sadef.Application.Abstractions.Interfaces
{
    public interface IEmailFormService
    {
        Task<Response<bool>> SendEmailFormAsync(EmailFormDto dto);
    }
}
