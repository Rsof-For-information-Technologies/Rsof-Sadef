using Sadef.Common.Domain;

namespace Sadef.Domain.BlogsEntity
{
    public class Blog : AggregateRootBase
    {
        public required string Title { get; set; }
        public required string Content { get; set; }
        public string? CoverImage { get; set; }
        public DateTime PublishedAt { get; set; } = DateTime.UtcNow;
        public bool IsPublished { get; set; }
    }

}
