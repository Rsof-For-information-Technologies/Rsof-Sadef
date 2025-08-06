# Multilingual Content System Guide

## Overview

This guide explains the multilingual content system implemented for the Sadef real estate platform. The system supports content entry and display in both Arabic and English with intelligent fallback logic.

## Architecture

### 🏗️ Database Design

We use the **Translation Table Pattern** instead of JSON fields for the following reasons:

#### ✅ Advantages:
- **Better Performance**: Direct SQL queries with proper indexing
- **Type Safety**: Strongly typed translations
- **Easy Querying**: Simple LINQ queries with joins
- **Scalability**: Easy to add new languages
- **Audit Trail**: Track translation changes
- **SEO Friendly**: Language-specific URLs and metadata

#### 📊 Database Schema

```sql
-- Main entities (existing)
Properties (Id, Price, PropertyType, etc.)
Blogs (Id, CoverImage, PublishedAt, etc.)
MaintenanceRequests (Id, LeadId, Status, etc.)

-- Translation tables (new)
PropertyTranslations (Id, PropertyId, LanguageCode, Title, Description, etc.)
BlogTranslations (Id, BlogId, LanguageCode, Title, Content, etc.)
MaintenanceRequestTranslations (Id, MaintenanceRequestId, LanguageCode, Description, etc.)
```

### 🔄 Fallback Logic

The system implements intelligent fallback logic:

1. **User selects English** → Show English content
2. **English not available** → Fallback to Arabic (default)
3. **User selects Arabic** → Show Arabic content
4. **Arabic not available** → Show original content

## Implementation

### 1. Translation Entities

```csharp
// PropertyTranslation.cs
public class PropertyTranslation : EntityBase
{
    public int PropertyId { get; set; }
    public string LanguageCode { get; set; } = "en"; // en, ar
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    // ... other translatable fields
    public Property Property { get; set; } = null!;
}
```

### 2. Multilingual Service

```csharp
// IMultilingualService.cs
public interface IMultilingualService
{
    Task<T> GetLocalizedContentAsync<T>(T entity, string languageCode, string defaultLanguageCode = "ar");
    Task<IEnumerable<T>> GetLocalizedContentAsync<T>(IEnumerable<T> entities, string languageCode, string defaultLanguageCode = "ar");
    Task<bool> SaveTranslationsAsync<T>(int entityId, Dictionary<string, object> translations);
}
```

### 3. Language Detection Middleware

```csharp
// LanguageMiddleware.cs
public class LanguageMiddleware
{
    public async Task InvokeAsync(HttpContext context)
    {
        var acceptLanguage = context.Request.Headers["Accept-Language"].FirstOrDefault();
        var language = GetLanguageFromHeader(acceptLanguage);
        context.Items["CurrentLanguage"] = language;
        // ... set culture
    }
}
```

## Usage Examples

### 🔍 Getting Localized Content

```csharp
// Controller
[HttpGet("{id}")]
public async Task<ActionResult<Response<PropertyDto>>> GetProperty(int id)
{
    var result = await _propertyService.GetLocalizedPropertyByIdAsync(id);
    return Ok(result);
}
```

### 💾 Saving Translations (Admin)

```csharp
// Admin saves translations
var translations = new Dictionary<string, PropertyTranslationDto>
{
    ["en"] = new PropertyTranslationDto 
    { 
        Title = "Luxury Villa", 
        Description = "Beautiful villa with garden" 
    },
    ["ar"] = new PropertyTranslationDto 
    { 
        Title = "فيلا فاخرة", 
        Description = "فيلا جميلة مع حديقة" 
    }
};

await _propertyService.SavePropertyTranslationsAsync(propertyId, translations);
```

### 🌐 Frontend Integration

```javascript
// Frontend example
const getProperty = async (id) => {
    const response = await fetch(`/api/multilingualproperty/${id}`, {
        headers: {
            'Accept-Language': 'en-US,en;q=0.9,ar;q=0.8'
        }
    });
    return response.json();
};
```

## API Endpoints

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/multilingualproperty/{id}` | Get property with localized content |
| GET | `/api/multilingualproperty` | Get all properties with localized content |
| GET | `/api/multilingualproperty/language-info` | Get current language info |

### Admin Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/multilingualproperty/{id}/translations` | Get property with all translations |
| POST | `/api/multilingualproperty/{id}/translations` | Save translations for property |

## Configuration

### 1. Register Services

```csharp
// Program.cs
builder.Services.AddScoped<IMultilingualService, MultilingualService>();
builder.Services.AddScoped<ILanguageService, LanguageService>();
builder.Services.AddScoped<PropertyServiceMultilingual>();
```

### 2. Add Middleware

```csharp
// Program.cs
app.UseLanguageDetection();
```

### 3. Database Migration

```bash
dotnet ef migrations add AddTranslationTables --project Sadef.Infrastructure --startup-project Sadef.API
dotnet ef database update --project Sadef.Infrastructure --startup-project Sadef.API
```

## Best Practices

### 🎯 Content Management

1. **Always provide fallback content** in the default language (Arabic)
2. **Use consistent terminology** across translations
3. **Consider cultural differences** in content presentation
4. **Validate translations** for completeness

### 🚀 Performance

1. **Use eager loading** for translations: `.Include(p => p.Translations)`
2. **Implement caching** for frequently accessed content
3. **Index translation tables** on LanguageCode and EntityId
4. **Use pagination** for large datasets

### 🔒 Security

1. **Validate language codes** to prevent injection
2. **Implement proper authorization** for admin endpoints
3. **Sanitize user input** in translation content
4. **Log translation changes** for audit purposes

## Real-World Examples

### Airbnb Approach
- Uses translation tables with language-specific URLs
- Implements fallback to English for missing translations
- Caches translations at the application level

### Amazon Approach
- Uses separate translation tables for different content types
- Implements region-specific content variations
- Uses CDN for static translated content

## Migration Strategy

### Phase 1: Database Setup
1. ✅ Create translation entities
2. ✅ Add navigation properties
3. ✅ Update DbContext
4. ⏳ Run database migrations

### Phase 2: Service Layer
1. ✅ Implement MultilingualService
2. ✅ Create LanguageService
3. ✅ Add middleware
4. ⏳ Update existing services

### Phase 3: API Layer
1. ✅ Create multilingual controllers
2. ⏳ Update existing controllers
3. ⏳ Add language detection

### Phase 4: Frontend Integration
1. ⏳ Update frontend to send Accept-Language headers
2. ⏳ Implement language switching UI
3. ⏳ Add RTL support for Arabic

## Troubleshooting

### Common Issues

1. **Translations not loading**: Check if translations are properly saved
2. **Fallback not working**: Verify default language is set correctly
3. **Performance issues**: Ensure proper indexing on translation tables
4. **Language detection**: Check Accept-Language header format

### Debug Tips

```csharp
// Check current language
var currentLang = _languageService.GetCurrentLanguage();
Console.WriteLine($"Current language: {currentLang}");

// Check available translations
var translations = await _context.PropertyTranslations
    .Where(t => t.PropertyId == propertyId)
    .ToListAsync();
```

## Future Enhancements

1. **Add more languages** (French, Spanish, etc.)
2. **Implement translation memory** for consistency
3. **Add machine translation** integration
4. **Implement content versioning** for translations
5. **Add translation workflow** for approval process

## Support

For questions or issues with the multilingual system, please refer to:
- Database schema: `Sadef.Domain/*Translation.cs`
- Service implementation: `Sadef.Application/Services/Multilingual/`
- API controllers: `Sadef.API/Controllers/Multilingual*Controller.cs` 