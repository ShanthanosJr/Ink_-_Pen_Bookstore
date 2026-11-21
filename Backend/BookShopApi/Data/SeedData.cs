using BookShopApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BookShopApi.Data;

public static class SeedData
{
    public static void Initialize(IServiceProvider serviceProvider)
    {
        using var context = serviceProvider.GetRequiredService<BookShopContext>();

        // ✅ Safe migration
        context.Database.Migrate();

        // Users created before the AdminFeatures migration got an empty Role; treat them as regular users.
        var usersWithoutRole = context.Users.Where(u => u.Role == null || u.Role == "").ToList();
        foreach (var user in usersWithoutRole)
        {
            user.Role = "User";
        }

        // Check each book individually to prevent duplicates while preserving existing data (matched by title)
        var seedBooks = new List<Book>
        {
            // Fiction
            new Book
            {
                Title = "The Great Gatsby",
                Category = "Fiction",
                Author = "F. Scott Fitzgerald",
                Price = 10.99M,
                StockQuantity = 50,
                ImageUrl = "https://images.unsplash.com/photo-1543004286-64645f5f6775?auto=format&fit=crop&q=80&w=800"
            },
            new Book
            {
                Title = "1984",
                Category = "Fiction",
                Author = "George Orwell",
                Price = 9.99M,
                StockQuantity = 30,
                ImageUrl = "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=800"
            },
            new Book
            {
                Title = "To Kill a Mockingbird",
                Category = "Fiction",
                Author = "Harper Lee",
                Price = 12.50M,
                StockQuantity = 45,
                ImageUrl = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800"
            },
            new Book
            {
                Title = "The Hobbit",
                Category = "Fiction",
                Author = "J.R.R. Tolkien",
                Price = 15.00M,
                StockQuantity = 20,
                ImageUrl = "https://images.unsplash.com/photo-1621351123061-f4427e696f15?auto=format&fit=crop&q=80&w=800"
            },
            new Book
            {
                Title = "Frankenstein",
                Category = "Fiction",
                Author = "Mary Shelley",
                Price = 14.25M,
                StockQuantity = 12,
                ImageUrl = "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800"
            },

            // Technology
            new Book
            {
                Title = "Clean Code",
                Category = "Technology",
                Author = "Robert C. Martin",
                Price = 35.00M,
                StockQuantity = 15,
                ImageUrl = "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=800"
            },
            new Book
            {
                Title = "The Pragmatic Programmer",
                Category = "Technology",
                Author = "Andrew Hunt",
                Price = 40.00M,
                StockQuantity = 10,
                ImageUrl = "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=800"
            },
            new Book
            {
                Title = "Design Patterns",
                Category = "Technology",
                Author = "Erich Gamma",
                Price = 45.99M,
                StockQuantity = 5,
                ImageUrl = "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=800"
            },

            // Design
            new Book
            {
                Title = "Don't Make Me Think",
                Category = "Art & Design",
                Author = "Steve Krug",
                Price = 25.00M,
                StockQuantity = 25,
                ImageUrl = "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80&w=800"
            },
             new Book
            {
                Title = "Refactoring UI",
                Category = "Art & Design",
                Author = "Adam Wathan",
                Price = 50.00M,
                StockQuantity = 8,
                ImageUrl = "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800"
            },

            // History / Philosophy
            new Book
            {
                Title = "Sapiens",
                Category = "History",
                Author = "Yuval Noah Harari",
                Price = 18.99M,
                StockQuantity = 60,
                ImageUrl = "https://images.unsplash.com/photo-1461360228754-6e81c478c882?auto=format&fit=crop&q=80&w=800"
            },
            new Book
            {
                Title = "The Art of War",
                Category = "History",
                Author = "Sun Tzu",
                Price = 12.00M,
                StockQuantity = 40,
                ImageUrl = "https://images.unsplash.com/photo-1543004286-64645f5f6775?auto=format&fit=crop&q=80&w=800"
            },
            new Book
            {
                Title = "The Alchemist",
                Category = "Fiction",
                Author = "Paulo Coelho",
                Price = 14.99M,
                StockQuantity = 40,
                ImageUrl = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800"
            },
            new Book
            {
                Title = "Atomic Habits",
                Category = "Non-Fiction",
                Author = "James Clear",
                Price = 21.00M,
                StockQuantity = 55,
                ImageUrl = "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&q=80&w=800"
            },
            new Book
            {
                Title = "Thinking, Fast and Slow",
                Category = "Non-Fiction",
                Author = "Daniel Kahneman",
                Price = 16.50M,
                StockQuantity = 18,
                ImageUrl = "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800"
            }
        };

        foreach (var book in seedBooks)
        {
            // Check if a book with this title already exists
            var existing = context.Books.FirstOrDefault(b => b.Title == book.Title);
            if (existing == null)
            {
                context.Books.Add(book);
            }
            else if (string.IsNullOrEmpty(existing.Category))
            {
                // Backfill category for books created before the Category column existed
                existing.Category = book.Category;
            }
        }

        context.SaveChanges();
    }
}
