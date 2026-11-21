using System.Globalization;
using System.Security.Cryptography;
using System.Text;
using BookShopApi.Models;
using Microsoft.Extensions.Options;

namespace BookShopApi.Services;

public class PayHereCheckout
{
    // The browser POSTs Fields as a form to ActionUrl (PayHere hosted checkout page)
    public string ActionUrl { get; set; } = string.Empty;
    public Dictionary<string, string> Fields { get; set; } = new();
}

public class PayHereNotification
{
    public string MerchantId { get; set; } = string.Empty;
    public string OrderId { get; set; } = string.Empty;
    public string PaymentId { get; set; } = string.Empty;
    public string Amount { get; set; } = string.Empty;
    public string Currency { get; set; } = string.Empty;
    public int StatusCode { get; set; }
    public string Md5Sig { get; set; } = string.Empty;
    public string? StatusMessage { get; set; }
    public string? Method { get; set; }
}

public interface IPayHereService
{
    bool IsConfigured { get; }
    PayHereCheckout BuildCheckout(Order order, User user);
    bool IsValid(PayHereNotification notification);
    string FormatAmount(decimal amount);
}

/// <summary>
/// PayHere hosted checkout (https://support.payhere.lk/api-&-mobile-sdk/checkout-api).
/// hash   = UPPER(MD5(merchant_id + order_id + amount + currency + UPPER(MD5(merchant_secret))))
/// md5sig = UPPER(MD5(merchant_id + order_id + payhere_amount + payhere_currency + status_code + UPPER(MD5(merchant_secret))))
/// </summary>
public class PayHereService : IPayHereService
{
    private readonly PayHereSettings _payHere;
    private readonly ShopSettings _shop;

    public PayHereService(IOptions<PayHereSettings> payHere, IOptions<ShopSettings> shop)
    {
        _payHere = payHere.Value;
        _shop = shop.Value;
    }

    public bool IsConfigured => _payHere.IsConfigured;

    public string FormatAmount(decimal amount) => amount.ToString("0.00", CultureInfo.InvariantCulture);

    public PayHereCheckout BuildCheckout(Order order, User user)
    {
        if (!IsConfigured) throw new InvalidOperationException("PayHere is not configured.");

        var delivery = order.DeliveryDetails;
        var nameParts = (delivery.FullName ?? user.FullName).Trim().Split(' ', 2, StringSplitOptions.RemoveEmptyEntries);
        var amount = FormatAmount(order.TotalAmount);
        var orderId = order.Id.ToString(CultureInfo.InvariantCulture);
        var frontend = _shop.FrontendBaseUrl.TrimEnd('/');

        var fields = new Dictionary<string, string>
        {
            ["merchant_id"] = _payHere.MerchantId,
            ["return_url"] = $"{frontend}/orders/{order.Id}?payment=return",
            ["cancel_url"] = $"{frontend}/orders/{order.Id}?payment=cancelled",
            ["notify_url"] = $"{_shop.PublicApiBaseUrl.TrimEnd('/')}/api/payments/payhere/notify",
            ["order_id"] = orderId,
            ["items"] = $"Ink & Pens order #{order.Id}",
            ["currency"] = _payHere.Currency,
            ["amount"] = amount,
            ["first_name"] = nameParts.ElementAtOrDefault(0) ?? "Customer",
            ["last_name"] = nameParts.ElementAtOrDefault(1) ?? "",
            ["email"] = user.Email,
            ["phone"] = delivery.PhoneNumber,
            ["address"] = delivery.AddressLine,
            ["city"] = delivery.City,
            ["country"] = "Sri Lanka",
            ["hash"] = Md5Upper(_payHere.MerchantId + orderId + amount + _payHere.Currency + SecretHash())
        };

        return new PayHereCheckout { ActionUrl = _payHere.CheckoutUrl, Fields = fields };
    }

    public bool IsValid(PayHereNotification n)
    {
        if (!IsConfigured || n.MerchantId != _payHere.MerchantId) return false;

        var expected = Md5Upper(n.MerchantId + n.OrderId + n.Amount + n.Currency +
                                n.StatusCode.ToString(CultureInfo.InvariantCulture) + SecretHash());
        return CryptographicOperations.FixedTimeEquals(
            Encoding.ASCII.GetBytes(expected),
            Encoding.ASCII.GetBytes((n.Md5Sig ?? string.Empty).ToUpperInvariant()));
    }

    private string SecretHash() => Md5Upper(_payHere.MerchantSecret);

    private static string Md5Upper(string input) =>
        Convert.ToHexString(MD5.HashData(Encoding.UTF8.GetBytes(input))); // ToHexString is upper-case
}
