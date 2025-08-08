using Microsoft.AspNetCore.Http;
using Sadef.Application.DTOs.PropertyDtos;
using Sadef.Domain.Constants;
using System.Text.Json;

namespace Sadef.Application.DTOs.BlogDtos
{
    public class CreateBlogDto
    {
        public IFormFile? CoverImage { get; set; }
        public required bool IsPublished { get; set; }
        public Dictionary<string, BlogTranslationDto> Translations { get; set; } = new();
        public string? TranslationsJson { get; set; }
    }
}
