using Core.Models;
using Domain.Entities.Identity;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace WebAPITransportation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [AllowAnonymous]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<UserEntity> _userManager;
        private readonly IConfiguration _configuration;

        public AuthController(UserManager<UserEntity> userManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _configuration = configuration;
        }

        [HttpPost("google-login")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequest request)
        {
            if (string.IsNullOrEmpty(request.Token))
                return BadRequest("No token");

            GoogleJsonWebSignature.Payload payload;

            try
            {
                payload = await GoogleJsonWebSignature.ValidateAsync(request.Token,
                    new GoogleJsonWebSignature.ValidationSettings
                    {
                        Audience = new[] { _configuration["Google:ClientId"] }
                    });
            }
            catch
            {
                return Unauthorized("Invalid Google token");
            }

            var email = payload.Email;
            var provider = payload.Issuer;
            var key = payload.JwtId;
            var user = await _userManager.FindByEmailAsync(email);
            

            if (user == null)
            {
                user = new UserEntity
                {
                    Email = email,
                    UserName = email,
                    FirstName = payload.GivenName ?? "",
                    LastName = payload.FamilyName ?? "",
                    Image = payload.Picture ?? ""
                };

                var result = await _userManager.CreateAsync(user);
                if (!result.Succeeded)
                    return BadRequest(result.Errors);
            }
            var userLoginGoogle = await _userManager.FindByLoginAsync(provider, key);

            if (userLoginGoogle == null)
            {
                await _userManager.AddLoginAsync(user, new UserLoginInfo(provider, key, "Google"));
            }

            // Optionally, generate your own JWT token here to return to the client
            return Ok(new { user.Id, user.Email, user.FirstName, user.LastName });
        }
    }
}
