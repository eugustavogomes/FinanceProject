public record ResetPasswordDto
{
    public string? Email { get; init; }
    public string? NewPassword { get; init; }
}
