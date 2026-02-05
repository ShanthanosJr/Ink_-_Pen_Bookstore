using System.Text.Json.Serialization;

namespace BookShopApi.Models;

public class DeliveryDetails
{
    public int Id { get; set; }
    
    public int OrderId { get; set; }
    
    [JsonIgnore]
    public Order Order { get; set; } = null!;
    
    public string FullName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string AddressLine { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;
    public string PaymentMethod { get; set; } = "COD"; // COD, Card, Bank Transfer
}
