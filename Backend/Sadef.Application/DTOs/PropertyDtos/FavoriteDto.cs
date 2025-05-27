using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sadef.Application.DTOs.PropertyDtos
{
    public class FavoriteDto
    {
        public int Id { get; set; } 
        public int PropertyId { get; set; }
        public PropertyDto Property { get; set; }
    }
}
