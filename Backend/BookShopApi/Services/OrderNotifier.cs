using System.Globalization;
using BookShopApi.Data;
using BookShopApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace BookShopApi.Services;

public interface IOrderNotifier
{
    /// <summary>Emails the customer about the order's current state. Call after the change is saved.</summary>
    Task NotifyAsync(int orderId);
}

public class OrderNotifier : IOrderNotifier
{
    private readonly BookShopContext _context;
    private readonly IEmailSender _email;
    private readonly ShopSettings _shop;

    public OrderNotifier(BookShopContext context, IEmailSender email, IOptions<ShopSettings> shop)
    {
        _context = context;
        _email = email;
        _shop = shop.Value;
    }

    public async Task NotifyAsync(int orderId)
    {
        var order = await _context.Orders
            .AsNoTracking()
            .Include(o => o.User)
            .Include(o => o.DeliveryDetails)
            .Include(o => o.StatusHistory)
            .FirstOrDefaultAsync(o => o.Id == orderId);
        if (order == null) return;

        var (subject, message) = Describe(order);
        if (subject == null) return;

        var latestNote = order.StatusHistory.OrderByDescending(h => h.CreatedAt).FirstOrDefault()?.Note;
        var link = $"{_shop.FrontendBaseUrl.TrimEnd('/')}/orders/{order.Id}";
        var total = order.TotalAmount.ToString("0.00", CultureInfo.InvariantCulture);

        var body =
            $"Hello {order.User.FullName},\n\n{message}\n" +
            (string.IsNullOrWhiteSpace(latestNote) ? "" : $"\nNote: {latestNote}\n") +
            (order.TrackingNumber != null && order.OrderStatus is OrderStatuses.Shipped or OrderStatuses.OutForDelivery
                ? $"\nCourier: {order.Courier ?? "-"}\nTracking number: {order.TrackingNumber}\n" : "") +
            $"\nOrder #{order.Id} · Total ${total}\nTrack your order: {link}\n\nThank you for shopping with Ink & Pens.";

        await _email.SendAsync(order.User.Email, $"Order #{order.Id}: {subject}", body);
    }

    private static (string? subject, string message) Describe(Order order) => order.OrderStatus switch
    {
        OrderStatuses.AwaitingPayment => (null, ""), // the customer is on the payment page right now
        OrderStatuses.PendingApproval when order.PaymentStatus == PaymentStatuses.Paid && order.DeliveryDetails.PaymentMethod == PaymentMethods.PayHere
            => ("payment received", "We've received your payment. Your order is now waiting for our review."),
        OrderStatuses.PendingApproval => ("we've got your order", "Thank you! We've received your order and will review it shortly."),
        OrderStatuses.Approved => ("approved", "Good news: your order has been approved and will be prepared for shipping."),
        OrderStatuses.Processing => ("being prepared", "We're packing your books."),
        OrderStatuses.Shipped => ("shipped", "Your order is on its way."),
        OrderStatuses.OutForDelivery => ("out for delivery", "Your order is out for delivery today."),
        OrderStatuses.Delivered => ("delivered", "Your order has been delivered. We hope you enjoy your books!"),
        OrderStatuses.Rejected => ("not accepted", $"Unfortunately we couldn't accept your order. Reason: {order.RejectionReason}" +
            (order.PaymentStatus == PaymentStatuses.RefundDue ? "\nYour payment will be refunded." : "")),
        OrderStatuses.Cancelled => ("cancelled", "Your order has been cancelled." +
            (order.PaymentStatus == PaymentStatuses.RefundDue ? " Your payment will be refunded." : "")),
        _ => (null, "")
    };
}
