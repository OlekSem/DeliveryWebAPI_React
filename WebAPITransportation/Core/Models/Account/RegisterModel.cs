using Microsoft.AspNetCore.Http;

namespace Core.Models.Account;

public class RegisterModel
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public string ConfirmPassword { get; set; }
    public IFormFile Image { get; set; }
    public string Phone { get; set; }
}