using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sadef.Application.DTOs.BlogDtos
{
    public class UpdateBlogDto : CreateBlogDto
    {
        public int Id { get; set; }
    }
}
