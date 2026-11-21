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

[ApiController]
public class ContactController : ControllerBase
{
    private readonly BookShopContext _context;
    private readonly IEmailSender _email;
    private readonly EmailSettings _emailSettings;

    public ContactController(BookShopContext context, IEmailSender email, IOptions<EmailSettings> emailSettings)
    {
        _context = context;
        _email = email;
        _emailSettings = emailSettings.Value;
    }

    // POST: api/contact
    [HttpPost("api/contact")]
    [AllowAnonymous]
    public async Task<IActionResult> Send(ContactRequest request)
    {
        // Simple flood protection: at most 5 messages per email address per hour
        var email = request.Email.Trim().ToLowerInvariant();
        var hourAgo = DateTime.UtcNow.AddHours(-1);
        if (await _context.ContactMessages.CountAsync(m => m.Email == email && m.CreatedAt > hourAgo) >= 5)
            return StatusCode(429, "You've sent several messages recently. Please wait a little before sending another.");

        int? userId = int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var id) ? id : null;
        var message = new ContactMessage
        {
            Name = request.Name.Trim(),
            Email = email,
            Subject = request.Subject.Trim(),
            Message = request.Message.Trim(),
            UserId = userId
        };
        _context.ContactMessages.Add(message);
        await _context.SaveChangesAsync();

        if (!string.IsNullOrWhiteSpace(_emailSettings.ShopInbox))
        {
            await _email.SendAsync(_emailSettings.ShopInbox, $"Contact form: {message.Subject}",
                $"From: {message.Name} <{message.Email}>\n\n{message.Message}");
        }

        return Ok(new { message = "Thank you. We'll reply within one business day." });
    }

    // POST: api/newsletter  { email }
    [HttpPost("api/newsletter")]
    [AllowAnonymous]
    public async Task<IActionResult> Subscribe(NewsletterRequest request)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        if (!await _context.NewsletterSubscribers.AnyAsync(s => s.Email == email))
        {
            _context.NewsletterSubscribers.Add(new NewsletterSubscriber { Email = email });
            await _context.SaveChangesAsync();
        }
        // Same answer whether or not they were already subscribed
        return Ok(new { message = "You're on the list. Look out for our next letter." });
    }

    // GET: api/admin/messages
    [HttpGet("api/admin/messages")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetMessages()
    {
        var messages = await _context.ContactMessages.AsNoTracking()
            .OrderBy(m => m.IsHandled)
            .ThenByDescending(m => m.CreatedAt)
            .ToListAsync();
        var subscribers = await _context.NewsletterSubscribers.CountAsync();
        return Ok(new { messages, newsletterSubscribers = subscribers });
    }

    // PUT: api/admin/messages/5/handled  { isHandled: true }
    [HttpPut("api/admin/messages/{id:int}/handled")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> SetHandled(int id, [FromBody] SetHandledRequest request)
    {
        var message = await _context.ContactMessages.FindAsync(id);
        if (message == null) return NotFound();
        message.IsHandled = request.IsHandled;
        await _context.SaveChangesAsync();
        return NoContent();
    }
}

public class ContactRequest
{
    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required, EmailAddress, MaxLength(100)]
    public string Email { get; set; } = string.Empty;

    [Required, MaxLength(150)]
    public string Subject { get; set; } = string.Empty;

    [Required, MaxLength(4000)]
    public string Message { get; set; } = string.Empty;
}

public class NewsletterRequest
{
    [Required, EmailAddress, MaxLength(100)]
    public string Email { get; set; } = string.Empty;
}

public class SetHandledRequest
{
    public bool IsHandled { get; set; }
}
