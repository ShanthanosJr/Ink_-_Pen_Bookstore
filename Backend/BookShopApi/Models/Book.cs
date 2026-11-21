namespace BookShopApi.Models;

public class Book
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int StockQuantity { get; set; }
    public string? ImageUrl { get; set; }
    // One of BookCategories.All (kept in sync with the frontend's src/constants/categories.js)
    public string Category { get; set; } = string.Empty;

    // Catalogue details (all optional)
    public string? Description { get; set; }
    public string? Publisher { get; set; }
    public int? PublishedYear { get; set; }
    public int? PageCount { get; set; }
    public string? Isbn { get; set; }

    // When the book was added to the shop; drives "New arrival"
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public static class BookCategories
{
    public static readonly string[] All =
    {
        "Fiction", "Non-Fiction", "Technology", "Education", "History", "Art & Design"
    };

    public static bool IsValid(string? category) => category != null && All.Contains(category);
}
