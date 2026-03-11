using SimpleFinance.Api.Models;

namespace SimpleFinance.Api.Dtos;

public class CategoryDto
{
    public Guid Id { get; set; }
    public string? Name { get; set; }
    public bool IsActive { get; set; }
    public TransactionType Type { get; set; }
    public Guid UserId { get; set; }
}
