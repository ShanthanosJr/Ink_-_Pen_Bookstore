using System.Text.Json.Serialization;

namespace BookShopApi.Models;

public class OrderItem
{
    public int Id { get; set; }
    
    public int OrderId { get; set; }
    
    [JsonIgnore]
    public Order Order { get; set; } = null!;
    
    public int BookId { get; set; }
    
    // We might keep a reference to Book, but even if Book is deleted, the Order should arguably persist history.
    // For simplicity with EF, we link it.
    public Book Book { get; set; } = null!;
    
    public int Quantity { get; set; }
    
    public decimal UnitPrice { get; set; }
}
