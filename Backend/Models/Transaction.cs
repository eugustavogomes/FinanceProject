namespace SimpleFinance.Api.Models;

public class Transaction {
    public int Id { get; set; }
    public decimal Value { get; set; }
    public DateTime Date { get; set; }
    public string? Description { get; set; }
    public string? Type { get; set; }
    public int CategoryId { get; set; }
    public Category? Category { get; set; }
    public Guid UserId { get; set; }
    public User? User { get; set; }
}
