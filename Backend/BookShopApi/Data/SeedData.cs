using BookShopApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BookShopApi.Data;

public static class SeedData
{
    private static readonly DateTime SeedDate = new(2026, 2, 5, 0, 0, 0, DateTimeKind.Utc);

    public static void Initialize(IServiceProvider serviceProvider)
    {
        using var context = serviceProvider.GetRequiredService<BookShopContext>();

        // ✅ Safe migration
        context.Database.Migrate();

        // Make sure the accounts listed in Admin:BootstrapEmails are admins (the way to create the first admin,
        // now that sign-up no longer grants admin rights).
        var config = serviceProvider.GetRequiredService<IConfiguration>();
        var bootstrapEmails = config.GetSection("Admin:BootstrapEmails").Get<string[]>() ?? Array.Empty<string>();
        foreach (var email in bootstrapEmails.Select(e => e.Trim().ToLowerInvariant()).Where(e => e.Length > 0))
        {
            var admin = context.Users.FirstOrDefault(u => u.Email.ToLower() == email);
            if (admin != null && admin.Role != "Admin") admin.Role = "Admin";
        }

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
                Description = "Jay Gatsby throws glittering parties on Long Island in pursuit of a lost love, and narrator Nick Carraway watches the American dream curdle in the summer of 1922.",
                PublishedYear = 1925,
                CreatedAt = SeedDate,
                Category = "Fiction",
                Author = "F. Scott Fitzgerald",
                Price = 10.99M,
                StockQuantity = 50,
                ImageUrl = "https://images.unsplash.com/photo-1543004286-64645f5f6775?auto=format&fit=crop&q=80&w=800"
            },
            new Book
            {
                Title = "1984",
                Description = "In a superstate where the Party rewrites history and watches every citizen, Winston Smith risks everything on a quiet act of rebellion.",
                PublishedYear = 1949,
                CreatedAt = SeedDate,
                Category = "Fiction",
                Author = "George Orwell",
                Price = 9.99M,
                StockQuantity = 30,
                ImageUrl = "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=800"
            },
            new Book
            {
                Title = "To Kill a Mockingbird",
                Description = "Through the eyes of young Scout Finch, a small Alabama town is tested when her father defends a Black man accused of a crime he did not commit.",
                PublishedYear = 1960,
                CreatedAt = SeedDate,
                Category = "Fiction",
                Author = "Harper Lee",
                Price = 12.50M,
                StockQuantity = 45,
                ImageUrl = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800"
            },
            new Book
            {
                Title = "The Hobbit",
                Description = "Bilbo Baggins is swept out of his comfortable hole and into a quest with thirteen dwarves, a wizard, and a dragon guarding a mountain of gold.",
                PublishedYear = 1937,
                CreatedAt = SeedDate,
                Category = "Fiction",
                Author = "J.R.R. Tolkien",
                Price = 15.00M,
                StockQuantity = 20,
                ImageUrl = "https://images.unsplash.com/photo-1621351123061-f4427e696f15?auto=format&fit=crop&q=80&w=800"
            },
            new Book
            {
                Title = "Frankenstein",
                Description = "A young scientist brings a creature to life and then abandons it, setting off a tragedy about ambition, responsibility, and loneliness.",
                PublishedYear = 1818,
                CreatedAt = SeedDate,
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
                Description = "A practical guide to writing code that other people can read and change, with principles and worked examples for naming, functions, and tests.",
                PublishedYear = 2008,
                CreatedAt = SeedDate,
                Category = "Technology",
                Author = "Robert C. Martin",
                Price = 35.00M,
                StockQuantity = 15,
                ImageUrl = "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=800"
            },
            new Book
            {
                Title = "The Pragmatic Programmer",
                Description = "Down-to-earth advice for working software developers, from managing knowledge and avoiding duplication to building software that adapts.",
                PublishedYear = 1999,
                CreatedAt = SeedDate,
                Category = "Technology",
                Author = "Andrew Hunt",
                Price = 40.00M,
                StockQuantity = 10,
                ImageUrl = "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=800"
            },
            new Book
            {
                Title = "Design Patterns",
                Description = "The classic catalogue of reusable object-oriented design solutions, describing when and how to apply each pattern.",
                PublishedYear = 1994,
                CreatedAt = SeedDate,
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
                Description = "A short, friendly book on web usability that shows why clear, self-evident design matters and how to test it cheaply.",
                PublishedYear = 2000,
                CreatedAt = SeedDate,
                Category = "Art & Design",
                Author = "Steve Krug",
                Price = 25.00M,
                StockQuantity = 25,
                ImageUrl = "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80&w=800"
            },
             new Book
            {
                Title = "Refactoring UI",
                Description = "Tactical, visual advice for developers who want interfaces that look professional, covering hierarchy, spacing, colour, and typography.",
                PublishedYear = 2018,
                CreatedAt = SeedDate,
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
                Description = "A sweeping account of how Homo sapiens came to dominate the planet, from the cognitive revolution to empires, money, and science.",
                PublishedYear = 2011,
                CreatedAt = SeedDate,
                Category = "History",
                Author = "Yuval Noah Harari",
                Price = 18.99M,
                StockQuantity = 60,
                ImageUrl = "https://images.unsplash.com/photo-1461360228754-6e81c478c882?auto=format&fit=crop&q=80&w=800"
            },
            new Book
            {
                Title = "The Art of War",
                Description = "An ancient Chinese treatise on strategy and leadership whose short chapters are still read for lessons on conflict and planning.",
                CreatedAt = SeedDate,
                Category = "History",
                Author = "Sun Tzu",
                Price = 12.00M,
                StockQuantity = 40,
                ImageUrl = "https://images.unsplash.com/photo-1543004286-64645f5f6775?auto=format&fit=crop&q=80&w=800"
            },
            new Book
            {
                Title = "The Alchemist",
                Description = "A young Andalusian shepherd travels to the Egyptian desert in search of treasure and learns to listen to his heart along the way.",
                PublishedYear = 1988,
                CreatedAt = SeedDate,
                Category = "Fiction",
                Author = "Paulo Coelho",
                Price = 14.99M,
                StockQuantity = 40,
                ImageUrl = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800"
            },
            new Book
            {
                Title = "Atomic Habits",
                Description = "A framework for building good habits and breaking bad ones through small, consistent changes that compound over time.",
                PublishedYear = 2018,
                CreatedAt = SeedDate,
                Category = "Non-Fiction",
                Author = "James Clear",
                Price = 21.00M,
                StockQuantity = 55,
                ImageUrl = "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&q=80&w=800"
            },
            new Book
            {
                Title = "Thinking, Fast and Slow",
                Description = "A Nobel-winning psychologist explains the two systems that drive how we think, and the biases that shape our judgements and choices.",
                PublishedYear = 2011,
                CreatedAt = SeedDate,
                Category = "Non-Fiction",
                Author = "Daniel Kahneman",
                Price = 16.50M,
                StockQuantity = 18,
                ImageUrl = "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800"
            },

            // Education
            EducationBook("Make It Stick: The Science of Successful Learning", "Peter C. Brown, Henry L. Roediger III & Mark A. McDaniel",
                "Cognitive scientists explain why rereading and cramming fail, and how retrieval practice, spacing and interleaving make learning last.",
                2014, "Belknap Press of Harvard University Press", 336, "9780674729018", 19.95M, 35),
            EducationBook("How to Read a Book", "Mortimer J. Adler & Charles Van Doren",
                "The classic guide to active reading, from inspectional skimming to analytical and comparative reading across many books on one subject.",
                1972, "Simon & Schuster", 426, "9780671212094", 17.00M, 30),
            EducationBook("Mindset: The New Psychology of Success", "Carol S. Dweck",
                "Stanford psychologist Carol Dweck shows how believing abilities can grow, rather than being fixed, changes how we learn, teach and lead.",
                2006, "Ballantine Books", 276, "9780345472328", 18.00M, 45),
            EducationBook("A Mind for Numbers", "Barbara Oakley",
                "An engineering professor who once failed maths shares practical techniques for learning science and maths, from chunking to beating procrastination.",
                2014, "TarcherPerigee", 336, "9780399165245", 17.50M, 25),
            EducationBook("Ultralearning", "Scott H. Young",
                "Nine principles for teaching yourself hard skills quickly and deliberately, drawn from self-directed learners who mastered languages, art and code.",
                2019, "Harper Business", 304, "9780062852687", 22.99M, 20),
            EducationBook("The Elements of Style", "William Strunk Jr. & E. B. White",
                "The concise handbook of English usage and composition that has taught generations of students to write clearly and omit needless words.",
                1959, "Longman", 105, "9780205309023", 9.95M, 60),
            EducationBook("A Brief History of Time", "Stephen Hawking",
                "From the Big Bang to black holes, Stephen Hawking explains the nature of space and time for readers with no background in physics.",
                1988, "Bantam", 212, "9780553380163", 18.00M, 40),
            EducationBook("Cosmos", "Carl Sagan",
                "Carl Sagan's companion to the landmark television series traces fifteen billion years of cosmic evolution and the story of science itself.",
                1980, "Ballantine Books", 432, "9780345539434", 19.00M, 30),
            EducationBook("Pedagogy of the Oppressed", "Paulo Freire",
                "Paulo Freire's founding text of critical pedagogy argues for education as a dialogue between teachers and learners rather than the deposit of facts.",
                1968, "Continuum", 183, "9780826412768", 16.95M, 15)
        };

        foreach (var book in seedBooks)
        {
            // Check if a book with this title already exists
            var existing = context.Books.FirstOrDefault(b => b.Title == book.Title);
            if (existing == null)
            {
                context.Books.Add(book);
            }
            else
            {
                // Backfill fields added after the book was first created
                if (string.IsNullOrEmpty(existing.Category)) existing.Category = book.Category;
                if (string.IsNullOrEmpty(existing.Description)) existing.Description = book.Description;
                existing.PublishedYear ??= book.PublishedYear;
            }
        }

        context.SaveChanges();
    }

    // Education titles were added later, so they show up as new arrivals
    private static readonly DateTime EducationAddedDate = new(2026, 11, 22, 0, 0, 0, DateTimeKind.Utc);

    // Covers come from Open Library by ISBN; default=false makes a missing cover a 404 so the shop shows its stand-in cover
    private static Book EducationBook(string title, string author, string description, int year, string publisher,
        int pages, string isbn, decimal price, int stock) => new()
    {
        Title = title,
        Author = author,
        Description = description,
        PublishedYear = year,
        Publisher = publisher,
        PageCount = pages,
        Isbn = isbn,
        Category = "Education",
        Price = price,
        StockQuantity = stock,
        CreatedAt = EducationAddedDate,
        ImageUrl = $"https://covers.openlibrary.org/b/isbn/{isbn}-L.jpg?default=false"
    };
}
