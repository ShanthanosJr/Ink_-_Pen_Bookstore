using System.Text.Json.Serialization;

namespace BookShopApi.Models;

/// <summary>One entry in an order's timeline: a status change or a payment/admin note.</summary>
public class OrderStatusHistory
{
    public int Id { get; set; }

    public int OrderId { get; set; }

    [JsonIgnore]
    public Order Order { get; set; } = null!;

    public string Status { get; set; } = string.Empty;

    public string? Note { get; set; }

    // Customer, Admin, PayHere, System
    public string ChangedBy { get; set; } = "System";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
