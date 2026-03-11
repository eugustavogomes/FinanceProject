namespace SimpleFinance.Api.Models;

public class User {
    public Guid Id { get; set; }
    public string? Username { get; set; }
    public string? Name { get; set; }
    public string? Email { get; set; }
    public string? PasswordHash { get; set; }
    public string? PreferredTheme { get; set; }
    public bool IsSidebarExpanded { get; set; } = true;
    public ICollection<Transaction>? Transactions { get; set; }
    public ICollection<Category>? Categories { get; set; }
    public ICollection<Investment>? Investments { get; set; }
}