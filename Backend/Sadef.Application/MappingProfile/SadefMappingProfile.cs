using AutoMapper;
using Sadef.Application.DTOs.PropertyDtos;
using Sadef.Application.DTOs.UserDtos;
using Sadef.Common.Infrastructure.EFCore.Identity;
using Sadef.Domain.PropertyEntity;

namespace Sadef.Application.MappingProfile
{
    public class SadefMappingProfile : Profile
    {
        public SadefMappingProfile()
        {

            //User
            CreateMap<ApplicationUser, UserResultDTO>();

            //Property
            CreateMap<CreatePropertyDto, Property>()
               .ForMember(dest => dest.Images, opt => opt.Ignore())
               .ForMember(dest => dest.Videos, opt => opt.Ignore());

            CreateMap<UpdatePropertyDto, Property>()
                .ForMember(dest => dest.Images, opt => opt.Ignore())
                .ForMember(dest => dest.Videos, opt => opt.Ignore());

            CreateMap<Property, PropertyDto>()
                .ForMember(dest => dest.IsExpired, opt => opt.MapFrom(src => src.ExpiryDate.HasValue && src.ExpiryDate.Value <= DateTime.UtcNow));

        }
    }
}

