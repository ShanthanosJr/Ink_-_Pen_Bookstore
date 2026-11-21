using System.ComponentModel.DataAnnotations;
using BookShopApi.Data;
using BookShopApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookShopApi.Controllers;

[Route("api/admin/coupons")]
[ApiController]
[Authorize(Roles = "Admin")]
public class AdminCouponsController : ControllerBase
{
    private readonly BookShopContext _context;

    public AdminCouponsController(BookShopContext context)
    {
        _context = context;
    }

    // GET: api/admin/coupons  (with how many orders used each code)
    [HttpGet]
    public async Task<IActionResult> GetCoupons()
    {
        var coupons = await _context.Coupons.AsNoTracking().OrderBy(c => c.Code).ToListAsync();
        var used = await _context.Orders
            .Where(o => o.CouponCode != null && o.OrderStatus != OrderStatuses.Cancelled && o.OrderStatus != OrderStatuses.Rejected)
            .GroupBy(o => o.CouponCode!)
            .Select(g => new { Code = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.Code, x => x.Count);

        return Ok(coupons.Select(c => new
        {
            c.Id, c.Code, c.PercentOff, c.FirstOrderOnly, c.MinSubtotal, c.IsActive, c.ExpiresAt,
            TimesUsed = used.GetValueOrDefault(c.Code)
        }));
    }

    [HttpPost]
    public async Task<IActionResult> Create(CouponInput input)
    {
        var code = input.Code.Trim().ToUpperInvariant();
        if (await _context.Coupons.AnyAsync(c => c.Code == code))
            return BadRequest($"A coupon called {code} already exists.");

        var coupon = new Coupon { Code = code };
        input.ApplyTo(coupon);
        _context.Coupons.Add(coupon);
        await _context.SaveChangesAsync();
        return Ok(new { coupon.Id });
    }

    // The code itself can't change once created (past orders refer to it)
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, CouponInput input)
    {
        var coupon = await _context.Coupons.FindAsync(id);
        if (coupon == null) return NotFound();
        input.ApplyTo(coupon);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    // Unused coupons are deleted; used ones are switched off so order history keeps making sense
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var coupon = await _context.Coupons.FindAsync(id);
        if (coupon == null) return NotFound();

        if (await _context.Orders.AnyAsync(o => o.CouponCode == coupon.Code))
        {
            coupon.IsActive = false;
            await _context.SaveChangesAsync();
            return Ok(new { deactivated = true, message = $"{coupon.Code} has been used on orders, so it was switched off instead of deleted." });
        }

        _context.Coupons.Remove(coupon);
        await _context.SaveChangesAsync();
        return Ok(new { deactivated = false, message = $"{coupon.Code} deleted." });
    }
}

public class CouponInput
{
    [Required, RegularExpression("^[A-Za-z0-9]{3,20}$", ErrorMessage = "Codes are 3 to 20 letters or digits, no spaces.")]
    public string Code { get; set; } = string.Empty;

    [Range(1, 100, ErrorMessage = "The discount must be between 1% and 100%.")]
    public decimal PercentOff { get; set; }

    public bool FirstOrderOnly { get; set; }

    [Range(0, 100000)]
    public decimal MinSubtotal { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime? ExpiresAt { get; set; }

    public void ApplyTo(Coupon coupon)
    {
        coupon.PercentOff = PercentOff;
        coupon.FirstOrderOnly = FirstOrderOnly;
        coupon.MinSubtotal = MinSubtotal;
        coupon.IsActive = IsActive;
        coupon.ExpiresAt = ExpiresAt?.ToUniversalTime();
    }
}
