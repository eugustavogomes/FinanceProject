public record UserRegisterDto
{
    public string? Username { get; init; }
    public string? Name { get; init; }
    public string? Email { get; init; }
    public string? Password { get; init; }
}