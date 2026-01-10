using AutoMapper;
using Core.Models.Account;
using Domain.Entities.Identity;

namespace Core.Mappers;

public class UserMapper : Profile
{
    public UserMapper()
    {
        CreateMap<UserEntity, UserProfileModel>()
            .ForMember(x => x.FullName, opt => opt.MapFrom(x => $"{x.LastName} {x.FirstName}"))
            .ForMember(x => x.Phone, opt => opt.MapFrom(x => x.PhoneNumber));
        CreateMap<RegisterModel, UserEntity>()
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Email))
            .ForMember(dest => dest.Image, opt => opt.Ignore());
        CreateMap<UserEntity, UserItemModel>()
            .ForMember(x => x.FullName, opt => opt.MapFrom(x => $"{x.LastName} {x.FirstName}"))
            .ForMember(dest => dest.Roles, opt => opt.MapFrom(src => src.UserRoles!.Select(ur => ur.Role.Name).ToList()));
        CreateMap<GoogleAccountModel, UserEntity>()
            .ForMember(x => x.Image, opt => opt.Ignore())
            .ForMember(x => x.UserName, opt => opt.MapFrom(x => x.Email));
    }
}