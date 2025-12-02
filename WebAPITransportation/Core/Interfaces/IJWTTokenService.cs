using Domain.Entities.Identity;

public interface IJwtTokenService
{
    Task<string> CreateAsync(UserEntity user);
}