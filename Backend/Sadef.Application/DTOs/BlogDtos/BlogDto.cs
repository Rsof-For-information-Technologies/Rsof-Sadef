using Sadef.Application.DTOs.SeoMetaDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sadef.Application.DTOs.BlogDtos
{
    public class BlogDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string? CoverImage { get; set; }
        public DateTime PublishedAt { get; set; }
        public bool IsPublished { get; set; }
        public SeoMetaDataDto? SeoMeta { get; set; }
    }
}
