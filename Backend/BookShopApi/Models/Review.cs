using System.Text.Json.Serialization;

namespace BookShopApi.Models;

public class Review
{
    public int Id { get; set; }

    public int BookId { get; set; }
    [JsonIgnore]
    public Book Book { get; set; } = null!;

    public int UserId { get; set; }
    [JsonIgnore]
    public User User { get; set; } = null!;

    // 1-5
    public int Rating { get; set; }
    public string? Title { get; set; }
    public string Body { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
