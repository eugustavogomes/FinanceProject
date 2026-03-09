
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace jwtBearer
{
    public static class Configuration
    {
        public static string PrivateKey =>
            Environment.GetEnvironmentVariable("PRIVATE_KEY_JWT")
            ?? throw new Exception("JWT Key is missing in PRIVATE_KEY_JWT!");
        public static string? Issuer { get; private set; }
        public static string? Audience { get; private set; }

        public static void AddJwtAuthentication(this IServiceCollection services, IConfiguration configuration)
        {
            var jwtKey = PrivateKey;
            var key = Encoding.ASCII.GetBytes(jwtKey);

            Issuer = configuration["Jwt:Issuer"];
            Audience = configuration["Jwt:Audience"];

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidIssuer = Issuer,
                    ValidAudience = Audience
                };
            });
        }
    }
}
