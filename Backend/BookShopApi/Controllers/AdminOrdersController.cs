using System.Security.Claims;
using BookShopApi.Data;
using BookShopApi.Models;
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

    public AdminOrdersController(BookShopContext context)
    {
        _context = context;
    }

    // GET: api/admin/orders
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
    {
        return await _context.Orders
            .Include(o => o.User)
            .Include(o => o.Items)
            .ThenInclude(i => i.Book)
            .Include(o => o.DeliveryDetails)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
    }

    // PUT: api/admin/orders/{id}/approve
    [HttpPut("{id}/approve")]
    public async Task<IActionResult> ApproveOrder(int id)
    {
        var order = await _context.Orders.FindAsync(id);
        if (order == null) return NotFound();

        if (order.OrderStatus != "PendingApproval")
        {
            return BadRequest("Only pending orders can be approved.");
        }

        order.OrderStatus = "Approved";
        order.LastUpdated = DateTime.UtcNow;
        
        await _context.SaveChangesAsync();
        return NoContent();
    }

    // PUT: api/admin/orders/{id}/reject
    [HttpPut("{id}/reject")]
    public async Task<IActionResult> RejectOrder(int id, [FromBody] RejectRequest request)
    {
        var order = await _context.Orders.FindAsync(id);
        if (order == null) return NotFound();

        if (order.OrderStatus != "PendingApproval")
        {
            return BadRequest("Only pending orders can be rejected.");
        }

        order.OrderStatus = "Rejected";
        order.RejectionReason = request.Reason;
        order.LastUpdated = DateTime.UtcNow;
        
        // Return stock?
        // Ideally yes, but per requirements "Stock adjustments should already be done at checkout".
        // For rejection, we SHOULD probably return stock, but keeping it simple as per "Extend cleanly".
        // Let's increment stock back for correctness.
        var items = await _context.OrderItems
            .Include(i => i.Book)
            .Where(i => i.OrderId == id)
            .ToListAsync();

        foreach (var item in items)
        {
            item.Book.StockQuantity += item.Quantity;
        }

        await _context.SaveChangesAsync();
        return NoContent();
    }

    // PUT: api/admin/orders/{id}/status
    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] StatusUpdateRequest request)
    {
        var order = await _context.Orders.FindAsync(id);
        if (order == null) return NotFound();

        // Validate allowed transitions if strictly needed, but admin has power.
        order.OrderStatus = request.Status;
        order.LastUpdated = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return NoContent();
    }
}

public class RejectRequest
{
    public string Reason { get; set; } = string.Empty;
}

public class StatusUpdateRequest
{
    public string Status { get; set; } = string.Empty;
}
