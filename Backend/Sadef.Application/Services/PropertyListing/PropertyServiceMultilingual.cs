using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Sadef.Application.Abstractions.Interfaces;
using Sadef.Application.DTOs.PropertyDtos;
using Sadef.Application.Services.Multilingual;
using Sadef.Common.Infrastructure.Wrappers;
using Sadef.Domain.PropertyEntity;
using Sadef.Infrastructure.DBContext;
using Sadef.Common.Domain;
using System.Linq;

namespace Sadef.Application.Services.PropertyListing
{
    public class PropertyServiceMultilingual
    {
        private readonly SadefDbContext _context;
        private readonly IMapper _mapper;
        private readonly IMultilingualService _multilingualService;
        private readonly ILanguageService _languageService;

        public PropertyServiceMultilingual(
            SadefDbContext context,
            IMapper mapper,
            IMultilingualService multilingualService,
            ILanguageService languageService)
        {
            _context = context;
            _mapper = mapper;
            _multilingualService = multilingualService;
            _languageService = languageService;
        }

        /// <summary>
        /// Gets a property with localized content based on the current language
        /// </summary>
        public async Task<Response<PropertyDto>> GetLocalizedPropertyByIdAsync(int id)
        {
            var property = await _context.Properties
                .Include(p => p.Images)
                .Include(p => p.Videos)
                .Include(p => p.Translations)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (property == null)
                return new Response<PropertyDto>("Property not found");

            // Get current language from HTTP context
            var currentLanguage = _languageService.GetCurrentLanguage();
            var defaultLanguage = _languageService.GetDefaultLanguage();

            // Apply localized content with fallback
            var localizedProperty = await _multilingualService.GetLocalizedContentAsync(
                property, currentLanguage, defaultLanguage);

            var propertyDto = _mapper.Map<PropertyDto>(localizedProperty);
            
            // Convert images and videos to base64
            propertyDto.ImageBase64Strings = localizedProperty.Images?
                .Select(img => $"data:{img.ContentType};base64,{Convert.ToBase64String(img.ImageData)}")
                .ToList() ?? new();
            
            propertyDto.VideoUrls = localizedProperty.Videos?
                .Select(v => $"data:{v.ContentType};base64,{Convert.ToBase64String(v.VideoData)}")
                .ToList() ?? new();

            return new Response<PropertyDto>(propertyDto);
        }

        /// <summary>
        /// Gets all properties with localized content
        /// </summary>
        public async Task<Response<PaginatedResponse<PropertyDto>>> GetLocalizedPropertiesAsync(
            PaginationRequest request)
        {
            var currentLanguage = _languageService.GetCurrentLanguage();
            var defaultLanguage = _languageService.GetDefaultLanguage();

            var query = _context.Properties
                .Include(p => p.Images)
                .Include(p => p.Videos)
                .Include(p => p.Translations)
                .Where(p => p.IsActive == true)
                .OrderByDescending(p => p.CreatedAt);

            var totalCount = await query.CountAsync();
            var properties = await query
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync();

            // Apply localized content to each property
            var localizedProperties = await _multilingualService.GetLocalizedContentAsync(
                properties, currentLanguage, defaultLanguage);

            var propertyDtos = localizedProperties.Select(p =>
            {
                var dto = _mapper.Map<PropertyDto>(p);
                dto.ImageBase64Strings = p.Images?
                    .Select(img => $"data:{img.ContentType};base64,{Convert.ToBase64String(img.ImageData)}")
                    .ToList() ?? new();
                dto.VideoUrls = p.Videos?
                    .Select(v => $"data:{v.ContentType};base64,{Convert.ToBase64String(v.VideoData)}")
                    .ToList() ?? new();
                return dto;
            }).ToList();

            var paginatedResponse = new PaginatedResponse<PropertyDto>(
                propertyDtos, 
                totalCount, 
                request.PageNumber, 
                request.PageSize);

            return new Response<PaginatedResponse<PropertyDto>>(paginatedResponse);
        }

        /// <summary>
        /// Saves translations for a property
        /// </summary>
        public async Task<Response<bool>> SavePropertyTranslationsAsync(
            int propertyId, Dictionary<string, PropertyTranslationDto> translations)
        {
            try
            {
                // Convert DTOs to dictionary format expected by multilingual service
                var translationData = new Dictionary<string, object>();
                
                foreach (var translation in translations)
                {
                    var languageCode = translation.Key;
                    var translationDto = translation.Value;
                    
                    translationData[languageCode] = new Dictionary<string, object>
                    {
                        ["Title"] = translationDto.Title,
                        ["Description"] = translationDto.Description,
                        ["UnitName"] = translationDto.UnitName,
                        ["WarrantyInfo"] = translationDto.WarrantyInfo,
                        ["MetaTitle"] = translationDto.MetaTitle,
                        ["MetaDescription"] = translationDto.MetaDescription,
                        ["MetaKeywords"] = translationDto.MetaKeywords,
                        ["Slug"] = translationDto.Slug,
                        ["CanonicalUrl"] = translationDto.CanonicalUrl
                    };
                }

                var success = await _multilingualService.SaveTranslationsAsync<Property>(propertyId, translationData);
                
                return success 
                    ? new Response<bool>(true, "Translations saved successfully")
                    : new Response<bool>("Failed to save translations");
            }
            catch (Exception ex)
            {
                return new Response<bool>($"Error saving translations: {ex.Message}");
            }
        }

        /// <summary>
        /// Gets a property with all translations for admin management
        /// </summary>
        public async Task<Response<MultilingualPropertyDto>> GetMultilingualPropertyAsync(int id)
        {
            var property = await _context.Properties
                .Include(p => p.Images)
                .Include(p => p.Videos)
                .Include(p => p.Translations)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (property == null)
                return new Response<MultilingualPropertyDto>("Property not found");

            var multilingualDto = _mapper.Map<MultilingualPropertyDto>(property);
            
            // Add all translations
            foreach (var translation in property.Translations)
            {
                multilingualDto.Translations[translation.LanguageCode] = new PropertyTranslationDto
                {
                    Title = translation.Title,
                    Description = translation.Description,
                    UnitName = translation.UnitName,
                    WarrantyInfo = translation.WarrantyInfo,
                    MetaTitle = translation.MetaTitle,
                    MetaDescription = translation.MetaDescription,
                    MetaKeywords = translation.MetaKeywords,
                    Slug = translation.Slug,
                    CanonicalUrl = translation.CanonicalUrl
                };
            }

            // Convert images and videos
            multilingualDto.ImageBase64Strings = property.Images?
                .Select(img => $"data:{img.ContentType};base64,{Convert.ToBase64String(img.ImageData)}")
                .ToList() ?? new();
            
            multilingualDto.VideoUrls = property.Videos?
                .Select(v => $"data:{v.ContentType};base64,{Convert.ToBase64String(v.VideoData)}")
                .ToList() ?? new();

            return new Response<MultilingualPropertyDto>(multilingualDto);
        }
    }
} 