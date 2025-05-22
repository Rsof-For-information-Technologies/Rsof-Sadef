using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Sadef.Domain.Constants;

namespace Sadef.Application.DTOs.PropertyDtos
{
    public class PropertyFilterRequest : PaginationRequest
    {
        public string? City { get; set; }
        public string? Location { get; set; }
        public PropertyType? PropertyType { get; set; }
        public PropertyStatus? Status { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
    }

}
