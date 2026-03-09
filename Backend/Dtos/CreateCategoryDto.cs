using SimpleFinance.Api.Models;


namespace SimpleFinance.Api.Dtos;

public class CreateCategoryDto
{
    public string Name { get; set; } = string.Empty;
    public TransactionType? Type { get; set; }
}