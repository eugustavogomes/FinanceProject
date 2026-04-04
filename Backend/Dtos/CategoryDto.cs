using SimpleFinance.Api.Models;

namespace SimpleFinance.Api.Dtos;

public record CategoryDto
{
    public Guid Id { get; init; }
    public string? Name { get; init; }
    public bool IsActive { get; init; }
    public TransactionType Type { get; init; }
    public Guid UserId { get; init; }
}
