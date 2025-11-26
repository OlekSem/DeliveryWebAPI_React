using AutoMapper;
using Core.Models.Location;
using Domain.Entities.Location;

namespace Core.Mappers;

public class CountryMapper : Profile
{
    public CountryMapper()
    {
        CreateMap<EditCountryModel, CountryEntity>().ForMember(s => s.Image, d => d.Ignore());
        CreateMap<CountryEntity, EditCountryModel>().ForMember(s => s.Image, d => d.Ignore());
        CreateMap<CountryEntity, CountryItemModel>();
        CreateMap<CountryCreateModel, CountryEntity>().ForMember(c => c.Image, opt => opt.Ignore());
    }
}