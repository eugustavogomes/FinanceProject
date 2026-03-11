using SimpleFinance.Api.Models;

namespace SimpleFinance.Api.Dtos;

public class CreateTransactionDto
{
    public decimal Value { get; set; }
    public DateTime Date { get; set; }
    public string? Description { get; set; }
    public TransactionType Type { get; set; }
    public Guid? CategoryId { get; set; }
}
