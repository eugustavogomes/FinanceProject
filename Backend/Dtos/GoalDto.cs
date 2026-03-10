namespace SimpleFinance.Api.Dtos;

public class GoalDto
{
    public decimal Target { get; set; }
    public string? Category { get; set; }
    public int Month { get; set; }
    public int Year { get; set; }
}
