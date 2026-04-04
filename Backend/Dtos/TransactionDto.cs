using SimpleFinance.Api.Models;

namespace SimpleFinance.Api.Dtos;

public record TransactionDto
{
    public Guid Id { get; init; }
    public decimal Value { get; init; }
    public DateTime Date { get; init; }
    public string? Description { get; init; }
    public TransactionType Type { get; init; }
    public Guid? CategoryId { get; init; }
    public string? CategoryName { get; init; }
}
