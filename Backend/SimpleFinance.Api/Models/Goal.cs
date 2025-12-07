namespace SimpleFinance.Api.Models;

public class Goal {
    public int Id { get; set; }
    public decimal Target { get; set; }
    public string Category { get; set; }
    public int Month { get; set; }
    public int Year { get; set; }
    public Guid UserId { get; set; }
    public User User { get; set; }
}