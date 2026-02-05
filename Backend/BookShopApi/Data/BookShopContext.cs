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
    public DbSet<Cart> Carts { get; set; }
    public DbSet<CartItem> CartItems { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<DeliveryDetails> DeliveryDetails { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();
        
        // Cart Relationships
        modelBuilder.Entity<User>()
            .HasOne(u => u.Cart)
            .WithOne(c => c.User)
            .HasForeignKey<Cart>(c => c.UserId);

        // Order Relationships
        modelBuilder.Entity<Order>()
            .HasOne(o => o.User)
            .WithMany()
            .HasForeignKey(o => o.UserId);
            
        modelBuilder.Entity<Order>()
            .HasOne(o => o.DeliveryDetails)
            .WithOne(d => d.Order)
            .HasForeignKey<DeliveryDetails>(d => d.OrderId);

        // Seed data (Legacy - relying on SeedData.cs mostly now, but keeping for consistency if valid)
        // If these IDs conflict with SeedData, SeedData will just skip them because it checks Titles.
        modelBuilder.Entity<Book>().HasData(
            new Book { Id = 1, Title = "The Great Gatsby", Author = "F. Scott Fitzgerald", Price = 12.99m, StockQuantity = 100, ImageUrl = "https://images.unsplash.com/photo-1543004286-64645f5f6775?auto=format&fit=crop&q=80&w=800" },
            new Book { Id = 2, Title = "1984", Author = "George Orwell", Price = 10.99m, StockQuantity = 50, ImageUrl = "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=800" },
            new Book { Id = 3, Title = "Clean Code", Author = "Robert C. Martin", Price = 35.50m, StockQuantity = 20, ImageUrl = "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=800" }
        );
    }
}
