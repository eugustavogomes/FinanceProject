namespace SimpleFinance.Api.Models;

public class Investment
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public User? User { get; set; }

    public string Name { get; set; } = string.Empty;
    public string? Category { get; set; }
    public decimal CurrentValue { get; set; }
    public decimal InvestedAmount { get; set; }
    public decimal? ExpectedReturnYearly { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
