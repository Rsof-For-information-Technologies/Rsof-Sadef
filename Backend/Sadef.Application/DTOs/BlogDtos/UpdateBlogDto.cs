using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Sadef.Domain.Constants;
using Microsoft.AspNetCore.Http;
using System.Text.Json;

namespace Sadef.Application.DTOs.BlogDtos
{
    public class UpdateBlogDto
    {
        public required int Id { get; set; }
        public IFormFile? CoverImage { get; set; }
        public required bool IsPublished { get; set; }
        
        // JSON string input from form data
        public string? TranslationsJson { get; set; }
        
        // Computed property that deserializes the JSON
        public Dictionary<string, BlogTranslationDto>? Translations 
        { 
            get
            {
                if (string.IsNullOrEmpty(TranslationsJson))
                    return null;
                
                try
                {
                    var options = new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    };
                    return JsonSerializer.Deserialize<Dictionary<string, BlogTranslationDto>>(TranslationsJson, options);
                }
                catch (JsonException)
                {
                    return null;
                }
            }
        }
    }
}
