using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using BookShopApi.Data;
using BookShopApi.Models;
using BookShopApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookShopApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class BooksController : ControllerBase
{
    private const int NewArrivalDays = 30;
    private const int BestsellerCount = 3;

    private readonly BookShopContext _context;

    public BooksController(BookShopContext context)
    {
        _context = context;
    }

    private int? CurrentUserId => int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var id) ? id : null;

    /// <summary>Ratings, sales and badges computed from real data (replaces the old id-based "badges").</summary>
    private async Task<Func<Book, object>> BuildViewAsync()
    {
        var ratings = await _context.Reviews
            .GroupBy(r => r.BookId)
            .Select(g => new { BookId = g.Key, Average = g.Average(r => r.Rating), Count = g.Count() })
            .ToDictionaryAsync(r => r.BookId);

        var sold = await _context.OrderItems
            .Where(i => i.Order.OrderStatus != OrderStatuses.Cancelled
                     && i.Order.OrderStatus != OrderStatuses.Rejected
                     && i.Order.OrderStatus != OrderStatuses.AwaitingPayment)
            .GroupBy(i => i.BookId)
            .Select(g => new { BookId = g.Key, Quantity = g.Sum(i => i.Quantity) })
            .ToDictionaryAsync(s => s.BookId, s => s.Quantity);

        var bestsellers = sold.Where(s => s.Value > 0)
            .OrderByDescending(s => s.Value).Take(BestsellerCount)
            .Select(s => s.Key).ToHashSet();
        var newSince = DateTime.UtcNow.AddDays(-NewArrivalDays);

        return book => new
        {
            book.Id,
            book.Title,
            book.Author,
            book.Price,
            book.StockQuantity,
            book.ImageUrl,
            book.Category,
            book.Description,
            book.Publisher,
            book.PublishedYear,
            book.PageCount,
            book.Isbn,
            book.CreatedAt,
            AverageRating = ratings.TryGetValue(book.Id, out var r) ? Math.Round(r.Average, 1) : (double?)null,
            ReviewCount = ratings.TryGetValue(book.Id, out var r2) ? r2.Count : 0,
            SoldCount = sold.GetValueOrDefault(book.Id),
            IsBestseller = bestsellers.Contains(book.Id),
            IsNewArrival = book.CreatedAt >= newSince
        };
    }

    [HttpGet]
    public async Task<IActionResult> GetBooks()
    {
        var books = await _context.Books.AsNoTracking().ToListAsync();
        var view = await BuildViewAsync();
        return Ok(books.Select(view));
    }

    [HttpGet("categories")]
    public ActionResult<IEnumerable<string>> GetCategories() => BookCategories.All;

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetBook(int id)
    {
        var book = await _context.Books.AsNoTracking().FirstOrDefaultAsync(b => b.Id == id);
        if (book == null) return NotFound();
        var view = await BuildViewAsync();
        return Ok(view(book));
    }

    // GET: api/books/5/related  (same category first, then same author)
    [HttpGet("{id:int}/related")]
    public async Task<IActionResult> GetRelated(int id, [FromQuery] int limit = 4)
    {
        var book = await _context.Books.AsNoTracking().FirstOrDefaultAsync(b => b.Id == id);
        if (book == null) return NotFound();

        var candidates = await _context.Books.AsNoTracking()
            .Where(b => b.Id != id && (b.Category == book.Category || b.Author == book.Author))
            .ToListAsync();
        var view = await BuildViewAsync();
        var related = candidates
            .OrderByDescending(b => b.Author == book.Author)
            .ThenByDescending(b => b.StockQuantity > 0)
            .ThenBy(b => b.Title)
            .Take(Math.Clamp(limit, 1, 12))
            .Select(view);
        return Ok(related);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> PostBook(BookInput input)
    {
        if (!BookCategories.IsValid(input.Category))
            return BadRequest(InvalidCategoryMessage(input.Category));

        var book = new Book { CreatedAt = DateTime.UtcNow };
        input.ApplyTo(book);
        _context.Books.Add(book);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetBook), new { id = book.Id }, book);
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> PutBook(int id, BookInput input)
    {
        if (!BookCategories.IsValid(input.Category))
            return BadRequest(InvalidCategoryMessage(input.Category));

        var book = await _context.Books.FindAsync(id);
        if (book == null) return NotFound();

        // Copy editable fields only (CreatedAt etc. are kept)
        input.ApplyTo(book);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteBook(int id)
    {
        var book = await _context.Books.FindAsync(id);
        if (book == null)
            return NotFound();

        // Deleting would break order history; set stock to 0 instead to stop selling it.
        if (await _context.OrderItems.AnyAsync(i => i.BookId == id))
            return Conflict("This book appears in past orders, so it can't be deleted. Set its stock to 0 to stop selling it.");

        _context.CartItems.RemoveRange(_context.CartItems.Where(i => i.BookId == id));
        _context.WishlistItems.RemoveRange(_context.WishlistItems.Where(i => i.BookId == id));
        _context.Reviews.RemoveRange(_context.Reviews.Where(r => r.BookId == id));
        _context.Books.Remove(book);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // POST: api/books/cover  (multipart, field "file") -> { path } to use as ImageUrl
    [HttpPost("cover")]
    [Authorize(Roles = "Admin")]
    [RequestSizeLimit(4 * 1024 * 1024)]
    public async Task<IActionResult> UploadCover(IFormFile file)
    {
        var (path, error) = await UploadStorage.SaveAsync(file, "covers", UploadStorage.ImageTypes, 3 * 1024 * 1024);
        if (error != null) return BadRequest(error);
        return Ok(new { path });
    }

    // ---------- Reviews ----------

    // GET: api/books/5/reviews
    [HttpGet("{id:int}/reviews")]
    public async Task<IActionResult> GetReviews(int id)
    {
        var buyers = await _context.OrderItems
            .Where(i => i.BookId == id && i.Order.OrderStatus == OrderStatuses.Delivered)
            .Select(i => i.Order.UserId)
            .Distinct()
            .ToListAsync();

        var reviews = await _context.Reviews.AsNoTracking()
            .Where(r => r.BookId == id)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new
            {
                r.Id,
                r.Rating,
                r.Title,
                r.Body,
                r.CreatedAt,
                r.UpdatedAt,
                r.UserId,
                // Show first name + initial only
                Author = r.User.FullName
            })
            .ToListAsync();

        var userId = CurrentUserId;
        return Ok(reviews.Select(r => new
        {
            r.Id,
            r.Rating,
            r.Title,
            r.Body,
            r.CreatedAt,
            r.UpdatedAt,
            Author = ShortName(r.Author),
            VerifiedPurchase = buyers.Contains(r.UserId),
            IsMine = userId == r.UserId
        }));
    }

    // PUT: api/books/5/reviews  (create or update the current user's review)
    [HttpPut("{id:int}/reviews")]
    [Authorize]
    public async Task<IActionResult> UpsertReview(int id, ReviewInput input)
    {
        if (!await _context.Books.AnyAsync(b => b.Id == id)) return NotFound();
        var userId = CurrentUserId!.Value;

        var review = await _context.Reviews.FirstOrDefaultAsync(r => r.BookId == id && r.UserId == userId);
        if (review == null)
        {
            review = new Review { BookId = id, UserId = userId, CreatedAt = DateTime.UtcNow };
            _context.Reviews.Add(review);
        }
        review.Rating = input.Rating;
        review.Title = string.IsNullOrWhiteSpace(input.Title) ? null : input.Title.Trim();
        review.Body = input.Body.Trim();
        review.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Ok(new { review.Id });
    }

    // DELETE: api/books/5/reviews/12  (own review, or any review as admin)
    [HttpDelete("{id:int}/reviews/{reviewId:int}")]
    [Authorize]
    public async Task<IActionResult> DeleteReview(int id, int reviewId)
    {
        var review = await _context.Reviews.FirstOrDefaultAsync(r => r.Id == reviewId && r.BookId == id);
        if (review == null) return NotFound();
        if (review.UserId != CurrentUserId && !User.IsInRole("Admin")) return Forbid();

        _context.Reviews.Remove(review);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    private static string ShortName(string fullName)
    {
        var parts = fullName.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
        if (parts.Length == 0) return "Reader";
        return parts.Length == 1 ? parts[0] : $"{parts[0]} {parts[^1][0]}.";
    }

    private static string InvalidCategoryMessage(string? category) =>
        $"Invalid category '{category}'. Allowed: {string.Join(", ", BookCategories.All)}.";
}

public class BookInput
{
    [Required, MaxLength(200)]
    public string Title { get; set; } = string.Empty;
    [Required, MaxLength(150)]
    public string Author { get; set; } = string.Empty;
    [Range(0, 100000)]
    public decimal Price { get; set; }
    [Range(0, 100000)]
    public int StockQuantity { get; set; }
    [MaxLength(500)]
    public string? ImageUrl { get; set; }
    public string Category { get; set; } = string.Empty;
    [MaxLength(4000)]
    public string? Description { get; set; }
    [MaxLength(150)]
    public string? Publisher { get; set; }
    [Range(0, 3000)]
    public int? PublishedYear { get; set; }
    [Range(1, 20000)]
    public int? PageCount { get; set; }
    [MaxLength(20)]
    public string? Isbn { get; set; }

    public void ApplyTo(Book book)
    {
        book.Title = Title.Trim();
        book.Author = Author.Trim();
        book.Price = Price;
        book.StockQuantity = StockQuantity;
        book.ImageUrl = string.IsNullOrWhiteSpace(ImageUrl) ? null : ImageUrl.Trim();
        book.Category = Category;
        book.Description = string.IsNullOrWhiteSpace(Description) ? null : Description.Trim();
        book.Publisher = string.IsNullOrWhiteSpace(Publisher) ? null : Publisher.Trim();
        book.PublishedYear = PublishedYear;
        book.PageCount = PageCount;
        book.Isbn = string.IsNullOrWhiteSpace(Isbn) ? null : Isbn.Trim();
    }
}

public class ReviewInput
{
    [Range(1, 5, ErrorMessage = "Please choose a rating from 1 to 5 stars.")]
    public int Rating { get; set; }

    [MaxLength(120)]
    public string? Title { get; set; }

    [Required(ErrorMessage = "Please write a few words about the book."), MinLength(10, ErrorMessage = "Please write at least 10 characters."), MaxLength(3000)]
    public string Body { get; set; } = string.Empty;
}
