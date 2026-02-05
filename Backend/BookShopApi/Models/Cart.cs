using System.Text.Json.Serialization;

namespace BookShopApi.Models;

public class Cart
{
    public int Id { get; set; }
    
    public int UserId { get; set; }
    
    [JsonIgnore] // Prevent cycles
    public User User { get; set; } = null!;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public List<CartItem> Items { get; set; } = new List<CartItem>();
}
