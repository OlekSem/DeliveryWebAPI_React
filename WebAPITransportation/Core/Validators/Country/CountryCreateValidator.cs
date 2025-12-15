using Core.Models.Location;
using Domain;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Core.Validators.Country;

public class CountryCreateValidator : AbstractValidator<CountryCreateModel>
{ 
    public CountryCreateValidator(ApplicationDbContext db)
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name of country must not be empty")
            .MaximumLength(100).WithMessage("Name of country must not exceed 100 characters")
            .DependentRules(() =>
            {
                RuleFor(x => x.Name)
                    .MustAsync(async (name, cancellation) =>
                        !await db.Countries.AnyAsync(c => c.Name.ToLower() == name.ToLower().Trim() && c.IsDeleted == false, cancellation))
                    .WithMessage("A country with that name already exists.");
            });

        RuleFor(x => x.Code)
            .NotEmpty().WithMessage("Code of country must not be empty")
            .MaximumLength(10).WithMessage("Code of country must not exceed 10 characters")
            .DependentRules(() =>
            {
                RuleFor(x => x.Code)
                    .MustAsync(async (code, cancellation) =>
                        !await db.Countries.AnyAsync(c => c.Code.ToLower() == code.ToLower().Trim() && c.IsDeleted == false, cancellation))
                    .WithMessage("A country with that code already exists.");
            });

        RuleFor(x => x.Slug)
            .NotEmpty().WithMessage("Slug of country must not be empty")
            .MaximumLength(100).WithMessage("Slug of country must not exceed 100 characters")
            .DependentRules(() =>
            {
                RuleFor(x => x.Slug)
                    .MustAsync(async (slug, cancellation) =>
                        !await db.Countries.AnyAsync(c => c.Slug.ToLower() == slug.ToLower().Trim() && c.IsDeleted == false, cancellation))
                    .WithMessage("A country with that slug already exists.");
            });

        RuleFor(x => x.Image)
            .NotEmpty().WithMessage("File of country must not be empty");
    }
}
