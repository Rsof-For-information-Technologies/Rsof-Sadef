using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Sadef.Common.Domain;

namespace Sadef.Domain.PropertyEntity
{
    public class PropertyVideo : AggregateRootBase
    {
        public string VideoUrl { get; set; }
        public string ContentType { get; set; }
        public int PropertyId { get; set; }
        public Property Property { get; set; }
    }

}
