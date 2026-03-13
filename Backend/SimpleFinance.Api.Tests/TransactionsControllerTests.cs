using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SimpleFinance.Api.Controllers;
using SimpleFinance.Api.Dtos;
using SimpleFinance.Api.Services;
using Xunit;

public class TransactionsControllerTests
{
    private class FakeTransactionService : ITransactionService
    {
        public Guid? LastUserId { get; private set; }
        public IReadOnlyList<TransactionDto> TransactionsToReturn { get; set; } = Array.Empty<TransactionDto>();

        public Task<IReadOnlyList<TransactionDto>> GetTransactionsAsync(Guid userId)
        {
            LastUserId = userId;
            return Task.FromResult(TransactionsToReturn);
        }

        public Task<TransactionDto> AddTransactionAsync(Guid userId, CreateTransactionDto dto)
        {
            LastUserId = userId;
            return Task.FromResult(new TransactionDto());
        }

        public Task<TransactionDto> UpdateTransactionAsync(Guid userId, Guid transactionId, CreateTransactionDto dto)
        {
            LastUserId = userId;
            return Task.FromResult(new TransactionDto());
        }

        public Task DeleteTransactionAsync(Guid userId, Guid transactionId)
        {
            LastUserId = userId;
            return Task.CompletedTask;
        }
    }

    private static TransactionsController CreateController(ITransactionService service, ClaimsPrincipal user)
    {
        var controller = new TransactionsController(service);
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
    public async Task GetTransactions_ReturnsUnauthorized_WhenUserIdMissing()
    {
        var service = new FakeTransactionService();
        var user = new ClaimsPrincipal(new ClaimsIdentity());
        var controller = CreateController(service, user);

        var result = await controller.GetTransactions();

        var unauthorized = Assert.IsType<UnauthorizedObjectResult>(result);
        Assert.Equal("User not authenticated or invalid id.", unauthorized.Value);
    }

    [Fact]
    public async Task GetTransactions_UsesUserIdFromClaims_AndReturnsOk()
    {
        var service = new FakeTransactionService();
        var expectedUserId = Guid.NewGuid();
        service.TransactionsToReturn = new List<TransactionDto>
        {
            new TransactionDto { Id = Guid.NewGuid(), Description = "Test", Value = 100 }
        };

        var claimsIdentity = new ClaimsIdentity(new[]
        {
            new Claim(ClaimTypes.NameIdentifier, expectedUserId.ToString())
        }, "TestAuth");
        var user = new ClaimsPrincipal(claimsIdentity);

        var controller = CreateController(service, user);

        var result = await controller.GetTransactions();

        var ok = Assert.IsType<OkObjectResult>(result);
        var transactions = Assert.IsAssignableFrom<IReadOnlyList<TransactionDto>>(ok.Value);
        Assert.Single(transactions);
        Assert.Equal("Test", transactions[0].Description);
        Assert.Equal(expectedUserId, service.LastUserId);
    }
}
