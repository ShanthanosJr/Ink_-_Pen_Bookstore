using BookShopApi.Data;
using BookShopApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookShopApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class BooksController : ControllerBase
{
    private readonly BookShopContext _context;

    public BooksController(BookShopContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Book>>> GetBooks()
    {
        return await _context.Books.ToListAsync();
    }

    [HttpGet("categories")]
    public ActionResult<IEnumerable<string>> GetCategories() => BookCategories.All;

    [HttpGet("{id}")]
    public async Task<ActionResult<Book>> GetBook(int id)
    {
        var book = await _context.Books.FindAsync(id);
        if (book == null)
            return NotFound();
        return book;
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<Book>> PostBook(Book book)
    {
        if (!BookCategories.IsValid(book.Category))
            return BadRequest(InvalidCategoryMessage(book.Category));

        _context.Books.Add(book);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetBook), new { id = book.Id }, book);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> PutBook(int id, Book book)
    {
        if (id != book.Id)
            return BadRequest();
        if (!BookCategories.IsValid(book.Category))
            return BadRequest(InvalidCategoryMessage(book.Category));

        _context.Entry(book).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Books.Any(e => e.Id == id))
                return NotFound();
            throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteBook(int id)
    {
        var book = await _context.Books.FindAsync(id);
        if (book == null)
            return NotFound();

        // Deleting would break order history; set stock to 0 instead to stop selling it.
        if (await _context.OrderItems.AnyAsync(i => i.BookId == id))
            return Conflict("This book appears in past orders, so it can't be deleted. Set its stock to 0 to stop selling it.");

        // Remove it from any carts first
        _context.CartItems.RemoveRange(_context.CartItems.Where(i => i.BookId == id));
        _context.Books.Remove(book);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private static string InvalidCategoryMessage(string? category) =>
        $"Invalid category '{category}'. Allowed: {string.Join(", ", BookCategories.All)}.";
}
