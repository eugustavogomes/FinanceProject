namespace jwtBearer;
public static class Configuration
{
    public static string PrivateKey { get; set; } = Environment.GetEnvironmentVariable("PRIVATE_KEY_JWT");
}
