using Microsoft.AspNetCore.Http;
using Sadef.Application.DTOs.SeoMetaDtos;

namespace Sadef.Application.DTOs.BlogDtos
{
    public class CreateBlogDto
    {
        public required string Title { get; set; }
        public required string Content { get; set; }
        public IFormFile? CoverImage { get; set; }
        public required bool IsPublished { get; set; }
        public CreateSeoMetaDetailsDto? SeoMeta { get; set; }
    }

}
