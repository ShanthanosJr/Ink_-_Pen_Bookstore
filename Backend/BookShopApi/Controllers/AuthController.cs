using System.Security.Claims;
using BookShopApi.Data;
using BookShopApi.Models;
using BookShopApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookShopApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly BookShopContext _context;
    private readonly IAuthService _authService;

    public AuthController(BookShopContext context, IAuthService authService)
    {
        _context = context;
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<User>> Register(RegisterDto request)
    {
        if (await _context.Users.AnyAsync(u => u.Email == request.Email))
        {
            return BadRequest("User already exists.");
        }

        var user = new User
        {
            FullName = request.FullName,
            Email = request.Email,
            PasswordHash = _authService.HashPassword(request.Password)
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Registration successful" });
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login(LoginDto request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user == null || !_authService.VerifyPassword(request.Password, user.PasswordHash))
        {
            return BadRequest("Invalid email or password.");
        }

        var token = _authService.CreateToken(user);

        return Ok(new AuthResponseDto
        {
            Token = token,
            User = new UserProfileDto
            {
                FullName = user.FullName,
                Email = user.Email,
                CreatedAt = user.CreatedAt
            }
        });
    }

    [HttpGet("profile")]
    [Authorize]
    public async Task<ActionResult<UserProfileDto>> GetProfile()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var user = await _context.Users.FindAsync(userId);

        if (user == null) return NotFound();

        return Ok(new UserProfileDto
        {
            FullName = user.FullName,
            Email = user.Email,
            CreatedAt = user.CreatedAt
        });
    }

    [HttpPut("profile")]
    [Authorize]
    public async Task<ActionResult<UserProfileDto>> UpdateProfile(UserProfileDto request)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var user = await _context.Users.FindAsync(userId);

        if (user == null) return NotFound();

        user.FullName = request.FullName;
        // Optionally allow email update, but usually requires more logic (verification, uniqueness check)
        // user.Email = request.Email; 

        await _context.SaveChangesAsync();

        return Ok(new UserProfileDto
        {
            FullName = user.FullName,
            Email = user.Email,
            CreatedAt = user.CreatedAt
        });
    }
}
