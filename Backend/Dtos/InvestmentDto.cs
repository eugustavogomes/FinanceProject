namespace SimpleFinance.Api.Dtos;

public class InvestmentDto
{
    public string Name { get; set; } = string.Empty;
    public string? Category { get; set; }
    public decimal CurrentValue { get; set; }
    public decimal InvestedAmount { get; set; }
    public decimal? ExpectedReturnYearly { get; set; }
}
