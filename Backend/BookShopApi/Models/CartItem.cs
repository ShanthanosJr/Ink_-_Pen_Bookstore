using System.Text.Json.Serialization;

namespace BookShopApi.Models;

public class CartItem
{
    public int Id { get; set; }
    
    public int CartId { get; set; }
    
    [JsonIgnore]
    public Cart Cart { get; set; } = null!;
    
    public int BookId { get; set; }
    
    public Book Book { get; set; } = null!;
    
    public int Quantity { get; set; }
    
    // Snapshot of price at time of adding (optional logic, but useful)
    // Though usually cart price is dynamic, having it here simplifies things if needed.
    // For now we will rely on fetching Book Details, but let's keep it simple as per request.
    // The plan said UnitPrice, so we keep it.
    public decimal UnitPrice { get; set; }
}
