namespace Core.interfaces;

public interface IAuthService
{
    Task<int> GetUserIdAsync();
}