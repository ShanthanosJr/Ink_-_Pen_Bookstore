using BookShopApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BookShopApi.Data;

public static class SeedData
{
    public static void Initialize(IServiceProvider serviceProvider)
    {
        using (var context = new BookShopContext(
            serviceProvider.GetRequiredService<DbContextOptions<BookShopContext>>()))
        {
            context.Database.EnsureCreated();

            // Look for any books.
            if (context.Books.Any())
            {
                // If they exist but might not have more than 10, we could clear and re-seed, 
                // but since the user specifically asked for "one more book", I'll just check if they are already there.
                if (context.Books.Count() >= 12) return;
                
                // For simplicity in this demo, if the user wants "one more", I'll just clear and re-seed 
                // to ensure the order and images are correct as per the new plan.
                context.Books.RemoveRange(context.Books);
                context.SaveChanges();
            }

            context.Books.AddRange(
                // Fiction
                new Book
                {
                    Title = "The Great Gatsby",
                    Author = "F. Scott Fitzgerald",
                    Price = 10.99M,
                    StockQuantity = 50,
                    ImageUrl = "https://images.unsplash.com/photo-1543004286-64645f5f6775?auto=format&fit=crop&q=80&w=800"
                },
                new Book
                {
                    Title = "1984",
                    Author = "George Orwell",
                    Price = 9.99M,
                    StockQuantity = 30,
                    ImageUrl = "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=800"
                },
                new Book
                {
                    Title = "To Kill a Mockingbird",
                    Author = "Harper Lee",
                    Price = 12.50M,
                    StockQuantity = 45,
                    ImageUrl = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800"
                },
                new Book
                {
                    Title = "The Hobbit",
                    Author = "J.R.R. Tolkien",
                    Price = 15.00M,
                    StockQuantity = 20,
                    ImageUrl = "https://images.unsplash.com/photo-1621351123061-f4427e696f15?auto=format&fit=crop&q=80&w=800"
                },
                new Book
                {
                    Title = "Frankenstein",
                    Author = "Mary Shelley",
                    Price = 14.25M,
                    StockQuantity = 12,
                    ImageUrl = "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800"
                },

                // Technology
                new Book
                {
                    Title = "Clean Code",
                    Author = "Robert C. Martin",
                    Price = 35.00M,
                    StockQuantity = 15,
                    ImageUrl = "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=800"
                },
                new Book
                {
                    Title = "The Pragmatic Programmer",
                    Author = "Andrew Hunt",
                    Price = 40.00M,
                    StockQuantity = 10,
                    ImageUrl = "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=800"
                },
                new Book
                {
                    Title = "Design Patterns",
                    Author = "Erich Gamma",
                    Price = 45.99M,
                    StockQuantity = 5,
                    ImageUrl = "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=800"
                },

                // Design
                new Book
                {
                    Title = "Don't Make Me Think",
                    Author = "Steve Krug",
                    Price = 25.00M,
                    StockQuantity = 25,
                    ImageUrl = "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80&w=800"
                },
                 new Book
                {
                    Title = "Refactoring UI",
                    Author = "Adam Wathan",
                    Price = 50.00M,
                    StockQuantity = 8,
                    ImageUrl = "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800"
                },

                // History / Philosophy
                new Book
                {
                    Title = "Sapiens",
                    Author = "Yuval Noah Harari",
                    Price = 18.99M,
                    StockQuantity = 60,
                    ImageUrl = "https://images.unsplash.com/photo-1461360228754-6e81c478c882?auto=format&fit=crop&q=80&w=800"
                },
                new Book
                {
                    Title = "The Art of War",
                    Author = "Sun Tzu",
                    Price = 12.00M,
                    StockQuantity = 40,
                    ImageUrl = "https://images.unsplash.com/photo-1543004286-64645f5f6775?auto=format&fit=crop&q=80&w=800"
                }
            );

            context.SaveChanges();
        }
    }
}
