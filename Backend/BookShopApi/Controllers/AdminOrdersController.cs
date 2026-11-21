using BookShopApi.Data;
using BookShopApi.Models;
using BookShopApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookShopApi.Controllers;

[Route("api/admin/orders")]
[ApiController]
[Authorize(Roles = "Admin")]
public class AdminOrdersController : ControllerBase
{
    private readonly BookShopContext _context;

    private readonly IOrderNotifier _notifier;

    public AdminOrdersController(BookShopContext context, IOrderNotifier notifier)
    {
        _context = context;
        _notifier = notifier;
    }

    private IQueryable<Order> OrdersWithDetails() => _context.Orders
        .Include(o => o.User)
        .Include(o => o.Items).ThenInclude(i => i.Book)
        .Include(o => o.DeliveryDetails)
        .Include(o => o.StatusHistory.OrderBy(h => h.CreatedAt));

    // Order.User is hidden from JSON, so admin responses add the customer explicitly.
    private static object ToAdminView(Order o) => new
    {
        o.Id,
        o.OrderStatus,
        o.PaymentStatus,
        o.PaymentReference,
        o.Subtotal,
        o.DiscountAmount,
        o.ShippingFee,
        o.CouponCode,
        o.TotalAmount,
        o.RejectionReason,
        o.Courier,
        o.TrackingNumber,
        o.CreatedAt,
        o.LastUpdated,
        Customer = new { o.User.Id, o.User.FullName, o.User.Email },
        o.DeliveryDetails,
        o.Items,
        o.StatusHistory
    };

    // GET: api/admin/orders
    [HttpGet]
    public async Task<IActionResult> GetOrders()
    {
        var orders = await OrdersWithDetails()
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
        return Ok(orders.Select(ToAdminView));
    }

    // GET: api/admin/orders/5
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetOrder(int id)
    {
        var order = await OrdersWithDetails().FirstOrDefaultAsync(o => o.Id == id);
        if (order == null) return NotFound();
        return Ok(ToAdminView(order));
    }

    private Task<Order?> LoadForUpdate(int id) => _context.Orders
        .Include(o => o.Items).ThenInclude(i => i.Book)
        .Include(o => o.DeliveryDetails)
        .Include(o => o.StatusHistory)
        .FirstOrDefaultAsync(o => o.Id == id);

    // PUT: api/admin/orders/{id}/approve
    [HttpPut("{id:int}/approve")]
    public async Task<IActionResult> ApproveOrder(int id)
    {
        var order = await LoadForUpdate(id);
        if (order == null) return NotFound();

        if (order.OrderStatus != OrderStatuses.PendingApproval)
            return BadRequest("Only orders pending review can be approved.");

        var method = order.DeliveryDetails.PaymentMethod;
        if (method == PaymentMethods.PayHere && order.PaymentStatus != PaymentStatuses.Paid)
            return BadRequest("This online payment hasn't been confirmed by PayHere yet.");

        var note = "Order approved.";
        if (method == PaymentMethods.BankTransfer && order.PaymentStatus == PaymentStatuses.Unpaid)
        {
            // Approving a bank-transfer order means the admin has verified the slip
            order.PaymentStatus = PaymentStatuses.Paid;
            note = "Bank transfer slip verified. Order approved.";
        }

        order.SetStatus(OrderStatuses.Approved, "Admin", note);
        await _context.SaveChangesAsync();
        await _notifier.NotifyAsync(order.Id);
        return NoContent();
    }

    // PUT: api/admin/orders/{id}/reject
    [HttpPut("{id:int}/reject")]
    public async Task<IActionResult> RejectOrder(int id, [FromBody] RejectRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Reason))
            return BadRequest("Please give a reason so the customer knows why.");

        var order = await LoadForUpdate(id);
        if (order == null) return NotFound();

        if (order.OrderStatus != OrderStatuses.PendingApproval && order.OrderStatus != OrderStatuses.AwaitingPayment)
            return BadRequest("Only orders that haven't been approved yet can be rejected.");

        // Stock was reserved at checkout; give it back
        foreach (var item in order.Items)
            item.Book.StockQuantity += item.Quantity;

        if (order.PaymentStatus == PaymentStatuses.Paid)
            order.PaymentStatus = PaymentStatuses.RefundDue;

        order.RejectionReason = request.Reason.Trim();
        order.SetStatus(OrderStatuses.Rejected, "Admin", order.RejectionReason);
        await _context.SaveChangesAsync();
        await _notifier.NotifyAsync(order.Id);
        return NoContent();
    }

    // PUT: api/admin/orders/{id}/status  { status, note?, courier?, trackingNumber? }
    [HttpPut("{id:int}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] StatusUpdateRequest request)
    {
        if (!SettableStatuses.Contains(request.Status))
            return BadRequest($"Invalid status '{request.Status}'. Allowed: {string.Join(", ", SettableStatuses)}.");

        var order = await LoadForUpdate(id);
        if (order == null) return NotFound();

        if (order.OrderStatus == OrderStatuses.PendingApproval || order.OrderStatus == OrderStatuses.AwaitingPayment)
            return BadRequest("Pending orders must be approved or rejected first.");
        if (OrderStatuses.Closed.Contains(order.OrderStatus))
            return BadRequest($"Order is already {order.OrderStatus} and can no longer change.");
        if (request.Status == order.OrderStatus)
            return BadRequest($"Order is already {order.OrderStatus}.");

        if (!string.IsNullOrWhiteSpace(request.Courier)) order.Courier = request.Courier.Trim();
        if (!string.IsNullOrWhiteSpace(request.TrackingNumber)) order.TrackingNumber = request.TrackingNumber.Trim();

        var note = string.IsNullOrWhiteSpace(request.Note) ? null : request.Note.Trim();

        if (request.Status == OrderStatuses.Cancelled)
        {
            // Cancelling returns the reserved stock, same as rejecting.
            foreach (var item in order.Items)
                item.Book.StockQuantity += item.Quantity;
            if (order.PaymentStatus == PaymentStatuses.Paid)
                order.PaymentStatus = PaymentStatuses.RefundDue;
        }

        if (request.Status == OrderStatuses.Shipped && order.TrackingNumber != null)
        {
            var tracking = $"Shipped with {order.Courier ?? "courier"}, tracking number {order.TrackingNumber}.";
            note = note == null ? tracking : $"{tracking} {note}";
        }

        if (request.Status == OrderStatuses.Delivered && order.DeliveryDetails.PaymentMethod == PaymentMethods.CashOnDelivery
            && order.PaymentStatus == PaymentStatuses.Unpaid)
        {
            // Cash collected on delivery
            order.PaymentStatus = PaymentStatuses.Paid;
        }

        order.SetStatus(request.Status, "Admin", note);
        await _context.SaveChangesAsync();
        await _notifier.NotifyAsync(order.Id);
        return NoContent();
    }

    // PUT: api/admin/orders/{id}/payment  { status, note? }
    // Manual payment bookkeeping, e.g. marking a refund as done.
    [HttpPut("{id:int}/payment")]
    public async Task<IActionResult> UpdatePaymentStatus(int id, [FromBody] PaymentStatusUpdateRequest request)
    {
        var allowed = new[] { PaymentStatuses.Paid, PaymentStatuses.Refunded };
        if (!allowed.Contains(request.Status))
            return BadRequest($"Payment status can only be set to {string.Join(" or ", allowed)}.");

        var order = await LoadForUpdate(id);
        if (order == null) return NotFound();

        if (request.Status == PaymentStatuses.Refunded && order.PaymentStatus != PaymentStatuses.RefundDue && order.PaymentStatus != PaymentStatuses.Paid)
            return BadRequest("Only paid orders can be refunded.");
        if (request.Status == PaymentStatuses.Paid && order.DeliveryDetails.PaymentMethod == PaymentMethods.PayHere)
            return BadRequest("PayHere payments are confirmed automatically by PayHere.");

        order.PaymentStatus = request.Status;
        order.AddNote("Admin", string.IsNullOrWhiteSpace(request.Note)
            ? $"Payment marked as {request.Status}."
            : $"Payment marked as {request.Status}: {request.Note.Trim()}");
        await _context.SaveChangesAsync();
        return NoContent();
    }

    // Statuses an admin can move an approved order into via the status endpoint.
    private static readonly HashSet<string> SettableStatuses = new()
    {
        OrderStatuses.Processing, OrderStatuses.Shipped, OrderStatuses.OutForDelivery,
        OrderStatuses.Delivered, OrderStatuses.Cancelled
    };
}

public class RejectRequest
{
    public string Reason { get; set; } = string.Empty;
}

public class StatusUpdateRequest
{
    public string Status { get; set; } = string.Empty;
    public string? Note { get; set; }
    public string? Courier { get; set; }
    public string? TrackingNumber { get; set; }
}

public class PaymentStatusUpdateRequest
{
    public string Status { get; set; } = string.Empty;
    public string? Note { get; set; }
}
