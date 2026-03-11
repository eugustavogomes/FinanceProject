public class UserPreferencesDto
{
    public string? PreferredTheme { get; set; } // "light" | "dark" | "system" (optional)
    public bool? IsSidebarExpanded { get; set; }
}
