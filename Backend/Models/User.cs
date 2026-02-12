namespace SimpleFinance.Api.Models;

public class User {
    public Guid Id { get; set; }
    public string? Email { get; set; }
    public string? PasswordHash { get; set; }
    public ICollection<Transaction>? Transactions { get; set; }
}