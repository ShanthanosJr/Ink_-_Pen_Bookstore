using BookShopApi.Data;
using BookShopApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace BookShopApi.Services;

public class PriceQuote
{
    public decimal Subtotal { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal ShippingFee { get; set; }
    public decimal Total { get; set; }

    // Normalised code when the coupon was applied
    public string? CouponCode { get; set; }
    // Set when a coupon was supplied but could not be applied
    public string? CouponError { get; set; }

    public decimal FreeShippingThreshold { get; set; }
    // How much more the customer needs to spend for free shipping (0 when already free)
    public decimal AmountToFreeShipping { get; set; }
}

public interface IPricingService
{
    Task<PriceQuote> QuoteAsync(int userId, IEnumerable<CartItem> items, string? couponCode);
}

/// <summary>Single source of truth for order totals, used by both the checkout quote and checkout itself.</summary>
public class PricingService : IPricingService
{
    private readonly BookShopContext _context;
    private readonly ShopSettings _settings;

    public PricingService(BookShopContext context, IOptions<ShopSettings> settings)
    {
        _context = context;
        _settings = settings.Value;
    }

    public async Task<PriceQuote> QuoteAsync(int userId, IEnumerable<CartItem> items, string? couponCode)
    {
        var quote = new PriceQuote
        {
            Subtotal = Round(items.Sum(i => i.Quantity * i.UnitPrice)),
            FreeShippingThreshold = _settings.FreeShippingThreshold
        };

        if (!string.IsNullOrWhiteSpace(couponCode))
        {
            var (coupon, error) = await ValidateCouponAsync(userId, couponCode, quote.Subtotal);
            if (coupon != null)
            {
                quote.CouponCode = coupon.Code;
                quote.DiscountAmount = Round(quote.Subtotal * coupon.PercentOff / 100m);
            }
            else
            {
                quote.CouponError = error;
            }
        }

        var discounted = quote.Subtotal - quote.DiscountAmount;
        var freeShipping = _settings.FreeShippingThreshold > 0 && discounted >= _settings.FreeShippingThreshold;
        quote.ShippingFee = discounted <= 0 || freeShipping ? 0 : _settings.ShippingFlatFee;
        quote.AmountToFreeShipping = _settings.FreeShippingThreshold > 0 && !freeShipping
            ? Round(_settings.FreeShippingThreshold - discounted)
            : 0;
        quote.Total = Round(discounted + quote.ShippingFee);
        return quote;
    }

    private async Task<(Coupon? coupon, string? error)> ValidateCouponAsync(int userId, string code, decimal subtotal)
    {
        var normalised = code.Trim().ToUpperInvariant();
        var coupon = await _context.Coupons.FirstOrDefaultAsync(c => c.Code == normalised);

        if (coupon == null || !coupon.IsActive)
            return (null, "This code isn't valid.");
        if (coupon.ExpiresAt != null && coupon.ExpiresAt < DateTime.UtcNow)
            return (null, "This code has expired.");
        if (subtotal < coupon.MinSubtotal)
            return (null, $"This code needs a subtotal of at least ${coupon.MinSubtotal:0.00}.");

        if (coupon.FirstOrderOnly)
        {
            var hasPreviousOrder = await _context.Orders.AnyAsync(o =>
                o.UserId == userId &&
                o.OrderStatus != OrderStatuses.Cancelled &&
                o.OrderStatus != OrderStatuses.Rejected);
            if (hasPreviousOrder)
                return (null, "This code is only valid on your first order.");
        }

        return (coupon, null);
    }

    private static decimal Round(decimal value) => Math.Round(value, 2, MidpointRounding.AwayFromZero);
}
