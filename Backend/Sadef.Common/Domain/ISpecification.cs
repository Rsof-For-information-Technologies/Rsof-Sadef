using System.Linq.Expressions;

namespace Sadef.Common.Domain
{

    public interface ISpecification<T>
    {
        Expression<Func<T, bool>> Exression { get; }
        List<Expression<Func<T, object>>> Includes { get; }
    }
}

