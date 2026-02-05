using System.Security.Claims;
using BookShopApi.Data;
using BookShopApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookShopApi.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize] // All cart operations require login
public class CartController : ControllerBase
{
    private readonly BookShopContext _context;

    public CartController(BookShopContext context)
    {
        _context = context;
    }

    private int GetUserId()
    {
        return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
    }

    // GET: api/cart
    [HttpGet]
    public async Task<ActionResult<Cart>> GetCart()
    {
        var userId = GetUserId();
        
        var cart = await _context.Carts
            .Include(c => c.Items)
            .ThenInclude(i => i.Book)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null)
        {
            // Auto-create cart if it doesn't exist
            cart = new Cart { UserId = userId };
            _context.Carts.Add(cart);
            await _context.SaveChangesAsync();
        }

        return cart;
    }

    // POST: api/cart/add
    [HttpPost("add")]
    public async Task<ActionResult<Cart>> AddToCart(AddToCartRequest request)
    {
        var userId = GetUserId();
        var cart = await _context.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null)
        {
            cart = new Cart { UserId = userId };
            _context.Carts.Add(cart);
            await _context.SaveChangesAsync();
        }

        var book = await _context.Books.FindAsync(request.BookId);
        if (book == null) return NotFound("Book not found");

        var existingItem = cart.Items.FirstOrDefault(i => i.BookId == request.BookId);
        if (existingItem != null)
        {
            existingItem.Quantity += request.Quantity;
        }
        else
        {
            cart.Items.Add(new CartItem
            {
                BookId = request.BookId,
                Quantity = request.Quantity,
                UnitPrice = book.Price // Snapshot price
            });
        }

        await _context.SaveChangesAsync();
        
        // Return full cart to update frontend state
        return await GetCart();
    }

    // PUT: api/cart/update/5
    [HttpPut("update/{itemId}")]
    public async Task<ActionResult<Cart>> UpdateQuantity(int itemId, UpdateCartItemRequest request)
    {
        var userId = GetUserId();
        var cart = await _context.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null) return NotFound("Cart not found");

        var item = cart.Items.FirstOrDefault(i => i.Id == itemId);
        if (item == null) return NotFound("Item not found");

        if (request.Quantity <= 0)
        {
            _context.CartItems.Remove(item);
        }
        else
        {
            item.Quantity = request.Quantity;
        }

        await _context.SaveChangesAsync();
        return await GetCart();
    }

    // DELETE: api/cart/remove/5
    [HttpDelete("remove/{itemId}")]
    public async Task<ActionResult<Cart>> RemoveItem(int itemId)
    {
        var userId = GetUserId();
        var cart = await _context.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null) return NotFound("Cart not found");

        var item = cart.Items.FirstOrDefault(i => i.Id == itemId);
        if (item == null) return NotFound("Item not found");

        _context.CartItems.Remove(item);
        await _context.SaveChangesAsync();
        
        return await GetCart();
    }
}

public class AddToCartRequest
{
    public int BookId { get; set; }
    public int Quantity { get; set; } = 1;
}

public class UpdateCartItemRequest
{
    public int Quantity { get; set; }
}
