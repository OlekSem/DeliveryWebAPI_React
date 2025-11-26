using AutoMapper;
using AutoMapper.QueryableExtensions;
using Core.Interfaces;
using Core.Models.Location;
using Domain;
using Domain.Entities.Location;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Core.Services;

public class CountryService(ApplicationDbContext dbContext, IImageService imageService, IMapper mapper)
    : ICountryService
{
    public async Task<List<CountryItemModel>> GetCountriesAsync()
    {
        var list = await dbContext.Countries.Where(c => c.IsDeleted == false)
            .ProjectTo<CountryItemModel>(mapper.ConfigurationProvider).ToListAsync();
        return list;
    }

    public async Task<CountryItemModel> CreateCountryAsync(CountryCreateModel model)
    {
        var entity = mapper.Map<CountryEntity>(model);
        if (model.Image != null && model.Image.Length > 0)
        {
            entity.Image = await imageService.UploadImageAsync(model.Image);
            await dbContext.Countries.AddAsync(entity);
            await dbContext.SaveChangesAsync();
            var item = mapper.Map<CountryItemModel>(entity);
            return item;
        }

        return null;
    }

    public async Task<CountryItemModel> GetCountryByIdAsync(int id)
    {
        var entity = await dbContext.Countries.Where(c => c.IsDeleted == false && c.Id == id).FirstAsync();
        var item = mapper.Map<CountryItemModel>(entity);
        return item;
    }

    public async Task<CountryItemModel> EditCountryAsync(EditCountryModel model, int id)
    {
        var old = await dbContext.Countries.Where(c => c.Id == id).FirstAsync();
        if (old == null)
            throw new KeyNotFoundException();

        if (model.Image?.Length > 0)
        {
            await imageService.DeleteImageAsync(old.Image);
            old.Image = await imageService.UploadImageAsync(model.Image);
        }

        old.Name = model.Name;
        old.Code = model.Code;
        old.Slug = model.Slug;

        await dbContext.SaveChangesAsync();

        var item = mapper.Map<CountryItemModel>(old);
        return item;
    }

    public async Task DeleteCountryAsync(int id)
    {
        var entity = await dbContext.Countries.FindAsync(id);
        if (entity == null)
        {
            throw new KeyNotFoundException();
        }

        if (entity.IsDeleted == false)
        {
            entity.IsDeleted = true;
        }

        await dbContext.SaveChangesAsync();
    }
}