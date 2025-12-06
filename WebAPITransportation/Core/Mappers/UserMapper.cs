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
    }
}