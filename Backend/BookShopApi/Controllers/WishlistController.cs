using System.Security.Claims;
using BookShopApi.Data;
using BookShopApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookShopApi.Controllers;

[Route("api/wishlist")]
[ApiController]
[Authorize]
public class WishlistController : ControllerBase
{
    private readonly BookShopContext _context;

    public WishlistController(BookShopContext context)
    {
        _context = context;
    }

    private int UserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    // GET: api/wishlist
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var items = await _context.WishlistItems.AsNoTracking()
            .Include(w => w.Book)
            .Where(w => w.UserId == UserId)
            .OrderByDescending(w => w.CreatedAt)
            .ToListAsync();
        return Ok(items);
    }

    // PUT: api/wishlist/5  (idempotent add)
    [HttpPut("{bookId:int}")]
    public async Task<IActionResult> Add(int bookId)
    {
        if (!await _context.Books.AnyAsync(b => b.Id == bookId)) return NotFound("Book not found.");
        if (!await _context.WishlistItems.AnyAsync(w => w.UserId == UserId && w.BookId == bookId))
        {
            _context.WishlistItems.Add(new WishlistItem { UserId = UserId, BookId = bookId });
            await _context.SaveChangesAsync();
        }
        return NoContent();
    }

    // DELETE: api/wishlist/5
    [HttpDelete("{bookId:int}")]
    public async Task<IActionResult> Remove(int bookId)
    {
        var item = await _context.WishlistItems.FirstOrDefaultAsync(w => w.UserId == UserId && w.BookId == bookId);
        if (item != null)
        {
            _context.WishlistItems.Remove(item);
            await _context.SaveChangesAsync();
        }
        return NoContent();
    }
}
