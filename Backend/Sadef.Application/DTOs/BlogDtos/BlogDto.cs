using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Sadef.Domain.Constants;

namespace Sadef.Application.DTOs.BlogDtos
{
    public class BlogDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? CoverImage { get; set; }
        public DateTime PublishedAt { get; set; }
        public bool IsPublished { get; set; }
        public string? MetaTitle { get; set; }
        public string? MetaDescription { get; set; }
        public string? MetaKeywords { get; set; }
        public string? Slug { get; set; }
        public string? CanonicalUrl { get; set; }
        public ContentLanguage ContentLanguage { get; set; }
        public Dictionary<string, BlogTranslationDto>? Translations { get; set; }
        public string? TranslationsJson { get; set; }
    }
}
