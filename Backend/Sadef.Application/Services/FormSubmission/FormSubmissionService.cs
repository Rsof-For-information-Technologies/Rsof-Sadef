using AutoMapper;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Localization;
using Sadef.Application.Abstractions.Interfaces;
using Sadef.Application.DTOs.FormSubmissionDtos;
using Sadef.Application.DTOs.PropertyDtos;
using Sadef.Application.Utils;
using Sadef.Common.Domain;
using Sadef.Common.Infrastructure.Validator;
using Sadef.Common.Infrastructure.Wrappers;
using Sadef.Domain.FormSubmissionEntity;

namespace Sadef.Application.Services.FormSubmission
{
    public class FormSubmissionService : IFormSubmissionService
    {
        private readonly IUnitOfWorkAsync _uow;
        private readonly IMapper _mapper;
        private readonly IValidator<SubmitFormDto> _submitFormValidator;
        private readonly IQueryRepositoryFactory _queryRepositoryFactory;
        private readonly IDistributedCache _cache;
        private readonly IStringLocalizer _localizer;
        private readonly IConfiguration _configuration;

        public FormSubmissionService(
            IUnitOfWorkAsync uow,
            IMapper mapper,
            IValidator<SubmitFormDto> submitFormValidator,
            IQueryRepositoryFactory queryRepositoryFactory,
            IDistributedCache cache,
            IStringLocalizerFactory localizerFactory,
            IConfiguration configuration)
        {
            _uow = uow;
            _mapper = mapper;
            _submitFormValidator = submitFormValidator;
            _queryRepositoryFactory = queryRepositoryFactory;
            _cache = cache;
            _localizer = localizerFactory.Create("Messages", "Sadef.Application");
            _configuration = configuration;
        }

        public async Task<Response<FormSubmissionDto>> SubmitFormAsync(SubmitFormDto dto)
        {
            var validationResult = await _submitFormValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                return new Response<FormSubmissionDto>
                {
                    Succeeded = false,
                    Message = "Validation Failed",
                    ValidationResultModel = new ValidationResultModel(validationResult)
                };
            }

            var formSubmission = _mapper.Map<Sadef.Domain.FormSubmissionEntity.FormSubmission>(dto);
            formSubmission.CreatedAt = DateTime.UtcNow;
            formSubmission.CreatedBy = "system";

            // Handle CV file upload if provided
            if (dto.CV != null)
            {
                var basePath = _configuration["UploadSettings:Paths:FormSubmissions"] ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "forms");
                var virtualPathBase = _configuration["UploadSettings:RelativePaths:FormSubmissions"] ?? "/uploads/forms";
                
                var savedFiles = await FileUploadHelper.SaveFilesAsync(new[] { dto.CV }, basePath, "cv", virtualPathBase);
                if (savedFiles.Any())
                {
                    formSubmission.CVUrl = savedFiles.First().Url;
                }
            }

            await _uow.RepositoryAsync<Sadef.Domain.FormSubmissionEntity.FormSubmission>().AddAsync(formSubmission);
            await _uow.SaveChangesAsync(CancellationToken.None);

            // Clear cache
            await ClearFormSubmissionCaches();

            var responseDto = _mapper.Map<FormSubmissionDto>(formSubmission);
            return new Response<FormSubmissionDto>(responseDto, "Form submitted successfully");
        }

        public async Task<Response<PaginatedResponse<FormSubmissionDto>>> GetPaginatedAsync(int pageNumber, int pageSize)
        {
            var cacheKey = $"formsubmissions:page={pageNumber}&size={pageSize}";
            var cachedResult = await _cache.GetStringAsync(cacheKey);
            
            if (!string.IsNullOrEmpty(cachedResult))
            {
                var cachedData = System.Text.Json.JsonSerializer.Deserialize<PaginatedResponse<FormSubmissionDto>>(cachedResult);
                if (cachedData != null)
                    return new Response<PaginatedResponse<FormSubmissionDto>>(cachedData, "Form submissions retrieved successfully");
            }

            var queryRepo = _queryRepositoryFactory.QueryRepository<Sadef.Domain.FormSubmissionEntity.FormSubmission>();
            var query = queryRepo.Queryable().OrderByDescending(f => f.CreatedAt);

            var totalCount = await query.CountAsync();
            var items = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var dtos = _mapper.Map<List<FormSubmissionDto>>(items);
            var result = new PaginatedResponse<FormSubmissionDto>(dtos, totalCount, pageNumber, pageSize);

            // Cache the result
            var cacheOptions = new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(30)
            };
            await _cache.SetStringAsync(cacheKey, System.Text.Json.JsonSerializer.Serialize(result), cacheOptions);

            return new Response<PaginatedResponse<FormSubmissionDto>>(result, "Form submissions retrieved successfully");
        }

        public async Task<Response<FormSubmissionDto>> GetByIdAsync(int id)
        {
            var queryRepo = _queryRepositoryFactory.QueryRepository<Sadef.Domain.FormSubmissionEntity.FormSubmission>();
            var formSubmission = await queryRepo.Queryable().FirstOrDefaultAsync(f => f.Id == id);

            if (formSubmission == null)
                return new Response<FormSubmissionDto> { Succeeded = false, Message = "Form submission not found" };

            var dto = _mapper.Map<FormSubmissionDto>(formSubmission);
            return new Response<FormSubmissionDto>(dto, "Form submission retrieved successfully");
        }

        private async Task ClearFormSubmissionCaches()
        {
            // Clear pagination caches
            var keys = new List<string>();
            for (int page = 1; page <= 10; page++) // Clear first 10 pages
            {
                for (int size = 10; size <= 50; size += 10) // Common page sizes
                {
                    keys.Add($"formsubmissions:page={page}&size={size}");
                }
            }

            foreach (var key in keys)
            {
                await _cache.RemoveAsync(key);
            }
        }
    }
}
