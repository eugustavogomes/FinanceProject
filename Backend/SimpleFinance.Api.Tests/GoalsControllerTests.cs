using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SimpleFinance.Api.Controllers;
using SimpleFinance.Api.Data;
using SimpleFinance.Api.Dtos;
using Xunit;

public class GoalsControllerTests
{
    private static ApplicationDbContext CreateContext(string dbName)
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: dbName)
            .Options;

        return new ApplicationDbContext(options);
    }

    private static GoalsController CreateController(ApplicationDbContext context, ClaimsPrincipal user)
    {
        var controller = new GoalsController(context);
        var httpContext = new DefaultHttpContext
        {
            User = user
        };
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = httpContext
        };
        return controller;
    }

    [Fact]
    public async Task GetGoals_ReturnsUnauthorized_WhenUserNotAuthenticated()
    {
        using var context = CreateContext(nameof(GetGoals_ReturnsUnauthorized_WhenUserNotAuthenticated));
        var user = new ClaimsPrincipal(new ClaimsIdentity());
        var controller = CreateController(context, user);

        var result = await controller.GetGoals();

        var unauthorized = Assert.IsType<UnauthorizedObjectResult>(result);
        Assert.Equal("Usuário não autenticado ou id inválido.", unauthorized.Value);
    }

    [Fact]
    public async Task CreateGoal_ReturnsBadRequest_WhenMonthIsInvalid()
    {
        using var context = CreateContext(nameof(CreateGoal_ReturnsBadRequest_WhenMonthIsInvalid));

        var claimsIdentity = new ClaimsIdentity(new[]
        {
            new Claim(ClaimTypes.NameIdentifier, Guid.NewGuid().ToString())
        }, "TestAuth");
        var user = new ClaimsPrincipal(claimsIdentity);
        var controller = CreateController(context, user);

        var dto = new GoalDto
        {
            Target = 100,
            Month = 13,
            Year = DateTime.UtcNow.Year,
            Category = "Test"
        };

        var result = await controller.CreateGoal(dto);

        var badRequest = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Mês inválido.", badRequest.Value);
    }
}
