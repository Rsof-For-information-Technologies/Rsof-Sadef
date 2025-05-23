using Sadef.Domain.PropertyEntity;
using Sadef.Application.DTOs.PropertyDtos;
namespace Sadef.Application.Utils
{
    public static class PropertyQueryUtils
    {
        public static IQueryable<Property> ApplyFilters(
            this IQueryable<Property> query,
            PropertyFilterRequest request)
        {
            query = query.Where(p => !p.ExpiryDate.HasValue || p.ExpiryDate > DateTime.UtcNow);

            if (!string.IsNullOrWhiteSpace(request.City))
                query = query.Where(p => p.City == request.City);

            if (request.PropertyType.HasValue)
                query = query.Where(p => p.PropertyType == request.PropertyType);

            if (request.Status.HasValue)
                query = query.Where(p => p.Status == request.Status);

            if (request.MinPrice.HasValue)
                query = query.Where(p => p.Price >= request.MinPrice.Value);

            if (request.MaxPrice.HasValue)
                query = query.Where(p => p.Price <= request.MaxPrice.Value);

            return query;
        }
    }
}
