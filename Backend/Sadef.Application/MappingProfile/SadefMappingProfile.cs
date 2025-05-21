using AutoMapper;
using Sadef.Application.DTOs.UserDtos;
using Sadef.Common.Infrastructure.EFCore.Identity;

namespace Sadef.Application.MappingProfile
{
    public class SadefMappingProfile : Profile
    {
        public SadefMappingProfile()
        {

            //User
            CreateMap<ApplicationUser, UserResultDTO>();
        }
    }
}

