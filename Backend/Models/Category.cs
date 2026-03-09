namespace SimpleFinance.Api.Models;

public class Category {
    public Guid Id { get; set; }
    public string? Name { get; set; }
    public bool IsActive { get; set; } = true;
    public TransactionType Type { get; set; }
    public Guid UserId { get; set; }
    public User? User { get; set; }
    public ICollection<Transaction>? Transactions { get; set; }
}
