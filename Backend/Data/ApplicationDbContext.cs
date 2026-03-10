using Microsoft.EntityFrameworkCore;
using SimpleFinance.Api.Models;

namespace SimpleFinance.Api.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Transaction> Transactions { get; set; }
    public DbSet<Goal> Goals { get; set; }
    public DbSet<Investment> Investments { get; set; }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var entries = ChangeTracker.Entries()
            .Where(e => e.State == EntityState.Added || e.State == EntityState.Modified);

        foreach (var entry in entries)
        {
            foreach (var property in entry.Properties)
            {
                if (property.Metadata.ClrType == typeof(DateTime))
                {
                    var dateValue = (DateTime?)property.CurrentValue;
                    if (dateValue.HasValue && dateValue.Value.Kind == DateTimeKind.Unspecified)
                    {
                        property.CurrentValue = DateTime.SpecifyKind(dateValue.Value, DateTimeKind.Utc);
                    }
                }
            }
        }

        return base.SaveChangesAsync(cancellationToken);
    }

 protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    base.OnModelCreating(modelBuilder);

    modelBuilder.Entity<User>().ToTable("users");
    modelBuilder.Entity<Category>().ToTable("categories");
    modelBuilder.Entity<Transaction>().ToTable("transactions");
    modelBuilder.Entity<Goal>().ToTable("goals");
    modelBuilder.Entity<Investment>().ToTable("investments");

    // Categories (1:N)
    modelBuilder.Entity<Category>()
        .HasOne(c => c.User)
        .WithMany(u => u.Categories)
        .HasForeignKey(c => c.UserId)
        .OnDelete(DeleteBehavior.Cascade);

    // Category.Type stored as string ("Income"/"Expense")
    modelBuilder.Entity<Category>()
        .Property(c => c.Type)
        .HasConversion<string>();

    // Transactions (1:N)
    modelBuilder.Entity<Transaction>()
        .HasOne(t => t.User)
        .WithMany(u => u.Transactions)
        .HasForeignKey(t => t.UserId)
        .OnDelete(DeleteBehavior.Cascade);

    //  Transactions (1:N)
    modelBuilder.Entity<Transaction>()
        .HasOne(t => t.Category)
        .WithMany(c => c.Transactions)
        .HasForeignKey(t => t.CategoryId)
        .OnDelete(DeleteBehavior.SetNull);

    modelBuilder.Entity<Transaction>()
        .Property(t => t.Type)
        .HasConversion<string>();

    // Investments (1:N)
    modelBuilder.Entity<Investment>()
        .HasOne(i => i.User)
        .WithMany(u => u.Investments)
        .HasForeignKey(i => i.UserId)
        .OnDelete(DeleteBehavior.Cascade);
}
}