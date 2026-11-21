using BookShopApi.Data;
using BookShopApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookShopApi.Controllers;

[Route("api/admin/dashboard")]
[ApiController]
[Authorize(Roles = "Admin")]
public class AdminDashboardController : ControllerBase
{
    private const int LowStockThreshold = 5;
    private readonly BookShopContext _context;

    public AdminDashboardController(BookShopContext context)
    {
        _context = context;
    }

    // GET: api/admin/dashboard?days=14
    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] int days = 14)
    {
        days = Math.Clamp(days, 7, 90);

        // SQLite can't aggregate decimals server-side, and the data set is small, so aggregate in memory.
        var orders = await _context.Orders
            .Include(o => o.User)
            .Include(o => o.Items).ThenInclude(i => i.Book)
            .Include(o => o.DeliveryDetails)
            .AsNoTracking()
            .ToListAsync();

        var booked = orders.Where(o => !OrderStatuses.NotBooked.Contains(o.OrderStatus)).ToList();
        var today = DateTime.UtcNow.Date;
        var from = today.AddDays(-(days - 1));

        var revenueByDay = Enumerable.Range(0, days)
            .Select(offset => from.AddDays(offset))
            .Select(day => new
            {
                Date = day.ToString("yyyy-MM-dd"),
                Revenue = booked.Where(o => o.CreatedAt.Date == day).Sum(o => o.TotalAmount),
                Orders = booked.Count(o => o.CreatedAt.Date == day)
            })
            .ToList();

        var topBooks = booked
            .SelectMany(o => o.Items)
            .GroupBy(i => i.BookId)
            .Select(g => new
            {
                BookId = g.Key,
                Title = g.First().Book?.Title ?? $"Book #{g.Key}",
                Quantity = g.Sum(i => i.Quantity),
                Revenue = g.Sum(i => i.Quantity * i.UnitPrice)
            })
            .OrderByDescending(b => b.Quantity)
            .Take(5)
            .ToList();

        var lowStock = await _context.Books
            .Where(b => b.StockQuantity <= LowStockThreshold)
            .OrderBy(b => b.StockQuantity)
            .Select(b => new { b.Id, b.Title, b.StockQuantity })
            .ToListAsync();

        var statusCounts = orders
            .GroupBy(o => o.OrderStatus)
            .ToDictionary(g => g.Key, g => g.Count());

        var recentOrders = orders
            .OrderByDescending(o => o.CreatedAt)
            .Take(6)
            .Select(o => new
            {
                o.Id,
                o.OrderStatus,
                o.PaymentStatus,
                o.TotalAmount,
                o.CreatedAt,
                Customer = o.DeliveryDetails?.FullName ?? o.User.FullName,
                PaymentMethod = o.DeliveryDetails?.PaymentMethod
            })
            .ToList();

        var periodOrders = booked.Where(o => o.CreatedAt.Date >= from).ToList();

        return Ok(new
        {
            Days = days,
            Totals = new
            {
                Revenue = booked.Sum(o => o.TotalAmount),
                PaidRevenue = orders.Where(o => o.PaymentStatus == PaymentStatuses.Paid).Sum(o => o.TotalAmount),
                Orders = booked.Count,
                AverageOrderValue = booked.Count == 0 ? 0 : Math.Round(booked.Average(o => o.TotalAmount), 2),
                Customers = await _context.Users.CountAsync(u => u.Role != "Admin"),
                PeriodRevenue = periodOrders.Sum(o => o.TotalAmount),
                PeriodOrders = periodOrders.Count
            },
            // Things an admin needs to act on
            ActionNeeded = new
            {
                PendingApproval = orders.Count(o => o.OrderStatus == OrderStatuses.PendingApproval),
                AwaitingPayment = orders.Count(o => o.OrderStatus == OrderStatuses.AwaitingPayment),
                ReadyToShip = orders.Count(o => o.OrderStatus == OrderStatuses.Approved || o.OrderStatus == OrderStatuses.Processing),
                RefundDue = orders.Count(o => o.PaymentStatus == PaymentStatuses.RefundDue),
                LowStock = lowStock.Count
            },
            StatusCounts = statusCounts,
            RevenueByDay = revenueByDay,
            TopBooks = topBooks,
            LowStock = lowStock,
            RecentOrders = recentOrders,
            LowStockThreshold
        });
    }
}
