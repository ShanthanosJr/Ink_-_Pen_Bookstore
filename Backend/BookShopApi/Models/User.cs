using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace BookShopApi.Models;

public class User
{
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(100)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [JsonIgnore]
    public string PasswordHash { get; set; } = string.Empty;

    // Blocked accounts can't log in or use their existing token
    public bool IsActive { get; set; } = true;

    // Password reset: only a hash of the emailed token is stored
    [JsonIgnore]
    public string? PasswordResetTokenHash { get; set; }
    [JsonIgnore]
    public DateTime? PasswordResetExpiresAt { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    [JsonIgnore]
    public Cart? Cart { get; set; }

    public string Role { get; set; } = "User"; // User, Admin
}
