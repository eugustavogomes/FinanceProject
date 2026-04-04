namespace SimpleFinance.Api.Dtos;

public record InvestmentDto
{
    public string Name { get; init; } = string.Empty;
    public string? Category { get; init; }
    public decimal CurrentValue { get; init; }
    public decimal InvestedAmount { get; init; }
    public decimal? ExpectedReturnYearly { get; init; }
}
