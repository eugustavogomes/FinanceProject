using SimpleFinance.Api.Models;

namespace SimpleFinance.Api.Dtos;

public class TransactionDto
{
    public Guid Id { get; set; }
    public decimal Value { get; set; }
    public DateTime Date { get; set; }
    public string? Description { get; set; }
    public TransactionType Type { get; set; }
    public Guid? CategoryId { get; set; }
    public string? CategoryName { get; set; }
}
