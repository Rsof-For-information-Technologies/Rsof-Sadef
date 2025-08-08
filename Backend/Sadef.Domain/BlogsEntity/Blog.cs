using Sadef.Common.Domain;
using Sadef.Domain.Constants;

namespace Sadef.Domain.BlogsEntity
{
    public class Blog : AggregateRootBase
    {
        public string? CoverImage { get; set; }
        public DateTime PublishedAt { get; set; } = DateTime.UtcNow;
        public bool IsPublished { get; set; }
        public ContentLanguage ContentLanguage { get; set; } = ContentLanguage.English;
        public ICollection<BlogTranslation> Translations { get; set; } = new List<BlogTranslation>();
    }
}
