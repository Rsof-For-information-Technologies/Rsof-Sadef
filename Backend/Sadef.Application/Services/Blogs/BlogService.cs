using AutoMapper;
using FluentValidation;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Localization;
using Newtonsoft.Json;
using Sadef.Application.Abstractions.Interfaces;
using Sadef.Application.DTOs.BlogDtos;
using Sadef.Application.DTOs.PropertyDtos;
using Sadef.Application.Services.Multilingual;
using Sadef.Application.Utils;
using Sadef.Common.Domain;
using Sadef.Common.Infrastructure.Validator;
using Sadef.Common.Infrastructure.Wrappers;
using Sadef.Domain.BlogsEntity;
using Sadef.Domain.Constants;
using Sadef.Infrastructure.DBContext;
using SystemTextJson = System.Text.Json;
namespace Sadef.Application.Services.Blogs
{
    public class BlogService : IBlogService
    {
        private readonly IUnitOfWorkAsync _uow;
        private readonly IQueryRepositoryFactory _queryFactory;
        private readonly IMapper _mapper;
        private const string BlogAllCacheKey = "blogs:all";
        private const string BlogCacheVersionKey = "blogs:version";
        private const string BLOG_CACHE_PREFIX = "blog";
        private const int CACHE_DURATION_MINUTES = 10;
        private readonly IValidator<CreateBlogDto> _createBlogValidator;
        private readonly IValidator<UpdateBlogDto> _updateBlogValidator;
        private readonly IConfiguration _configuration;
        private readonly IStringLocalizer _localizer;
        private readonly IDistributedCache _cache;
        private readonly SadefDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IEnumLocalizationService _enumLocalizationService;

        public BlogService(IUnitOfWorkAsync uow, IQueryRepositoryFactory queryFactory, IMapper mapper, IValidator<CreateBlogDto> createBlogValidator, IValidator<UpdateBlogDto> updateBlogValidator, IStringLocalizerFactory localizerFactory, IConfiguration configuration, IDistributedCache cache, SadefDbContext context, IHttpContextAccessor httpContextAccessor, IEnumLocalizationService enumLocalizationService)
        {
            _uow = uow;
            _cache = cache;
            _mapper = mapper;
            _queryFactory = queryFactory;
            _configuration = configuration;
            _createBlogValidator = createBlogValidator;
            _updateBlogValidator = updateBlogValidator;
            _localizer = localizerFactory.Create("Messages", "Sadef.Application");
            _context = context;
            _httpContextAccessor = httpContextAccessor;
            _enumLocalizationService = enumLocalizationService;
        }

        public async Task<Response<PaginatedResponse<BlogDto>>> GetPaginatedAsync(int pageNumber, int pageSize)
        {
            var currentLanguage = GetCurrentLanguage();
            string cacheKey = $"{BLOG_CACHE_PREFIX}:page={pageNumber}&size={pageSize}&lang={currentLanguage}";

            // Try to get from cache first
            var cached = await _cache.GetStringAsync(cacheKey);
            if (!string.IsNullOrEmpty(cached))
            {
                var cachedResult = JsonConvert.DeserializeObject<PaginatedResponse<BlogDto>>(cached);
                if (cachedResult != null)
                    return new Response<PaginatedResponse<BlogDto>>(cachedResult, _localizer["Blog_ListedFromCache"]);
            }

            var repo = _queryFactory.QueryRepository<Blog>();
            var query = repo.Queryable().AsNoTracking().Include(b => b.Translations).OrderByDescending(b => b.PublishedAt);

            var total = await query.CountAsync();
            var items = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
            var result = new List<BlogDto>();

            foreach (var blog in items)
            {
                var dto = _mapper.Map<BlogDto>(blog);
                await ApplyLocalizationToDtoAsync(dto, blog.Id, currentLanguage);
                result.Add(dto);
            }

            var pagedResponse = new PaginatedResponse<BlogDto>(result, total, pageNumber, pageSize);

            // Cache for 10 minutes
            var cacheOptions = new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(CACHE_DURATION_MINUTES)
            };
            await _cache.SetStringAsync(cacheKey, JsonConvert.SerializeObject(pagedResponse), cacheOptions);

            return new Response<PaginatedResponse<BlogDto>>(pagedResponse, _localizer["Blog_Listed"]);
        }

        public async Task<Response<List<BlogDto>>> GetAllAsync()
        {
            var currentLanguage = GetCurrentLanguage();
            string cacheKey = $"{BLOG_CACHE_PREFIX}:all:lang={currentLanguage}";

            var cached = await _cache.GetStringAsync(cacheKey);
            if (cached != null)
            {
                var cachedDtoList = JsonConvert.DeserializeObject<List<BlogDto>>(cached);
                if (cachedDtoList != null)
                    return new Response<List<BlogDto>>(cachedDtoList, _localizer["Blog_ListedFromCache"]);
            }

            var repo = _queryFactory.QueryRepository<Blog>();
            var list = await repo.Queryable().AsNoTracking().Include(b => b.Translations).OrderByDescending(b => b.PublishedAt).ToListAsync();
            var result = new List<BlogDto>();

            foreach (var blog in list)
            {
                var dto = _mapper.Map<BlogDto>(blog);
                await ApplyLocalizationToDtoAsync(dto, blog.Id, currentLanguage);
                result.Add(dto);
            }

            var options = new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(CACHE_DURATION_MINUTES) };
            await _cache.SetStringAsync(cacheKey, JsonConvert.SerializeObject(result), options);

            return new Response<List<BlogDto>>(result, _localizer["Blog_Listed"]);
        }

        public async Task<Response<BlogDto>> GetByIdAsync(int id)
        {
            var repo = _queryFactory.QueryRepository<Blog>();
            var blog = await repo.Queryable().Include(b => b.Translations).FirstOrDefaultAsync(b => b.Id == id);
            if (blog == null) return new Response<BlogDto> { Succeeded = false, Message = _localizer["Blog_NotFound"] };

            var dto = _mapper.Map<BlogDto>(blog);
            var currentLanguage = GetCurrentLanguage();
            await ApplyLocalizationToDtoAsync(dto, blog.Id, currentLanguage);

            return new Response<BlogDto>(dto, _localizer["Blog_Found"]);
        }

        public async Task<Response<BlogDto>> CreateAsync(CreateBlogDto dto)
        {
            var validationResult = await _createBlogValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                return new Response<BlogDto>
                {
                    Succeeded = false,
                    Message = "Validation Failed",
                    ValidationResultModel = new ValidationResultModel(validationResult)
                };
            }

            // Parse translations JSON if provided
            if (!string.IsNullOrEmpty(dto.TranslationsJson))
            {
                try
                {
                    var options = new SystemTextJson.JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    };
                    dto.Translations = SystemTextJson.JsonSerializer.Deserialize<Dictionary<string, BlogTranslationDto>>(dto.TranslationsJson, options);
                }
                catch (Exception ex)
                {
                    return new Response<BlogDto>($"Invalid translations JSON format: {ex.Message}. Received: {dto.TranslationsJson}");
                }
            }

            // Validate that at least one translation is provided
            if (dto.Translations == null || !dto.Translations.Any())
            {
                return new Response<BlogDto> { Succeeded = false, Message = _localizer["Blog_AtLeastOneTranslationRequired"] };
            }
            // Validate translation content
            var translationValidation = ValidateTranslations(dto.Translations);
            if (!translationValidation.IsValid)
            {
                return new Response<BlogDto> { Succeeded = false, Message = translationValidation.ErrorMessage };
            }
            var blog = _mapper.Map<Blog>(dto);

            // Set ContentLanguage based on available translations
            blog.ContentLanguage = DetermineContentLanguage(dto.Translations);

            if (dto.CoverImage != null)
            {
                var basePath = _configuration["UploadSettings:Paths:BlogAttachments"] ?? Directory.GetCurrentDirectory();
                var virtualPathBase = _configuration["UploadSettings:RelativePaths:BlogMedia"] ?? "/uploads/blog";
                var savedFiles = await FileUploadHelper.SaveFilesAsync(new[] { dto.CoverImage }, basePath, "cover", virtualPathBase);

                var coverImageUrl = savedFiles.FirstOrDefault().Url;
                if (!string.IsNullOrWhiteSpace(coverImageUrl))
                {
                    blog.CoverImage = coverImageUrl;
                }
            }

            await _uow.RepositoryAsync<Blog>().AddAsync(blog);
            await _uow.SaveChangesAsync(CancellationToken.None);

            // Save translations
            await SaveBlogTranslationsInternalAsync(blog.Id, dto.Translations);

            // Clear all language-specific caches for blogs
            await ClearBlogCaches();

            var blogDto = _mapper.Map<BlogDto>(blog);
            var currentLanguage = GetCurrentLanguage();
            await ApplyLocalizationToDtoAsync(blogDto, blog.Id, currentLanguage);
            return new Response<BlogDto>(blogDto, _localizer["Blog_Created"]);
        }

        public async Task<Response<BlogDto>> UpdateAsync(UpdateBlogDto dto)
        {
            var validationResult = await _updateBlogValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                return new Response<BlogDto>
                {
                    Succeeded = false,
                    Message = "Validation Failed",
                    ValidationResultModel = new ValidationResultModel(validationResult)
                };
            }

            var repo = _uow.RepositoryAsync<Blog>();
            var blog = await _queryFactory
                .QueryRepository<Blog>()
                .Queryable()
                .Include(b => b.Translations)
                .FirstOrDefaultAsync(x => x.Id == dto.Id);
            if (blog == null) return new Response<BlogDto> { Succeeded = false, Message = _localizer["Blog_NotFound"] };

            // Update non-translatable fields
            blog.IsPublished = dto.IsPublished;

            if (dto.CoverImage != null)
            {
                if (!string.IsNullOrWhiteSpace(blog.CoverImage))
                    FileUploadHelper.RemoveFileIfExists(blog.CoverImage);

                var basePath = _configuration["UploadSettings:Paths:BlogAttachments"] ?? Directory.GetCurrentDirectory();
                var virtualPathBase = _configuration["UploadSettings:RelativePaths:BlogMedia"] ?? "/uploads/blog";
                var savedFiles = await FileUploadHelper.SaveFilesAsync(new[] { dto.CoverImage }, basePath, "cover", virtualPathBase);

                var coverImageUrl = savedFiles.FirstOrDefault().Url;
                if (!string.IsNullOrWhiteSpace(coverImageUrl))
                {
                    blog.CoverImage = coverImageUrl;
                }
            }

            await repo.UpdateAsync(blog);
            await _uow.SaveChangesAsync(CancellationToken.None);

            // Update translations if provided
            if (dto.Translations != null)
            {
                var (isValid, errorMessage) = ValidateTranslations(dto.Translations);
                if (!isValid)
                {
                    return new Response<BlogDto> { Succeeded = false, Message = errorMessage };
                }

                blog.ContentLanguage = DetermineContentLanguage(dto.Translations);
                await SaveBlogTranslationsInternalAsync(blog.Id, dto.Translations);
            }

            // Clear all language-specific caches for blogs
            await ClearBlogCaches();

            var updatedDto = _mapper.Map<BlogDto>(blog);
            var currentLanguage = GetCurrentLanguage();
            await ApplyLocalizationToDtoAsync(updatedDto, blog.Id, currentLanguage);
            return new Response<BlogDto>(updatedDto, _localizer["Blog_Updated"]);
        }

        public async Task<Response<string>> DeleteAsync(int id)
        {
            var repo = _uow.RepositoryAsync<Blog>();
            var blog = await _queryFactory
                .QueryRepository<Blog>()
                .Queryable()
                .Include(b => b.Translations)
                .FirstOrDefaultAsync(x => x.Id == id);
            if (blog == null) return new Response<string> { Succeeded = false, Message = _localizer["Blog_NotFound"] };

            // Delete translations first
            if (blog.Translations.Any())
            {
                foreach (var translation in blog.Translations)
                {
                    _context.BlogTranslations.Remove(translation);
                }
            }

            await repo.DeleteAsync(blog);
            await _uow.SaveChangesAsync(CancellationToken.None);

            // Clear all language-specific caches for blogs
            await ClearBlogCaches();

            return new Response<string>(_localizer["Blog_Deleted"]);
        }

        private string GetCurrentLanguage()
        {
            try
            {
                var httpContext = _httpContextAccessor?.HttpContext;

                if (httpContext != null)
                {
                    // First try to get from middleware
                    var currentLanguage = httpContext.Items["CurrentLanguage"] as string;
                    if (!string.IsNullOrEmpty(currentLanguage))
                        return currentLanguage;

                    // Fallback to header parsing
                    var acceptLanguage = httpContext.Request.Headers["Accept-Language"].FirstOrDefault();

                    if (!string.IsNullOrEmpty(acceptLanguage))
                    {
                        var languages = acceptLanguage.Split(',')
                            .Select(lang => lang.Trim().Split(';')[0].ToLower())
                            .ToList();

                        if (languages.Any(lang => lang.StartsWith("ar")))
                            return "ar";

                        if (languages.Any(lang => lang.StartsWith("en")))
                            return "en";
                    }
                }
            }
            catch (Exception ex)
            {
                // Log the exception if needed
                // For now, just continue with default
            }

            return "en"; // Default to English
        }

        private ContentLanguage DetermineContentLanguage(Dictionary<string, BlogTranslationDto> translations)
        {
            if (translations.ContainsKey("en") && translations.ContainsKey("ar"))
                return ContentLanguage.Both;
            else if (translations.ContainsKey("ar"))
                return ContentLanguage.Arabic;
            else
                return ContentLanguage.English;
        }

        private async Task ApplyLocalizationToDtoAsync(BlogDto dto, int blogId, string languageCode)
        {
            if (_context == null) return;

            // Get all translations for this blog in a single query
            var allTranslations = await _context.BlogTranslations
                .Where(t => t.BlogId == blogId)
                .ToListAsync();

            // Get translation for the requested language
            var translation = allTranslations.FirstOrDefault(t => t.LanguageCode == languageCode);

            if (translation != null)
            {
                // Apply translation to DTO
                ApplyTranslationToDto(dto, translation);
            }
            else if (languageCode != "en")
            {
                // Fallback to English if requested language not found
                var englishTranslation = allTranslations.FirstOrDefault(t => t.LanguageCode == "en");
                if (englishTranslation != null)
                {
                    ApplyTranslationToDto(dto, englishTranslation);
                }
            }
            else
            {
                // If no translation found for the requested language and it's not English,
                // try to get any available translation
                var anyTranslation = allTranslations.FirstOrDefault();
                if (anyTranslation != null)
                {
                    ApplyTranslationToDto(dto, anyTranslation);
                }
            }
        }

        private void ApplyTranslationToDto(BlogDto dto, BlogTranslation translation)
        {
            dto.Title = translation.Title;
            dto.Content = translation.Content;
            dto.MetaTitle = translation.MetaTitle;
            dto.MetaDescription = translation.MetaDescription;
            dto.MetaKeywords = translation.MetaKeywords;
            dto.Slug = translation.Slug;
            dto.CanonicalUrl = translation.CanonicalUrl;
        }

        private async Task SaveBlogTranslationsInternalAsync(int blogId, Dictionary<string, BlogTranslationDto> translations)
        {
            if (_context == null) return;

            // Get existing translations
            var existingTranslations = await _context.BlogTranslations
                .Where(t => t.BlogId == blogId)
                .ToListAsync();

            // Update or create translations
            foreach (var translation in translations)
            {
                var languageCode = translation.Key;
                var translationDto = translation.Value;

                var existingTranslation = await _context.BlogTranslations
                    .FirstOrDefaultAsync(t => t.BlogId == blogId && t.LanguageCode == languageCode);

                if (existingTranslation != null)
                {
                    // Update existing translation
                    existingTranslation.Title = translationDto.Title;
                    existingTranslation.Content = translationDto.Content;
                    existingTranslation.MetaTitle = translationDto.MetaTitle;
                    existingTranslation.MetaDescription = translationDto.MetaDescription;
                    existingTranslation.MetaKeywords = translationDto.MetaKeywords;
                    existingTranslation.Slug = translationDto.Slug;
                    existingTranslation.CanonicalUrl = translationDto.CanonicalUrl;

                    _context.BlogTranslations.Update(existingTranslation);
                }
                else
                {
                    // Create new translation
                    var newTranslation = new BlogTranslation
                    {
                        BlogId = blogId,
                        LanguageCode = languageCode,
                        Title = translationDto.Title,
                        Content = translationDto.Content,
                        MetaTitle = translationDto.MetaTitle,
                        MetaDescription = translationDto.MetaDescription,
                        MetaKeywords = translationDto.MetaKeywords,
                        Slug = translationDto.Slug,
                        CanonicalUrl = translationDto.CanonicalUrl
                    };

                    _context.BlogTranslations.Add(newTranslation);
                }
            }

            await _context.SaveChangesAsync();
        }

        private (bool IsValid, string ErrorMessage) ValidateTranslations(Dictionary<string, BlogTranslationDto> translations)
        {
            if (translations == null || !translations.Any())
            {
                return (false, _localizer["Blog_AtLeastOneTranslationRequired"]);
            }

            foreach (var translation in translations)
            {
                var languageCode = translation.Key;
                var translationDto = translation.Value;

                if (string.IsNullOrWhiteSpace(translationDto.Title))
                {
                    return (false, _localizer["Blog_TitleRequiredForLanguage", languageCode]);
                }

                if (string.IsNullOrWhiteSpace(translationDto.Content))
                {
                    return (false, _localizer["Blog_ContentRequiredForLanguage", languageCode]);
                }

                // Validate language code
                if (languageCode != "en" && languageCode != "ar")
                {
                    return (false, _localizer["Blog_InvalidLanguageCode", languageCode]);
                }
            }

            return (true, string.Empty);
        }

        private async Task ClearBlogCaches()
        {
            // Clear all language-specific cache keys for blogs
            var cacheKeys = new List<string>
            {
                $"{BLOG_CACHE_PREFIX}:all:lang=en",
                $"{BLOG_CACHE_PREFIX}:all:lang=ar",
                $"{BLOG_CACHE_PREFIX}:page=1&size=10&lang=en",
                $"{BLOG_CACHE_PREFIX}:page=1&size=10&lang=ar"
            };

            foreach (var key in cacheKeys)
            {
                await _cache.RemoveAsync(key);
            }
        }
    }
}
