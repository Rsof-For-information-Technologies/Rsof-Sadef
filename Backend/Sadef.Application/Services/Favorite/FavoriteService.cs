using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Sadef.Application.Abstractions.Interfaces;
using Sadef.Application.DTOs.PropertyDtos;
using Sadef.Common.Domain;
using Sadef.Common.Infrastructure.Wrappers;
using Sadef.Domain.PropertyEntity;

namespace Sadef.Application.Services.Favorites
{
    public class FavoriteService : IFavoriteService
    {
        private readonly IUnitOfWorkAsync _uow;
        private readonly IQueryRepositoryFactory _queryFactory;
        private readonly IMapper _mapper;

        public FavoriteService(IUnitOfWorkAsync uow, IQueryRepositoryFactory queryFactory, IMapper mapper)
        {
            _uow = uow;
            _queryFactory = queryFactory;
            _mapper = mapper;
        }

        public async Task<Response<string>> AddFavoriteAsync(string userId, int propertyId)
        {
            var exists = await _queryFactory.QueryRepository<FavoriteProperty>()
                .Queryable()
                .AnyAsync(f => f.UserId == userId && f.PropertyId == propertyId);

            if (exists)
                return new Response<string>("Property already favorited");

            var favorite = new FavoriteProperty
            {
                UserId = userId,
                PropertyId = propertyId
            };

            await _uow.RepositoryAsync<FavoriteProperty>().AddAsync(favorite);
            await _uow.SaveChangesAsync(CancellationToken.None);
            return new Response<string>("Property added to favorites");
        }

        public async Task<Response<string>> RemoveFavoriteAsync(string userId, int propertyId)
        {
            var repo = _queryFactory.QueryRepository<FavoriteProperty>();
            var favorite = await repo
                .Queryable()
                .FirstOrDefaultAsync(f => f.UserId == userId && f.PropertyId == propertyId);

            if (favorite == null)
                return new Response<string>("Favorite not found");

            await _uow.RepositoryAsync<FavoriteProperty>().DeleteAsync(favorite);
            await _uow.SaveChangesAsync(CancellationToken.None);
            return new Response<string>("Property removed from favorites");
        }

        public async Task<Response<List<PropertyDto>>> GetUserFavoritesAsync(string userId)
        {
            var favorites = await _queryFactory.QueryRepository<FavoriteProperty>()
                .Queryable()
                .Include(f => f.Property)
                    .ThenInclude(p => p.Images)
                .Include(f => f.Property)
                    .ThenInclude(p => p.Videos)
                .Where(f => f.UserId == userId)
                .ToListAsync();

            var propertyDtos = favorites.Select(f =>
            {
                var dto = _mapper.Map<PropertyDto>(f.Property);
                dto.ImageBase64Strings = f.Property.Images?.Select(img =>
                    $"data:{img.ContentType};base64,{Convert.ToBase64String(img.ImageData)}").ToList() ?? new();
                dto.VideoUrls = f.Property.Videos?.Select(vid =>
                    $"data:{vid.ContentType};base64,{Convert.ToBase64String(vid.VideoData)}").ToList() ?? new();
                return dto;
            }).ToList();

            return new Response<List<PropertyDto>>(propertyDtos, "Favorites loaded");
        }
    }
}
