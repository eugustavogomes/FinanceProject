using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SimpleFinance.Api.Controllers;
using SimpleFinance.Api.Data;
using SimpleFinance.Api.Models;
using Xunit;

public class DashboardControllerTests
{
    private static ApplicationDbContext CreateContext(string dbName)
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: dbName)
            .Options;

        return new ApplicationDbContext(options);
    }

    private static DashboardController CreateController(ApplicationDbContext context, ClaimsPrincipal user)
    {
        var controller = new DashboardController(context);
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
    public async Task GetSummary_ReturnsUnauthorized_WhenUserNotAuthenticated()
    {
        using var context = CreateContext(nameof(GetSummary_ReturnsUnauthorized_WhenUserNotAuthenticated));
        var user = new ClaimsPrincipal(new ClaimsIdentity());
        var controller = CreateController(context, user);

        var result = await controller.GetSummary(null);

        var unauthorized = Assert.IsType<UnauthorizedObjectResult>(result);
        Assert.Equal("Usuário não autenticado ou id inválido.", unauthorized.Value);
    }

    [Fact]
    public async Task GetSummary_ReturnsCorrectIncomeExpenseAndBalance()
    {
        using var context = CreateContext(nameof(GetSummary_ReturnsCorrectIncomeExpenseAndBalance));

        var userId = Guid.NewGuid();
        context.Users.Add(new User
        {
            Id = userId,
            Email = "dash@example.com",
            PasswordHash = "hash"
        });

        context.Transactions.AddRange(
            new Transaction
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Type = TransactionType.Income,
                Value = 100m,
                Date = new DateTime(2025, 5, 10)
            },
            new Transaction
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Type = TransactionType.Expense,
                Value = 40m,
                Date = new DateTime(2025, 5, 15)
            },
            new Transaction
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Type = TransactionType.Income,
                Value = 50m,
                Date = new DateTime(2025, 6, 1)
            }
        );

        await context.SaveChangesAsync();

        var claimsIdentity = new ClaimsIdentity(new[]
        {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString())
        }, "TestAuth");
        var user = new ClaimsPrincipal(claimsIdentity);
        var controller = CreateController(context, user);

        var result = await controller.GetSummary(month: 4); // May (0-based index)

        var ok = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(ok.Value);

        var valueType = ok.Value.GetType();
        var incomeProp = valueType.GetProperty("income");
        var expenseProp = valueType.GetProperty("expense");
        var balanceProp = valueType.GetProperty("balance");

        Assert.NotNull(incomeProp);
        Assert.NotNull(expenseProp);
        Assert.NotNull(balanceProp);

        var income = (decimal)incomeProp!.GetValue(ok.Value)!;
        var expense = (decimal)expenseProp!.GetValue(ok.Value)!;
        var balance = (decimal)balanceProp!.GetValue(ok.Value)!;

        Assert.Equal(100m, income);
        Assert.Equal(40m, expense);
        Assert.Equal(60m, balance);
    }
}
