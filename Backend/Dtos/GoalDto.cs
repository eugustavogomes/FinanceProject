namespace SimpleFinance.Api.Dtos;

public record GoalDto
{
    public decimal Target { get; init; }
    public string? Category { get; init; }
    public int Month { get; init; }
    public int Year { get; init; }
}
