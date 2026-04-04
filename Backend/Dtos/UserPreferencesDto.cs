public record UserPreferencesDto
{
    public string? PreferredTheme { get; init; } // "light" | "dark" | "system" (optional)
    public bool? IsSidebarExpanded { get; init; }
}
