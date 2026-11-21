using System.Security.Claims;
using BookShopApi.Data;
using BookShopApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookShopApi.Controllers;

[Route("api/admin/users")]
[ApiController]
[Authorize(Roles = "Admin")]
public class AdminUsersController : ControllerBase
{
    private readonly BookShopContext _context;

    public AdminUsersController(BookShopContext context)
    {
        _context = context;
    }

    private int CurrentUserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    // GET: api/admin/users
    [HttpGet]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _context.Users.AsNoTracking().ToListAsync();
        // Decimal sums aren't supported by SQLite, so aggregate orders in memory
        var orders = await _context.Orders.AsNoTracking()
            .Select(o => new { o.UserId, o.TotalAmount, o.OrderStatus, o.CreatedAt })
            .ToListAsync();

        var result = users.Select(u =>
        {
            var mine = orders.Where(o => o.UserId == u.Id).ToList();
            var booked = mine.Where(o => !OrderStatuses.NotBooked.Contains(o.OrderStatus)).ToList();
            return new
            {
                u.Id,
                u.FullName,
                u.Email,
                u.Role,
                u.IsActive,
                u.CreatedAt,
                OrderCount = mine.Count,
                TotalSpent = booked.Sum(o => o.TotalAmount),
                LastOrderAt = mine.Count == 0 ? (DateTime?)null : mine.Max(o => o.CreatedAt),
                IsCurrentUser = u.Id == CurrentUserId
            };
        })
        .OrderByDescending(u => u.CreatedAt);

        return Ok(result);
    }

    // PUT: api/admin/users/5/role  { role: "Admin" | "User" }
    [HttpPut("{id:int}/role")]
    public async Task<IActionResult> SetRole(int id, [FromBody] SetRoleRequest request)
    {
        if (request.Role != "Admin" && request.Role != "User")
            return BadRequest("Role must be Admin or User.");
        if (id == CurrentUserId)
            return BadRequest("You can't change your own role.");

        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();
        if (user.Role == "Admin" && request.Role != "Admin" && await _context.Users.CountAsync(u => u.Role == "Admin" && u.IsActive) <= 1)
            return BadRequest("There must be at least one active admin.");

        user.Role = request.Role;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    // PUT: api/admin/users/5/active  { isActive: false }
    [HttpPut("{id:int}/active")]
    public async Task<IActionResult> SetActive(int id, [FromBody] SetActiveRequest request)
    {
        if (id == CurrentUserId)
            return BadRequest("You can't block your own account.");

        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();
        if (!request.IsActive && user.Role == "Admin" && await _context.Users.CountAsync(u => u.Role == "Admin" && u.IsActive) <= 1)
            return BadRequest("There must be at least one active admin.");

        user.IsActive = request.IsActive;
        await _context.SaveChangesAsync();
        return NoContent();
    }
}

public class SetRoleRequest
{
    public string Role { get; set; } = string.Empty;
}

public class SetActiveRequest
{
    public bool IsActive { get; set; }
}
