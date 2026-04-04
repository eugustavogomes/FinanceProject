using SimpleFinance.Api.Models;


namespace SimpleFinance.Api.Dtos;

public record CreateCategoryDto
{
    public string Name { get; init; } = string.Empty;
    public TransactionType? Type { get; init; }
}