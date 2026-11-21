namespace BookShopApi.Models;

public class Coupon
{
    public int Id { get; set; }

    // Stored upper-case; matched case-insensitively
    public string Code { get; set; } = string.Empty;

    // 0-100
    public decimal PercentOff { get; set; }

    // Only valid if the customer has no previous (non-cancelled, non-rejected) orders
    public bool FirstOrderOnly { get; set; }

    public decimal MinSubtotal { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime? ExpiresAt { get; set; }
}
