using AutoMapper;
using Sadef.Application.DTOs.BlogDtos;
using Sadef.Application.DTOs.LeadDtos;
using Sadef.Application.DTOs.PropertyDtos;
using Sadef.Application.DTOs.UserDtos;
using Sadef.Application.DTOs.AuditLogDtos;
using Sadef.Application.DTOs.MaintenanceRequestDtos;
using Sadef.Application.DTOs.ContactDtos;
using Sadef.Common.Infrastructure.EFCore.Identity;
using Sadef.Domain.BlogsEntity;
using Sadef.Domain.PropertyEntity;
using Sadef.Domain.LeadEntity;
using Sadef.Domain.ContactEntity;
using Sadef.Common.Domain;
using Sadef.Domain.MaintenanceRequestEntity;

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
               .ForMember(dest => dest.Videos, opt => opt.Ignore())
               .ForMember(dest => dest.Translations, opt => opt.Ignore());

            CreateMap<UpdatePropertyDto, Property>()
                .ForMember(dest => dest.Images, opt => opt.Ignore())
                .ForMember(dest => dest.Videos, opt => opt.Ignore())
                .ForMember(dest => dest.Translations, opt => opt.Ignore());

            CreateMap<Property, PropertyDto>()
                .ForMember(dest => dest.PropertyType, opt => opt.MapFrom(src => src.PropertyType))
                .ForMember(dest => dest.VideoUrls, opt => opt.Ignore())
                .ForMember(dest => dest.ImageUrls, opt => opt.Ignore());

            //Blogs
            CreateMap<CreateBlogDto, Blog>()
                .ForMember(dest => dest.Translations, opt => opt.Ignore());

            CreateMap<UpdateBlogDto, Blog>()
                .ForMember(dest => dest.Translations, opt => opt.Ignore());

            CreateMap<Blog, BlogDto>()
                .ForMember(dest => dest.Title, opt => opt.Ignore()) 
                .ForMember(dest => dest.Content, opt => opt.Ignore())
                .ForMember(dest => dest.MetaTitle, opt => opt.Ignore()) 
                .ForMember(dest => dest.MetaDescription, opt => opt.Ignore()) 
                .ForMember(dest => dest.MetaKeywords, opt => opt.Ignore()) 
                .ForMember(dest => dest.Slug, opt => opt.Ignore()) 
                .ForMember(dest => dest.CanonicalUrl, opt => opt.Ignore()) 
                .ForMember(dest => dest.Translations, opt => opt.Ignore())
                .ForMember(dest => dest.TranslationsJson, opt => opt.Ignore()); 

            //Lead
            CreateMap<CreateLeadDto, Lead>();
            CreateMap<Lead, LeadDto>()
                .ForMember(dest => dest.PropertyName, opt => opt.Ignore()); 
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

            // Contact
            CreateMap<CreateContactDto, Sadef.Domain.ContactEntity.Contact>();
            CreateMap<Sadef.Domain.ContactEntity.Contact, ContactDto>()
                .ForMember(dest => dest.PropertyTitle, opt => opt.Ignore()); 
            CreateMap<UpdateContactDto, Sadef.Domain.ContactEntity.Contact>()
                .ForAllMembers(opts =>
                    opts.Condition((src, dest, srcMember) => srcMember != null));

        }
    }
}

