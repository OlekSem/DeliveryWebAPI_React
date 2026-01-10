using System.Text.Json;
using Domain.Entities;
using Domain.Entities.Identity;
using Domain.Entities.Location;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Domain;

public class ApplicationDbContext : IdentityDbContext<UserEntity, RoleEntity, int,
    IdentityUserClaim<int>, UserRoleEntity, IdentityUserLogin<int>,
    IdentityRoleClaim<int>, IdentityUserToken<int>>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }
    public DbSet<CountryEntity> Countries { get; set; }
    public DbSet<CityEntity> Cities { get; set; }
    public DbSet<TransportationStatusEntity> TransportationStatuses { get; set; }
    public DbSet<TransportationEntity> Transportations { get; set; }
    public DbSet<CartEntity> Carts { get; set; }
    
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<UserRoleEntity>()
            .HasOne(ur => ur.User)
            .WithMany(u => u.UserRoles)
            .HasForeignKey(ur => ur.UserId);

        builder.Entity<UserRoleEntity>()
            .HasOne(ur => ur.Role)
            .WithMany(u => u.UserRoles)
            .HasForeignKey(ur => ur.RoleId);
        
        builder.Entity<CityEntity>()
            .HasMany(c => c.Departures)
            .WithOne(t => t.FromCity)
            .HasForeignKey(t => t.FromCityId);

        builder.Entity<CityEntity>()
            .HasMany(c => c.Arrivals)
            .WithOne(t => t.ToCity)
            .HasForeignKey(t => t.ToCityId);
        
        builder.Entity<CartEntity>()
            .HasKey(pi => new { pi.TransportationId, pi.UserId });
    }

}