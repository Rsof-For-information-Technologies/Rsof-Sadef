using AutoMapper;
using Sadef.Application.DTOs.BlogDtos;
using Sadef.Application.DTOs.LeadDtos;
using Sadef.Application.DTOs.PropertyDtos;
using Sadef.Application.DTOs.UserDtos;
using Sadef.Application.DTOs.AuditLogDtos;
using Sadef.Application.DTOs.MaintenanceRequestDtos;
using Sadef.Application.DTOs.SeoMetaDtos;
using Sadef.Common.Infrastructure.EFCore.Identity;
using Sadef.Domain.BlogsEntity;
using Sadef.Domain.PropertyEntity;
using Sadef.Domain.LeadEntity;
using Sadef.Common.Domain;
using Sadef.Domain.MaintenanceRequestEntity;
using Sadef.Domain.SeoMetaEntity;

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
                .ForMember(dest => dest.PropertyType, opt => opt.MapFrom(src => src.PropertyType.ToString()))
                .ForMember(dest => dest.VideoUrls, opt => opt.Ignore())
                .ForMember(dest => dest.ImageBase64Strings, opt => opt.Ignore());

            //Blogs
            CreateMap<CreateBlogDto, Blog>();
            CreateMap<UpdateBlogDto, Blog>();
            CreateMap<Blog, BlogDto>();

            //Lead
            CreateMap<CreateLeadDto, Lead>();
            CreateMap<Lead, LeadDto>();
            CreateMap<UpdateLeadDto, Lead>()
            .ForAllMembers(opts =>
                opts.Condition((src, dest, srcMember) => srcMember != null));


            // MaintenanceRequest
            CreateMap<CreateMaintenanceRequestDto, MaintenanceRequest>()
                .ForMember(dest => dest.Images, opt => opt.Ignore())
                .ForMember(dest => dest.Videos, opt => opt.Ignore());
            CreateMap<MaintenanceRequest, MaintenanceRequestDto>();
            CreateMap<UpdateMaintenanceRequestDto, MaintenanceRequest>()
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));

            // Audit Log
            CreateMap<AuditLog, AuditLogDto>();

            // SeoMetaData
            CreateMap<CreateSeoMetaDataDto, SeoMetaData>();
            CreateMap<SeoMetaData, SeoMetaDataDto>();
            CreateMap<UpdateSeoMetaDataDto, SeoMetaData>()
                .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<CreateSeoMetaDetailsDto, SeoMetaData>()
                .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<CreateSeoMetaDetailsDto, CreateSeoMetaDataDto>()
                .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));




        }
    }
}

