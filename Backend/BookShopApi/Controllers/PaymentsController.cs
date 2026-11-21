using System.Globalization;
using BookShopApi.Data;
using BookShopApi.Models;
using BookShopApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace BookShopApi.Controllers;

[Route("api/payments")]
[ApiController]
public class PaymentsController : ControllerBase
{
    private readonly BookShopContext _context;
    private readonly IPayHereService _payHere;
    private readonly PayHereSettings _payHereSettings;
    private readonly ILogger<PaymentsController> _logger;
    private readonly IOrderNotifier _notifier;

    public PaymentsController(BookShopContext context, IPayHereService payHere,
        IOptions<PayHereSettings> payHereSettings, ILogger<PaymentsController> logger, IOrderNotifier notifier)
    {
        _notifier = notifier;
        _context = context;
        _payHere = payHere;
        _payHereSettings = payHereSettings.Value;
        _logger = logger;
    }

    // POST: api/payments/payhere/notify
    // Server-to-server callback from PayHere (form-urlencoded). This is the ONLY place an order is marked paid;
    // the browser return_url is never trusted.
    [HttpPost("payhere/notify")]
    [AllowAnonymous]
    [Consumes("application/x-www-form-urlencoded")]
    public async Task<IActionResult> PayHereNotify([FromForm] IFormCollection form)
    {
        var notification = new PayHereNotification
        {
            MerchantId = form["merchant_id"].ToString(),
            OrderId = form["order_id"].ToString(),
            PaymentId = form["payment_id"].ToString(),
            Amount = form["payhere_amount"].ToString(),
            Currency = form["payhere_currency"].ToString(),
            StatusCode = int.TryParse(form["status_code"], out var code) ? code : int.MinValue,
            Md5Sig = form["md5sig"].ToString(),
            StatusMessage = form["status_message"].ToString(),
            Method = form["method"].ToString()
        };

        if (!_payHere.IsValid(notification))
        {
            _logger.LogWarning("Rejected PayHere notification with invalid signature for order {OrderId}", notification.OrderId);
            return BadRequest();
        }

        if (!int.TryParse(notification.OrderId, NumberStyles.Integer, CultureInfo.InvariantCulture, out var orderId))
            return BadRequest();

        var order = await _context.Orders
            .Include(o => o.DeliveryDetails)
            .Include(o => o.StatusHistory)
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Id == orderId);
        if (order == null) return NotFound();

        // The signature proves PayHere sent it; also make sure the amount matches what we asked for.
        if (notification.Amount != _payHere.FormatAmount(order.TotalAmount) || notification.Currency != _payHereSettings.Currency)
        {
            _logger.LogWarning("PayHere amount mismatch for order {OrderId}: {Amount} {Currency}", orderId, notification.Amount, notification.Currency);
            order.AddNote("PayHere", $"Payment notification ignored: amount {notification.Amount} {notification.Currency} does not match the order.");
            await _context.SaveChangesAsync();
            return Ok();
        }

        var method = string.IsNullOrEmpty(notification.Method) ? "" : $" ({notification.Method})";
        var movedToReview = false;
        switch (notification.StatusCode)
        {
            case 2: // success
                if (order.PaymentStatus == PaymentStatuses.Paid || order.PaymentStatus == PaymentStatuses.RefundDue)
                    break; // duplicate notification

                order.PaymentReference = notification.PaymentId;
                if (order.OrderStatus == OrderStatuses.Cancelled)
                {
                    // Paid after the customer cancelled: money must go back
                    order.PaymentStatus = PaymentStatuses.RefundDue;
                    order.AddNote("PayHere", $"Payment received{method} after the order was cancelled. Refund required. Ref {notification.PaymentId}.");
                }
                else
                {
                    order.PaymentStatus = PaymentStatuses.Paid;
                    await RemovePaidItemsFromCartAsync(order);
                    if (order.OrderStatus == OrderStatuses.AwaitingPayment)
                    {
                        order.SetStatus(OrderStatuses.PendingApproval, "PayHere", $"Payment received{method}. Ref {notification.PaymentId}.");
                        movedToReview = true;
                    }
                    else
                        order.AddNote("PayHere", $"Payment received{method}. Ref {notification.PaymentId}.");
                }
                break;

            case 0: // pending
                order.PaymentStatus = PaymentStatuses.Pending;
                order.AddNote("PayHere", "Payment is pending at PayHere.");
                break;

            case -1: // cancelled by customer
                if (order.PaymentStatus != PaymentStatuses.Paid)
                {
                    order.PaymentStatus = PaymentStatuses.Unpaid;
                    order.AddNote("PayHere", "Payment was cancelled at PayHere.");
                }
                break;

            case -2: // failed
                if (order.PaymentStatus != PaymentStatuses.Paid)
                {
                    order.PaymentStatus = PaymentStatuses.Failed;
                    order.AddNote("PayHere", $"Payment failed: {notification.StatusMessage}");
                }
                break;

            case -3: // chargeback
                order.PaymentStatus = PaymentStatuses.ChargedBack;
                order.AddNote("PayHere", "Payment was charged back.");
                break;

            default:
                _logger.LogWarning("Unknown PayHere status {Status} for order {OrderId}", notification.StatusCode, orderId);
                break;
        }

        await _context.SaveChangesAsync();
        // Tell the customer once, when the payment moved the order forward (not on duplicate notifications)
        if (movedToReview)
            await _notifier.NotifyAsync(order.Id);
        return Ok();
    }

    // PayHere orders leave the cart alone at checkout; once paid, take the bought books out of the cart
    // (only the quantities that were ordered, in case the customer added more since).
    private async Task RemovePaidItemsFromCartAsync(Order order)
    {
        var cart = await _context.Carts.Include(c => c.Items).FirstOrDefaultAsync(c => c.UserId == order.UserId);
        if (cart == null) return;

        foreach (var ordered in order.Items)
        {
            var inCart = cart.Items.FirstOrDefault(i => i.BookId == ordered.BookId);
            if (inCart == null) continue;
            inCart.Quantity -= ordered.Quantity;
            if (inCart.Quantity <= 0) _context.CartItems.Remove(inCart);
        }
    }
}
