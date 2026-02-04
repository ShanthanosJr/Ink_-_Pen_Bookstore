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
                return;   // DB has been seeded
            }

            context.Books.AddRange(
                // Fiction
                new Book
                {
                    Title = "The Great Gatsby",
                    Author = "F. Scott Fitzgerald",
                    Price = 10.99M,
                    StockQuantity = 50
                },
                new Book
                {
                    Title = "1984",
                    Author = "George Orwell",
                    Price = 9.99M,
                    StockQuantity = 30
                },
                new Book
                {
                    Title = "To Kill a Mockingbird",
                    Author = "Harper Lee",
                    Price = 12.50M,
                    StockQuantity = 45
                },
                new Book
                {
                    Title = "The Hobbit",
                    Author = "J.R.R. Tolkien",
                    Price = 15.00M,
                    StockQuantity = 20
                },

                // Technology
                new Book
                {
                    Title = "Clean Code",
                    Author = "Robert C. Martin",
                    Price = 35.00M,
                    StockQuantity = 15
                },
                new Book
                {
                    Title = "The Pragmatic Programmer",
                    Author = "Andrew Hunt",
                    Price = 40.00M,
                    StockQuantity = 10
                },
                new Book
                {
                    Title = "Design Patterns",
                    Author = "Erich Gamma",
                    Price = 45.99M,
                    StockQuantity = 5
                },

                // Design
                new Book
                {
                    Title = "Don't Make Me Think",
                    Author = "Steve Krug",
                    Price = 25.00M,
                    StockQuantity = 25
                },
                 new Book
                {
                    Title = "Refactoring UI",
                    Author = "Adam Wathan",
                    Price = 50.00M,
                    StockQuantity = 8
                },

                // History
                new Book
                {
                    Title = "Sapiens",
                    Author = "Yuval Noah Harari",
                    Price = 18.99M,
                    StockQuantity = 60
                }
            );

            context.SaveChanges();
        }
    }
}
