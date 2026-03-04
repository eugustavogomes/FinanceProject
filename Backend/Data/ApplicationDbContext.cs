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

 protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    base.OnModelCreating(modelBuilder);

    modelBuilder.Entity<User>().ToTable("users");
    modelBuilder.Entity<Category>().ToTable("categories");
    modelBuilder.Entity<Transaction>().ToTable("transactions");
    modelBuilder.Entity<Goal>().ToTable("goals");

    // Categories (1:N)
    modelBuilder.Entity<Category>()
        .HasOne(c => c.User)
        .WithMany(u => u.Categories)
        .HasForeignKey(c => c.UserId)
        .OnDelete(DeleteBehavior.Cascade);

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
}
}