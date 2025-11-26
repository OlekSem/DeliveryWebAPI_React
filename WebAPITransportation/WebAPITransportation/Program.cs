using System.Text.Json;
using Core.Interfaces;
using Core.Services;
using Domain;
using Domain.Entities.Location;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();
builder.Services.AddCors();
builder.Services.AddScoped<ICountryService, CountryService>();
builder.Services.AddScoped<IImageService, ImageService>();
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseNpgsql(connectionString: builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.SuppressModelStateInvalidFilter = true;
});
builder.Services.AddValidatorsFromAssemblies(AppDomain.CurrentDomain.GetAssemblies());

builder.Services.AddMvc(options =>
{
    options.Filters.Add<ValidationFilter>();
});

var app = builder.Build();

app.UseCors(policy =>
    policy.AllowAnyOrigin()
        .AllowAnyMethod()
        .AllowAnyHeader());

// using (var serviceScope = app.Services.CreateScope())
// {
//     var context = serviceScope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
//     context.Database.Migrate();
//     if (!context.Countries.Any())
//     {
//         using (StreamReader r = new StreamReader("./countries.json"))
//         {
//             string json = r.ReadToEnd();
//             List<CountryEntity> items = JsonSerializer.Deserialize<List<CountryEntity>>(json);
//             foreach (CountryEntity item in items)
//             {
//                 Console.WriteLine(JsonSerializer.Serialize(item));
//             }
//             context.Countries.AddRange(items);
//             context.SaveChanges();
//         }
//     }
// }

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.UseSwagger();
app.UseSwaggerUI();
var dirImageName = builder.Configuration.GetValue<string>("DirImageName") ?? "duplo";

// Console.WriteLine("Image dir {0}", dirImageName);
var path = Path.Combine(Directory.GetCurrentDirectory(), dirImageName);
Directory.CreateDirectory(dirImageName);

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(path),
    RequestPath = $"/{dirImageName}"
});
app.Run();