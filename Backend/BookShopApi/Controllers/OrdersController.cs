using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using BookShopApi.Data;
using BookShopApi.Models;
using BookShopApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace BookShopApi.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly BookShopContext _context;
    private readonly IPricingService _pricing;
    private readonly IPayHereService _payHere;
    private readonly ShopSettings _shop;
    private readonly IOrderNotifier _notifier;

    public OrdersController(BookShopContext context, IPricingService pricing, IPayHereService payHere,
        IOptions<ShopSettings> shop, IOrderNotifier notifier)
    {
        _context = context;
        _pricing = pricing;
        _payHere = payHere;
        _shop = shop.Value;
        _notifier = notifier;
    }

    private int GetUserId()
    {
        return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
    }

    private IQueryable<Order> OrdersWithDetails() => _context.Orders
        .Include(o => o.Items)
        .ThenInclude(i => i.Book)
        .Include(o => o.DeliveryDetails)
        .Include(o => o.StatusHistory.OrderBy(h => h.CreatedAt));

    // GET: api/orders
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
    {
        var userId = GetUserId();
        return await OrdersWithDetails()
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
    }

    // GET: api/orders/5
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Order>> GetOrder(int id)
    {
        var userId = GetUserId();
        var order = await OrdersWithDetails().FirstOrDefaultAsync(o => o.Id == id && o.UserId == userId);
        if (order == null) return NotFound();
        return order;
    }

    // GET: api/orders/checkout-options
    // Shipping rules, available payment methods, and the customer's last delivery address for pre-filling.
    [HttpGet("checkout-options")]
    public async Task<IActionResult> GetCheckoutOptions()
    {
        var userId = GetUserId();
        var lastDelivery = await _context.DeliveryDetails
            .Where(d => d.Order.UserId == userId)
            .OrderByDescending(d => d.OrderId)
            .Select(d => new { d.FullName, d.PhoneNumber, d.AddressLine, d.City, d.PostalCode })
            .FirstOrDefaultAsync();

        return Ok(new
        {
            shippingFlatFee = _shop.ShippingFlatFee,
            freeShippingThreshold = _shop.FreeShippingThreshold,
            paymentMethods = new[]
            {
                new { id = PaymentMethods.CashOnDelivery, label = "Cash on Delivery", enabled = true },
                new { id = PaymentMethods.PayHere, label = "Card / Mobile Wallet (PayHere)", enabled = _payHere.IsConfigured },
                new { id = PaymentMethods.BankTransfer, label = "Bank Transfer", enabled = _shop.BankTransfer.IsConfigured },
            },
            bankTransfer = _shop.BankTransfer.IsConfigured ? _shop.BankTransfer : null,
            lastDelivery
        });
    }

    // POST: api/orders/quote  { couponCode }
    [HttpPost("quote")]
    public async Task<ActionResult<PriceQuote>> Quote(QuoteRequest request)
    {
        var userId = GetUserId();
        var cart = await _context.Carts.Include(c => c.Items).FirstOrDefaultAsync(c => c.UserId == userId);
        return await _pricing.QuoteAsync(userId, cart?.Items ?? new List<CartItem>(), request.CouponCode);
    }

    // POST: api/orders/checkout
    [HttpPost("checkout")]
    public async Task<ActionResult<CheckoutResponse>> Checkout(CheckoutRequest request)
    {
        var userId = GetUserId();

        if (!PaymentMethods.All.Contains(request.PaymentMethod))
            return BadRequest("Please choose a valid payment method.");
        if (request.PaymentMethod == PaymentMethods.PayHere && !_payHere.IsConfigured)
            return BadRequest("Online card payments are not available right now. Please choose another payment method.");
        if (request.PaymentMethod == PaymentMethods.BankTransfer && !_shop.BankTransfer.IsConfigured)
            return BadRequest("Bank transfer is not available right now. Please choose another payment method.");
        if (request.PaymentMethod == PaymentMethods.BankTransfer &&
            (string.IsNullOrWhiteSpace(request.PaymentSlipPath) || !request.PaymentSlipPath.StartsWith("/uploads/slips/")))
            return BadRequest("Please upload your bank transfer slip.");

        using var transaction = await _context.Database.BeginTransactionAsync();

        var cart = await _context.Carts
            .Include(c => c.Items)
            .ThenInclude(i => i.Book)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null || !cart.Items.Any())
            return BadRequest("Your cart is empty.");

        foreach (var item in cart.Items)
        {
            if (item.Book.StockQuantity < item.Quantity)
                return BadRequest($"Not enough stock for '{item.Book.Title}'. Available: {item.Book.StockQuantity}.");
        }

        var quote = await _pricing.QuoteAsync(userId, cart.Items, request.CouponCode);
        if (quote.CouponError != null)
            return BadRequest(quote.CouponError);

        var isOnlinePayment = request.PaymentMethod == PaymentMethods.PayHere;
        var order = new Order
        {
            UserId = userId,
            Subtotal = quote.Subtotal,
            DiscountAmount = quote.DiscountAmount,
            ShippingFee = quote.ShippingFee,
            CouponCode = quote.CouponCode,
            TotalAmount = quote.Total,
            PaymentStatus = isOnlinePayment ? PaymentStatuses.Pending : PaymentStatuses.Unpaid,
            CreatedAt = DateTime.UtcNow,
            DeliveryDetails = new DeliveryDetails
            {
                FullName = request.FullName.Trim(),
                PhoneNumber = request.PhoneNumber.Trim(),
                AddressLine = request.AddressLine.Trim(),
                City = request.City.Trim(),
                PostalCode = request.PostalCode.Trim(),
                PaymentMethod = request.PaymentMethod,
                PaymentSlipPath = request.PaymentMethod == PaymentMethods.BankTransfer ? request.PaymentSlipPath : null
            }
        };

        // Online payments wait for PayHere before the shop reviews them; everything else goes straight to review.
        order.SetStatus(
            isOnlinePayment ? OrderStatuses.AwaitingPayment : OrderStatuses.PendingApproval,
            "Customer",
            isOnlinePayment ? "Order placed. Waiting for online payment." : "Order placed.");

        foreach (var cartItem in cart.Items)
        {
            order.Items.Add(new OrderItem
            {
                BookId = cartItem.BookId,
                Quantity = cartItem.Quantity,
                UnitPrice = cartItem.UnitPrice
            });
            // Stock is reserved at checkout and returned on cancel/reject
            cartItem.Book.StockQuantity -= cartItem.Quantity;
        }

        _context.Orders.Add(order);
        _context.CartItems.RemoveRange(cart.Items);

        await _context.SaveChangesAsync();
        await transaction.CommitAsync();

        await _notifier.NotifyAsync(order.Id);

        var response = new CheckoutResponse { OrderId = order.Id, OrderStatus = order.OrderStatus, Total = order.TotalAmount };
        if (isOnlinePayment)
        {
            var user = await _context.Users.FindAsync(userId);
            response.PayHere = _payHere.BuildCheckout(order, user!);
        }

        return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, response);
    }

    // POST: api/orders/5/pay
    // Restart PayHere payment for an order that is still waiting for payment (e.g. customer closed the page).
    [HttpPost("{id:int}/pay")]
    public async Task<ActionResult<PayHereCheckout>> RetryPayment(int id)
    {
        var userId = GetUserId();
        var order = await _context.Orders
            .Include(o => o.DeliveryDetails)
            .Include(o => o.User)
            .FirstOrDefaultAsync(o => o.Id == id && o.UserId == userId);

        if (order == null) return NotFound();
        if (order.DeliveryDetails.PaymentMethod != PaymentMethods.PayHere || order.OrderStatus != OrderStatuses.AwaitingPayment)
            return BadRequest("This order is not waiting for an online payment.");
        if (order.PaymentStatus == PaymentStatuses.Paid)
            return BadRequest("This order is already paid.");
        if (!_payHere.IsConfigured)
            return BadRequest("Online card payments are not available right now.");

        return _payHere.BuildCheckout(order, order.User);
    }

    // POST: api/orders/5/cancel
    // Customers can cancel until the shop approves the order.
    [HttpPost("{id:int}/cancel")]
    public async Task<IActionResult> CancelOrder(int id)
    {
        var userId = GetUserId();
        var order = await _context.Orders
            .Include(o => o.Items).ThenInclude(i => i.Book)
            .Include(o => o.StatusHistory)
            .FirstOrDefaultAsync(o => o.Id == id && o.UserId == userId);

        if (order == null) return NotFound();
        if (order.OrderStatus != OrderStatuses.AwaitingPayment && order.OrderStatus != OrderStatuses.PendingApproval)
            return BadRequest("This order has already been accepted by the shop and can no longer be cancelled online. Please contact us.");

        foreach (var item in order.Items)
            item.Book.StockQuantity += item.Quantity;

        var note = "Cancelled by customer.";
        if (order.PaymentStatus == PaymentStatuses.Paid)
        {
            order.PaymentStatus = PaymentStatuses.RefundDue;
            note += " A refund will be issued.";
        }
        order.SetStatus(OrderStatuses.Cancelled, "Customer", note);

        await _context.SaveChangesAsync();
        await _notifier.NotifyAsync(order.Id);
        return NoContent();
    }

    // POST: api/orders/upload-slip
    [HttpPost("upload-slip")]
    [RequestSizeLimit(6 * 1024 * 1024)]
    public async Task<IActionResult> UploadSlip(IFormFile file)
    {
        var (path, error) = await UploadStorage.SaveAsync(file, "slips", UploadStorage.SlipTypes, 5 * 1024 * 1024);
        if (error != null) return BadRequest(error);
        return Ok(new { path });
    }
}

public class QuoteRequest
{
    public string? CouponCode { get; set; }
}

public class CheckoutRequest
{
    [Required, MaxLength(100)]
    public string FullName { get; set; } = string.Empty;

    [Required, RegularExpression(@"^\+?[0-9 ()\-]{7,20}$", ErrorMessage = "Please enter a valid phone number.")]
    public string PhoneNumber { get; set; } = string.Empty;

    [Required, MaxLength(200)]
    public string AddressLine { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string City { get; set; } = string.Empty;

    [Required, RegularExpression(@"^[A-Za-z0-9 \-]{3,10}$", ErrorMessage = "Please enter a valid postal code.")]
    public string PostalCode { get; set; } = string.Empty;

    public string PaymentMethod { get; set; } = PaymentMethods.CashOnDelivery;

    public string? PaymentSlipPath { get; set; }

    public string? CouponCode { get; set; }
}

public class CheckoutResponse
{
    public int OrderId { get; set; }
    public string OrderStatus { get; set; } = string.Empty;
    public decimal Total { get; set; }
    // Present only for PayHere orders: the browser must POST these fields to ActionUrl
    public PayHereCheckout? PayHere { get; set; }
}
