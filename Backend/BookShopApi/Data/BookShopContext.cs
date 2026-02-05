using BookShopApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BookShopApi.Data;

public class BookShopContext : DbContext
{
    public BookShopContext(DbContextOptions<BookShopContext> options) : base(options)
    {
    }

    public DbSet<Book> Books { get; set; }
    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();
        
        // Seed data
        modelBuilder.Entity<Book>().HasData(
            new Book { Id = 1, Title = "The Great Gatsby", Author = "F. Scott Fitzgerald", Price = 12.99m, StockQuantity = 100 },
            new Book { Id = 2, Title = "1984", Author = "George Orwell", Price = 10.99m, StockQuantity = 50 },
            new Book { Id = 3, Title = "Clean Code", Author = "Robert C. Martin", Price = 35.50m, StockQuantity = 20 }
        );
    }
}
