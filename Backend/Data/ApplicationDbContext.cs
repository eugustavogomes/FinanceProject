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
}
}