using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Sadef.Domain.Constants;

namespace Sadef.Application.DTOs.PropertyDtos
{
    public class UpdatePropertyDto
    {
        public int Id { get; set; }
        public  string Title { get; set; }
        public  string Description { get; set; }
        public  decimal Price { get; set; }
        public PropertyType PropertyType { get; set; }
        public  string City { get; set; }
        public  string Location { get; set; }
        public  double AreaSize { get; set; }
        public int? Bedrooms { get; set; }
        public int? Bathrooms { get; set; }
        public List<IFormFile>? Images { get; set; }
    }
}
