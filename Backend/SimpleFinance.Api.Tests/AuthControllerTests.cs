using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using SimpleFinance.Api.Controllers;
using SimpleFinance.Api.Data;
using SimpleFinance.Api.Dtos;
using SimpleFinance.Api.Models;
using Xunit;

public class AuthControllerTests
{
    private static ApplicationDbContext CreateContext(string dbName)
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: dbName)
            .Options;

        return new ApplicationDbContext(options);
    }

    private static AuthController CreateController(ApplicationDbContext context)
    {
        var configuration = new ConfigurationBuilder().Build();
        return new AuthController(context, configuration);
    }

    [Fact]
    public async Task Register_ReturnsBadRequest_WhenEmailAlreadyExists()
    {
        using var context = CreateContext(nameof(Register_ReturnsBadRequest_WhenEmailAlreadyExists));
        context.Users.Add(new User
        {
            Id = Guid.NewGuid(),
            Email = "existing@example.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123!")
        });
        await context.SaveChangesAsync();

        var controller = CreateController(context);
        var dto = new UserRegisterDto
        {
            Email = "existing@example.com",
            Password = "AnotherPassword123!",
            Name = "Existing User"
        };

        var result = await controller.Register(dto);

        var badRequest = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("User already exists.", badRequest.Value);
    }

    [Fact]
    public void Login_ReturnsBadRequest_WhenEmailAndUsernameMissing()
    {
        using var context = CreateContext(nameof(Login_ReturnsBadRequest_WhenEmailAndUsernameMissing));
        var controller = CreateController(context);

        var dto = new UserLoginDto
        {
            Email = string.Empty,
            Username = string.Empty,
            Password = "Password123!"
        };

        var result = controller.Login(dto);

        var badRequest = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Username or email is required.", badRequest.Value);
    }

    [Fact]
    public void Login_ReturnsUnauthorized_WhenInvalidCredentials()
    {
        using var context = CreateContext(nameof(Login_ReturnsUnauthorized_WhenInvalidCredentials));
        context.Users.Add(new User
        {
            Id = Guid.NewGuid(),
            Email = "user@example.com",
            Username = "user1",
            Name = "User 1",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("CorrectPassword123!")
        });
        context.SaveChanges();

        var controller = CreateController(context);
        var dto = new UserLoginDto
        {
            Email = "user@example.com",
            Password = "WrongPassword!"
        };

        var result = controller.Login(dto);

        var unauthorized = Assert.IsType<UnauthorizedObjectResult>(result);
        Assert.Equal("Invalid credentials.", unauthorized.Value);
    }

    [Fact]
    public void Login_ReturnsToken_WhenCredentialsAreValid()
    {
        Environment.SetEnvironmentVariable("PRIVATE_KEY_JWT", "super_secret_test_key_1234567890");

        using var context = CreateContext(nameof(Login_ReturnsToken_WhenCredentialsAreValid));
        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = "valid@example.com",
            Username = "validuser",
            Name = "Valid User",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("ValidPassword123!")
        };
        context.Users.Add(user);
        context.SaveChanges();

        var controller = CreateController(context);
        var dto = new UserLoginDto
        {
            Email = "valid@example.com",
            Password = "ValidPassword123!"
        };

        var result = controller.Login(dto);

        var ok = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(ok.Value);

        var valueType = ok.Value.GetType();
        var tokenProperty = valueType.GetProperty("token");
        Assert.NotNull(tokenProperty);

        var token = tokenProperty!.GetValue(ok.Value) as string;
        Assert.False(string.IsNullOrEmpty(token));
    }
}
