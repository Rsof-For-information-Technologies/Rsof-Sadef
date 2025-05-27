using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Sadef.Common.Domain;

namespace Sadef.Domain.PropertyEntity
{
    public class FavoriteProperty : AggregateRootBase
    {
        public string UserId { get; set; }
        public int PropertyId { get; set; }

        public Property Property { get; set; }
    }

}
