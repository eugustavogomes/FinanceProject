using SimpleFinance.Api.Models;

namespace SimpleFinance.Api.Dtos;

public record CreateTransactionDto
{
    public decimal Value { get; init; }
    public DateTime Date { get; init; }
    public string? Description { get; init; }
    public TransactionType Type { get; init; }
    public Guid? CategoryId { get; init; }
}
