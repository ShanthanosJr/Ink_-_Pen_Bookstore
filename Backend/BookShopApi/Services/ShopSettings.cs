namespace BookShopApi.Services;

/// <summary>Bound from the "Shop" section of appsettings.json.</summary>
public class ShopSettings
{
    public decimal ShippingFlatFee { get; set; } = 3.99m;

    // Orders whose (discounted) subtotal reaches this amount ship free. 0 disables free shipping.
    public decimal FreeShippingThreshold { get; set; } = 50m;

    // Where the React app runs; used for PayHere return/cancel URLs.
    public string FrontendBaseUrl { get; set; } = "http://localhost:5173";

    // Publicly reachable base URL of this API; PayHere posts payment notifications here.
    // localhost will NOT work for PayHere - use a tunnel (e.g. ngrok) when testing locally.
    public string PublicApiBaseUrl { get; set; } = "http://localhost:5000";
}

/// <summary>Bound from the "PayHere" section. Put real values in appsettings.Development.json or user-secrets, never in git.</summary>
public class PayHereSettings
{
    public string MerchantId { get; set; } = string.Empty;
    public string MerchantSecret { get; set; } = string.Empty;
    public bool Sandbox { get; set; } = true;
    // Shop prices are in USD. PayHere accepts USD only if it's enabled on the merchant account;
    // switching to LKR would also require converting prices.
    public string Currency { get; set; } = "USD";

    public bool IsConfigured => !string.IsNullOrWhiteSpace(MerchantId) && !string.IsNullOrWhiteSpace(MerchantSecret);

    public string CheckoutUrl => Sandbox
        ? "https://sandbox.payhere.lk/pay/checkout"
        : "https://www.payhere.lk/pay/checkout";
}
