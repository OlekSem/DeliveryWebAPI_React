using Core.Interfaces;
using Core.Models.Location;
using Core.Services;
using Domain;
using Domain.Entities.Location;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace WebAPITransportation.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CountriesController(ApplicationDbContext dbContext, ICountryService countryService) : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetCountries()
    {
        var countries = await countryService.GetCountriesAsync();
        return Ok(countries);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateCountry([FromForm] CountryCreateModel model)
    {
        var item = await countryService.CreateCountryAsync(model);
        return CreatedAtAction(nameof(GetCountries), new { id = item.Id }, item);
    }

    [HttpGet("edit/{id}")]
    public async Task<IActionResult> EditCountry(int id)
    {
        var item = await countryService.GetCountryByIdAsync(id);
        if (item == null)
        {
            return NotFound();
        }
        return Ok(item);
    }
    
    [HttpPut("edit/{id}")]
    public async Task<IActionResult> EditCountry([FromForm] EditCountryModel model)
    {
        if (model == null)
        {
            return BadRequest("model is null");
        }
        var res = await countryService.EditCountryAsync(model, model.Id);
        if (res == null)
        {
            return NotFound();
        }
        return Ok(res);
    }

    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> DeleteCountry(int id)
    {
        await countryService.DeleteCountryAsync(id);
        return Ok();
    }
}