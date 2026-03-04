namespace SimpleFinance.Api.Dtos;

public class CreateCategoryDto
{
    public string Name { get; set; } = string.Empty;
    public string? Type { get; set; }
}