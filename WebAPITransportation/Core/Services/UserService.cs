using AutoMapper;
using AutoMapper.QueryableExtensions;
using Core.interfaces;
using Core.Interfaces;
using Core.Models.Account;
using Domain;
using Microsoft.EntityFrameworkCore;

namespace Core.Services;

public class UserService(IAuthService authService, 
    ApplicationDbContext transferContext,
    IMapper mapper) : IUserService
{
    public async Task<UserProfileModel> GetUserProfileAsync()
    {
        var userId = await authService.GetUserIdAsync();
        Console.WriteLine(userId);
        
        var profile = await transferContext.Users
            .ProjectTo<UserProfileModel>(mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(u => u.Id == userId!);

        return profile!;
    }
}