namespace SimpleFinance.Api.Models;

public class Category {
    public int Id { get; set; }
    public string Name { get; set; }
    public string Type { get; set; }
    public ICollection<Transaction> Transactions { get; set; }
}
