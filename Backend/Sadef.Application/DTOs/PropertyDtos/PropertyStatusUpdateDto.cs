using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Sadef.Domain.Constants;

namespace Sadef.Application.DTOs.PropertyDtos
{
    public class PropertyStatusUpdateDto
    {
        public int Id { get; set; }
        public PropertyStatus status { get; set; }
    }
}
