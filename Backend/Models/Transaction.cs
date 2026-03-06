namespace SimpleFinance.Api.Models;

public class Transaction {
    public Guid Id { get; set; }
    public decimal Value { get; set; }
    public DateTime Date { get; set; }
    public string? Description { get; set; }
    public TransactionType Type { get; set; }
    public Guid? CategoryId { get; set; } 
    public Category? Category { get; set; }
    public Guid UserId { get; set; }
    public User? User { get; set; }
}
