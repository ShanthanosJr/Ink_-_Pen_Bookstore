using System.Text.Json.Serialization;

namespace BookShopApi.Models;

public class Order
{
    public int Id { get; set; }
    
    public int UserId { get; set; }
    
    [JsonIgnore]
    public User User { get; set; } = null!;
    
    public decimal TotalAmount { get; set; }
    
    // Status: Pending, Processing, Shipped, Delivered
    public string OrderStatus { get; set; } = "Pending";
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public List<OrderItem> Items { get; set; } = new List<OrderItem>();
    
    public DeliveryDetails DeliveryDetails { get; set; } = null!;
}
