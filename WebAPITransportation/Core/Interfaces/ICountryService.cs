using Core.Models.Location;

namespace Core.Interfaces;

public interface ICountryService
{
    Task<List<CountryItemModel>> GetCountriesAsync();
    Task<CountryItemModel> CreateCountryAsync(CountryCreateModel model);
    Task<CountryItemModel> EditCountryAsync(EditCountryModel model, int id);
    Task<CountryItemModel> GetCountryByIdAsync(int id);
    Task DeleteCountryAsync(int id);
}