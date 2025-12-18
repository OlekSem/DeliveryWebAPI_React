using AutoMapper;
using Core.Interfaces;
using Core.Models.Account;
using Domain.Entities.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace WebAPITransportation.Controllers;

[Route("api/[controller]/[action]")]
[ApiController]
public class AccountController(
    UserManager<UserEntity> userManager,
    IJwtTokenService jwtTokenService,
    IMapper mapper,
    IImageService imageService,
    IUserService userService) : ControllerBase
{
    [HttpPost]
    [HttpPost]
    public async Task<IActionResult> Login([FromBody] LoginModel model)
    {
        var user = await userManager.FindByEmailAsync(model.Email);
        if (user == null || !await userManager.CheckPasswordAsync(user, model.Password))
        {
            return Unauthorized("Invalid email or password.");
        }

        var token = await jwtTokenService.CreateAsync(user);
        return Ok(new { token });
    }

    [HttpPost]
    public async Task<IActionResult> Register([FromForm] RegisterModel model)
    {
        var user = mapper.Map<UserEntity>(model);
        if (user.Email == string.Empty)
        {
            return Unauthorized("Invalid email or password.");
        }

        if (model.Image.Length > 0)
        {
            user.Image = await imageService.UploadImageAsync(model.Image);
        }

        var result = await userManager.CreateAsync(user, model.Password);
        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        var token = await jwtTokenService.CreateAsync(user);
        return Ok(new { token });
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetProfile()
    {
        var model = await userService.GetUserProfileAsync();
        Console.WriteLine(model.Email);
        return Ok(model);
    }

    [HttpPost]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordModel model)
    {
        bool res = await userService.ForgotPasswordAsync(model);
        if (res)
            return Ok();
        return BadRequest(new
        {
            Status = 400,
            IsValid = false,
            Errors = new { Email = "Користувача з такою поштою не існує" }
        });
    }
    
    [HttpPost]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordModel model)
    {
        var isTry =  await userService.ResetPasswordAsync(model);
        if (!isTry)
        {
            return BadRequest(new
            {
                Status = 400,
                IsValid = false,
                Errors = new { Email = "Невірні дані для відновлення паролю" }
            });
        }
        return Ok();
    }
}