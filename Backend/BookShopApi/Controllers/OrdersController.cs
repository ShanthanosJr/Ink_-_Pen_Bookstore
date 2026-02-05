using System.Security.Claims;
using BookShopApi.Data;
using BookShopApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookShopApi.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly BookShopContext _context;

    public OrdersController(BookShopContext context)
    {
        _context = context;
    }

    private int GetUserId()
    {
        return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
    }

    // GET: api/orders
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
    {
        var userId = GetUserId();
        return await _context.Orders
            .Where(o => o.UserId == userId)
            .Include(o => o.Items)
            .ThenInclude(i => i.Book)
            .Include(o => o.DeliveryDetails)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
    }

    // GET: api/orders/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Order>> GetOrder(int id)
    {
        var userId = GetUserId();
        var order = await _context.Orders
            .Include(o => o.Items)
            .ThenInclude(i => i.Book)
            .Include(o => o.DeliveryDetails)
            .FirstOrDefaultAsync(o => o.Id == id && o.UserId == userId);

        if (order == null) return NotFound();

        return order;
    }

    // POST: api/orders/checkout
    [HttpPost("checkout")]
    public async Task<ActionResult<Order>> Checkout(CheckoutRequest request)
    {
        var userId = GetUserId();
        
        using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            // 1. Get Cart
            var cart = await _context.Carts
                .Include(c => c.Items)
                .ThenInclude(i => i.Book)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null || !cart.Items.Any())
            {
                return BadRequest("Cart is empty");
            }

            // 2. Validate Stock & Calculate Total
            decimal totalAmount = 0;
            foreach (var item in cart.Items)
            {
                if (item.Book.StockQuantity < item.Quantity)
                {
                    return BadRequest($"Not enough stock for book: {item.Book.Title}. Available: {item.Book.StockQuantity}");
                }
                totalAmount += item.Quantity * item.UnitPrice; // Use current or saved price? Saved UnitPrice strategy.
            }

            // 3. Create Order
            var order = new Order
            {
                UserId = userId,
                TotalAmount = totalAmount,
                OrderStatus = "Processing",
                CreatedAt = DateTime.UtcNow
            };
            _context.Orders.Add(order);
            await _context.SaveChangesAsync(); // Generates Order Id

            // 4. Create Order Items & Decrement Stock
            foreach (var cartItem in cart.Items)
            {
                var orderItem = new OrderItem
                {
                    OrderId = order.Id,
                    BookId = cartItem.BookId,
                    Quantity = cartItem.Quantity,
                    UnitPrice = cartItem.UnitPrice
                };
                _context.OrderItems.Add(orderItem);

                // Update Stock
                cartItem.Book.StockQuantity -= cartItem.Quantity;
                _context.Entry(cartItem.Book).State = EntityState.Modified;
            }

            // 5. Save Delivery Details
            var delivery = new DeliveryDetails
            {
                OrderId = order.Id,
                FullName = request.FullName,
                PhoneNumber = request.PhoneNumber,
                AddressLine = request.AddressLine,
                City = request.City,
                PostalCode = request.PostalCode,
                PaymentMethod = request.PaymentMethod,
                PaymentSlipPath = request.PaymentSlipPath,
                CardLast4Digits = request.CardLast4Digits
            };
            _context.DeliveryDetails.Add(delivery);

            // 6. Clear Cart
            _context.CartItems.RemoveRange(cart.Items);

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return StatusCode(500, "An error occurred while processing your order: " + ex.Message);
        }
    }
    // POST: api/orders/upload-slip
    [HttpPost("upload-slip")]
    public async Task<IActionResult> UploadSlip(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded.");

        try
        {
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "slips");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var uniqueFileName = Guid.NewGuid().ToString() + "_" + file.FileName;
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Return relative path
            var relativePath = $"/uploads/slips/{uniqueFileName}";
            return Ok(new { path = relativePath });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
}

public class CheckoutRequest
{
    public string FullName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string AddressLine { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;
    public string PaymentMethod { get; set; } = "COD";
    public string? PaymentSlipPath { get; set; }
    public string? CardLast4Digits { get; set; }
}
