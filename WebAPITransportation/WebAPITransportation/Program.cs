using System.Text;
using System.Text.Json;
using Bogus;
using Core.interfaces;
using Core.Interfaces;
using Core.Models.Account;
using Core.Services;
using Core.SMTP;
using Domain;
using Domain.Entities;
using Domain.Entities.Identity;
using Domain.Entities.Location;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();
builder.Services.AddCors();
builder.Services.AddHttpContextAccessor();

builder.Services.AddScoped<IAccountService, AccountService>();
builder.Services.AddScoped<ICountryService, CountryService>();
builder.Services.AddScoped<ICityService, CityService>();
builder.Services.AddScoped<IImageService, ImageService>();
builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ISMTPService, SMTPService>();
builder.Services.AddScoped<ICartService, CartService>();
builder.Services.AddScoped<ITransportationService, TransportationService>();

builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString: builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddIdentity<UserEntity, RoleEntity>(options =>
    {
        options.Password.RequireDigit = false;
        options.Password.RequireNonAlphanumeric = false;
        options.Password.RequireLowercase = false;
        options.Password.RequireUppercase = false;
        options.Password.RequiredLength = 6;
        options.Password.RequiredUniqueChars = 1;
    })
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateIssuerSigningKey = true,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });
builder.Services.AddAuthorization();

var assemblyName = typeof(LoginModel).Assembly.GetName().Name;

builder.Services.AddSwaggerGen(opt =>
{
    var fileDoc = $"{assemblyName}.xml";
    var filePath = Path.Combine(AppContext.BaseDirectory, fileDoc);
    opt.IncludeXmlComments(filePath);

    opt.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer"
    });

    opt.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] { }
        }
    });
});

builder.Services.Configure<ApiBehaviorOptions>(options => { options.SuppressModelStateInvalidFilter = true; });
builder.Services.AddValidatorsFromAssemblies(AppDomain.CurrentDomain.GetAssemblies());

builder.Services.AddMvc(options => { options.Filters.Add<ValidationFilter>(); });


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:5173",
                "http://localhost:5174",
                "http://localhost:4173",

                "http://localubuntu",
                "http://www.localubuntu",

                "http://transportation-react.somee.com",
                "http://www.transportation-react.somee.com",
                "http://transferweb.somee.com",
                "http://www.transferweb.somee.com"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

var app = builder.Build();
using (var scoped = app.Services.CreateScope())
{
    var myAppDbContext = scoped.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var roleManager = scoped.ServiceProvider.GetRequiredService<RoleManager<RoleEntity>>();
    myAppDbContext.Database.Migrate(); //якщо ми не робили міграціії

    var roles = new[] { "User", "Admin" };
    foreach (var role in roles)
    {
        if (!await roleManager.RoleExistsAsync(role))
        {
            await roleManager.CreateAsync(new RoleEntity { Name = role });
        }
    }

    if (!myAppDbContext.Users.Any())
    {
        var userManager = scoped.ServiceProvider
            .GetRequiredService<UserManager<UserEntity>>();
        var adminUser = new UserEntity
        {
            UserName = "sasha.sos.06032009@gmail.com",
            Email = "sasha.sos.06032009@gmail.com",
            FirstName = "System",
            LastName = "Administrator",
            Image = "default.webp"
        };
        var result = await userManager.CreateAsync(adminUser, "Admin123");
        if (result.Succeeded)
        {
            await userManager.AddToRoleAsync(adminUser, "Admin");
        }
        int countUsers = 100;
        var faker = new Faker("uk");
        for (int i = 0; i < countUsers; i++)
        {
            var firstName = faker.Name.FirstName();
            var lastName = faker.Name.LastName();
            var email = faker.Internet.Email(firstName, lastName);
            var user = new UserEntity
            {
                UserName = email,
                Email = email,
                FirstName = firstName,
                LastName = lastName,
                Image = "default.jpg"
            };
            var userResult = await userManager.CreateAsync(user, "User123");
            if (userResult.Succeeded)
            {
                await userManager.AddToRoleAsync(user, "User");
            }
        }
    }
}

app.UseHttpsRedirection();
app.UseSwagger();
app.UseSwaggerUI();

app.UseRouting();

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

var dirImageName = builder.Configuration.GetValue<string>("DirImageName") ?? "duplo";

// Console.WriteLine("Image dir {0}", dirImageName);
var path = Path.Combine(Directory.GetCurrentDirectory(), dirImageName);
Directory.CreateDirectory(dirImageName);

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(path),
    RequestPath = $"/{dirImageName}"
});

using (var serviceScope = app.Services.CreateScope())
{
    var context = serviceScope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    await context.Database.MigrateAsync();
    

    // Seed Countries
    if (!context.Countries.Any())
    {
        var countriesJsonPath = Path.Combine(app.Environment.ContentRootPath, "countries.json");
        if (File.Exists(countriesJsonPath))
        {
            var countriesJson = await File.ReadAllTextAsync(countriesJsonPath);
            var countries = JsonSerializer.Deserialize<List<CountryEntity>>(countriesJson, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
            if (countries != null)
            {
                context.Countries.AddRange(countries);
                await context.SaveChangesAsync();
                Console.WriteLine($"{countries.Count} countries added.");
            }
        }
    }

    // Seed Cities
    if (!context.Cities.Any())
    {
        var citiesJsonPath = Path.Combine(app.Environment.ContentRootPath, "cities.json");
        if (File.Exists(citiesJsonPath))
        {
            var citiesJson = await File.ReadAllTextAsync(citiesJsonPath);
            var cities = JsonSerializer.Deserialize<List<CityEntity>>(citiesJson, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
            if (cities != null)
            {
                context.Cities.AddRange(cities);
                await context.SaveChangesAsync();
                Console.WriteLine($"{cities.Count} cities added.");
            }
        }
    }

    // Seed TransportationStatuses
    if (!context.TransportationStatuses.Any())
    {
        var statusesJsonPath = Path.Combine(app.Environment.ContentRootPath, "transportationStatuses.json");
        if (File.Exists(statusesJsonPath))
        {
            var statusesJson = await File.ReadAllTextAsync(statusesJsonPath);
            var statuses = JsonSerializer.Deserialize<List<TransportationStatusEntity>>(statusesJson,
                new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
            if (statuses != null)
            {
                context.TransportationStatuses.AddRange(statuses);
                await context.SaveChangesAsync();
                Console.WriteLine($"{statuses.Count} transportation statuses added.");
            }
        }
    }

    if (!context.Transportations.Any())
    {
        var transportationsJsonPath = Path.Combine(app.Environment.ContentRootPath, "transportations.json");
        if (File.Exists(transportationsJsonPath))
        {
            var transportationsJson = await File.ReadAllTextAsync(transportationsJsonPath);
            var transportations = JsonSerializer.Deserialize<List<TransportationEntity>>(transportationsJson,
                new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

            if (transportations != null)
            {
                // Make sure all DateTimes are UTC
                foreach (var t in transportations)
                {
                    t.DepartureTime = DateTime.SpecifyKind(t.DepartureTime, DateTimeKind.Utc);
                    t.ArrivalTime = DateTime.SpecifyKind(t.ArrivalTime, DateTimeKind.Utc);
                }

                context.Transportations.AddRange(transportations);
                await context.SaveChangesAsync();
                Console.WriteLine($"{transportations.Count} transportations added.");
            }
        }
    }

    // var emailService = serviceScope.ServiceProvider.GetRequiredService<ISMTPService>();
    // EmailMessage message = new EmailMessage
    // {
    //     Subject = "Transportation Project",
    //     Body = "Your website has been started!",
    //     To = builder.Configuration.GetValue<string>("UserEmail"),
    // };
}

app.Run();