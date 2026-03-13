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

public class InvestmentsControllerTests
{
    private static ApplicationDbContext CreateContext(string dbName)
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: dbName)
            .Options;

        return new ApplicationDbContext(options);
    }

    private static InvestmentsController CreateController(ApplicationDbContext context, ClaimsPrincipal user)
    {
        var controller = new InvestmentsController(context);
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
    public async Task GetInvestments_ReturnsUnauthorized_WhenUserNotAuthenticated()
    {
        using var context = CreateContext(nameof(GetInvestments_ReturnsUnauthorized_WhenUserNotAuthenticated));
        var user = new ClaimsPrincipal(new ClaimsIdentity());
        var controller = CreateController(context, user);

        var result = await controller.GetInvestments();

        var unauthorized = Assert.IsType<UnauthorizedObjectResult>(result);
        Assert.Equal("Usuário não autenticado ou id inválido.", unauthorized.Value);
    }

    [Fact]
    public async Task CreateInvestment_ReturnsBadRequest_WhenNameIsEmpty()
    {
        using var context = CreateContext(nameof(CreateInvestment_ReturnsBadRequest_WhenNameIsEmpty));

        var claimsIdentity = new ClaimsIdentity(new[]
        {
            new Claim(ClaimTypes.NameIdentifier, Guid.NewGuid().ToString())
        }, "TestAuth");
        var user = new ClaimsPrincipal(claimsIdentity);
        var controller = CreateController(context, user);

        var dto = new InvestmentDto
        {
            Name = " ",
            CurrentValue = 100,
            InvestedAmount = 100,
            ExpectedReturnYearly = 0
        };

        var result = await controller.CreateInvestment(dto);

        var badRequest = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Nome do investimento é obrigatório.", badRequest.Value);
    }
}
