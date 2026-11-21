using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using BookShopApi.Data;
using BookShopApi.Models;
using BookShopApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace BookShopApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private static readonly TimeSpan ResetTokenLifetime = TimeSpan.FromHours(1);

    private readonly BookShopContext _context;
    private readonly IAuthService _authService;
    private readonly IEmailSender _email;
    private readonly ShopSettings _shop;
    private readonly IConfiguration _config;

    public AuthController(BookShopContext context, IAuthService authService, IEmailSender email, IOptions<ShopSettings> shop,
        IConfiguration config)
    {
        _config = config;
        _context = context;
        _authService = authService;
        _email = email;
        _shop = shop.Value;
    }

    private static UserProfileDto ToProfile(User user) => new()
    {
        FullName = user.FullName,
        Email = user.Email,
        Role = user.Role,
        CreatedAt = user.CreatedAt
    };

    private static string Normalise(string email) => email.Trim().ToLowerInvariant();

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto request)
    {
        var email = Normalise(request.Email);
        if (await _context.Users.AnyAsync(u => u.Email.ToLower() == email))
        {
            return BadRequest("An account with this email already exists.");
        }

        var user = new User
        {
            FullName = request.FullName.Trim(),
            Email = email,
            PasswordHash = _authService.HashPassword(request.Password),
            // Everyone signs up as a customer. Admins are promoted by another admin
            // (Admin > Customers) or listed in Admin:BootstrapEmails in configuration.
            Role = IsBootstrapAdmin(email) ? "Admin" : "User"
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Registration successful" });
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login(LoginDto request)
    {
        var email = Normalise(request.Email);
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == email);

        if (user == null || !_authService.VerifyPassword(request.Password, user.PasswordHash))
        {
            return BadRequest("Invalid email or password.");
        }
        if (!user.IsActive)
        {
            return BadRequest("This account has been suspended. Please contact us if you think this is a mistake.");
        }

        return Ok(new AuthResponseDto
        {
            Token = _authService.CreateToken(user),
            User = ToProfile(user)
        });
    }

    [HttpGet("profile")]
    [Authorize]
    public async Task<ActionResult<UserProfileDto>> GetProfile()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return NotFound();
        return Ok(ToProfile(user));
    }

    [HttpPut("profile")]
    [Authorize]
    public async Task<ActionResult<UserProfileDto>> UpdateProfile(UpdateProfileDto request)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return NotFound();

        user.FullName = request.FullName.Trim();
        await _context.SaveChangesAsync();
        return Ok(ToProfile(user));
    }

    // POST api/auth/change-password
    [HttpPost("change-password")]
    [Authorize]
    public async Task<IActionResult> ChangePassword(ChangePasswordDto request)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return NotFound();

        if (!_authService.VerifyPassword(request.CurrentPassword, user.PasswordHash))
            return BadRequest("Your current password is incorrect.");

        user.PasswordHash = _authService.HashPassword(request.NewPassword);
        user.PasswordResetTokenHash = null;
        user.PasswordResetExpiresAt = null;
        await _context.SaveChangesAsync();
        return Ok(new { message = "Password changed." });
    }

    // POST api/auth/forgot-password
    // Always answers the same way so it can't be used to find out which emails have accounts.
    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword(ForgotPasswordDto request)
    {
        var email = Normalise(request.Email);
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == email);

        if (user != null && user.IsActive)
        {
            var token = Convert.ToHexString(RandomNumberGenerator.GetBytes(32)).ToLowerInvariant();
            user.PasswordResetTokenHash = HashToken(token);
            user.PasswordResetExpiresAt = DateTime.UtcNow.Add(ResetTokenLifetime);
            await _context.SaveChangesAsync();

            var link = $"{_shop.FrontendBaseUrl.TrimEnd('/')}/reset-password?email={Uri.EscapeDataString(user.Email)}&token={token}";
            await _email.SendAsync(user.Email, "Reset your Ink & Pens password",
                $"Hello {user.FullName},\n\nWe received a request to reset your password. Open this link within the next hour to choose a new one:\n\n{link}\n\nIf you didn't ask for this, you can ignore this email and your password will stay the same.\n\nInk & Pens");
        }

        return Ok(new { message = "If an account exists for that email, we've sent a link to reset the password." });
    }

    // POST api/auth/reset-password
    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword(ResetPasswordDto request)
    {
        var email = Normalise(request.Email);
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == email);

        var valid = user != null
            && user.PasswordResetTokenHash != null
            && user.PasswordResetExpiresAt > DateTime.UtcNow
            && CryptographicOperations.FixedTimeEquals(
                Encoding.ASCII.GetBytes(user.PasswordResetTokenHash),
                Encoding.ASCII.GetBytes(HashToken(request.Token.Trim())));

        if (!valid)
            return BadRequest("This reset link is invalid or has expired. Please request a new one.");

        user!.PasswordHash = _authService.HashPassword(request.NewPassword);
        user.PasswordResetTokenHash = null;
        user.PasswordResetExpiresAt = null;
        await _context.SaveChangesAsync();
        return Ok(new { message = "Password updated. You can now log in." });
    }

    private bool IsBootstrapAdmin(string email) =>
        (_config.GetSection("Admin:BootstrapEmails").Get<string[]>() ?? Array.Empty<string>())
            .Any(e => string.Equals(e.Trim(), email, StringComparison.OrdinalIgnoreCase));

    private static string HashToken(string token) =>
        Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(token)));
}

public class UpdateProfileDto
{
    [Required, MaxLength(100)]
    public string FullName { get; set; } = string.Empty;
}

public class ChangePasswordDto
{
    [Required]
    public string CurrentPassword { get; set; } = string.Empty;

    [Required, MinLength(6, ErrorMessage = "The new password must be at least 6 characters.")]
    public string NewPassword { get; set; } = string.Empty;
}

public class ForgotPasswordDto
{
    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;
}

public class ResetPasswordDto
{
    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Token { get; set; } = string.Empty;

    [Required, MinLength(6, ErrorMessage = "The new password must be at least 6 characters.")]
    public string NewPassword { get; set; } = string.Empty;
}
