using Microsoft.AspNetCore.Http;

namespace Sadef.Application.DTOs.BlogDtos
{
    public class CreateBlogDto
    {
        public required string Title { get; set; }
        public required string Content { get; set; }
        public IFormFile? CoverImage { get; set; }
        public required bool IsPublished { get; set; }
        public string? MetaTitle { get; set; }
        public string? MetaDescription { get; set; }
        public string? MetaKeywords { get; set; }
        public string? Slug { get; set; }
        public string? CanonicalUrl { get; set; }
    }

}
