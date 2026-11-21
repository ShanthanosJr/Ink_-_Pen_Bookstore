using BookShopApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace BookShopApi.Data;

public class BookShopContext : DbContext
{
    // Fixed timestamp for seeded rows (HasData needs deterministic values)
    private static readonly DateTime SeedDate = new(2026, 2, 5, 0, 0, 0, DateTimeKind.Utc);

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
    public DbSet<OrderStatusHistory> OrderStatusHistory { get; set; }
    public DbSet<Coupon> Coupons { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<WishlistItem> WishlistItems { get; set; }
    public DbSet<ContactMessage> ContactMessages { get; set; }
    public DbSet<NewsletterSubscriber> NewsletterSubscribers { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // SQLite stores DateTime without a time zone. Every DateTime here is written as UTC,
        // so mark it as UTC when reading; otherwise JSON omits the "Z" and browsers treat it as local time.
        var utcConverter = new ValueConverter<DateTime, DateTime>(
            v => v.Kind == DateTimeKind.Utc ? v : v.ToUniversalTime(),
            v => DateTime.SpecifyKind(v, DateTimeKind.Utc));
        var nullableUtcConverter = new ValueConverter<DateTime?, DateTime?>(
            v => v == null ? v : (v.Value.Kind == DateTimeKind.Utc ? v : v.Value.ToUniversalTime()),
            v => v == null ? v : DateTime.SpecifyKind(v.Value, DateTimeKind.Utc));
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            foreach (var property in entityType.GetProperties())
            {
                if (property.ClrType == typeof(DateTime)) property.SetValueConverter(utcConverter);
                else if (property.ClrType == typeof(DateTime?)) property.SetValueConverter(nullableUtcConverter);
            }
        }

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

        modelBuilder.Entity<OrderStatusHistory>()
            .HasOne(h => h.Order)
            .WithMany(o => o.StatusHistory)
            .HasForeignKey(h => h.OrderId);

        // Keep order history intact: a book that has been ordered cannot be deleted
        modelBuilder.Entity<OrderItem>()
            .HasOne(i => i.Book)
            .WithMany()
            .HasForeignKey(i => i.BookId)
            .OnDelete(DeleteBehavior.Restrict);

        // One review and one wishlist entry per customer per book
        modelBuilder.Entity<Review>().HasIndex(r => new { r.BookId, r.UserId }).IsUnique();
        modelBuilder.Entity<WishlistItem>().HasIndex(w => new { w.UserId, w.BookId }).IsUnique();
        modelBuilder.Entity<NewsletterSubscriber>().HasIndex(n => n.Email).IsUnique();

        modelBuilder.Entity<Coupon>()
            .HasIndex(c => c.Code)
            .IsUnique();

        modelBuilder.Entity<Coupon>().HasData(
            new Coupon { Id = 1, Code = "WELCOME50", PercentOff = 50, FirstOrderOnly = true, MinSubtotal = 0, IsActive = true }
        );

        // Seed data (Legacy - relying on SeedData.cs mostly now, but keeping for consistency if valid)
        // If these IDs conflict with SeedData, SeedData will just skip them because it checks Titles.
        modelBuilder.Entity<Book>().HasData(
            new Book { Id = 1, CreatedAt = SeedDate, Title = "The Great Gatsby", Category = "Fiction", Author = "F. Scott Fitzgerald", Price = 12.99m, StockQuantity = 100, ImageUrl = "https://images.unsplash.com/photo-1543004286-64645f5f6775?auto=format&fit=crop&q=80&w=800" },
            new Book { Id = 2, CreatedAt = SeedDate, Title = "1984", Category = "Fiction", Author = "George Orwell", Price = 10.99m, StockQuantity = 50, ImageUrl = "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=800" },
            new Book { Id = 3, CreatedAt = SeedDate, Title = "Clean Code", Category = "Technology", Author = "Robert C. Martin", Price = 35.50m, StockQuantity = 20, ImageUrl = "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=800" }
        );
    }
}
