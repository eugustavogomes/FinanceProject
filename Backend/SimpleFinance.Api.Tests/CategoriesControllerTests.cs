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

public class CategoriesControllerTests
{
    private class FakeCategoryService : ICategoryService
    {
        public Guid? LastUserId { get; private set; }
        public IReadOnlyList<CategoryDto> CategoriesToReturn { get; set; } = Array.Empty<CategoryDto>();
        public CategoryDto CategoryToReturn { get; set; } = new CategoryDto();

        public Task<IReadOnlyList<CategoryDto>> GetCategoriesAsync(Guid userId)
        {
            LastUserId = userId;
            return Task.FromResult(CategoriesToReturn);
        }

        public Task<CategoryDto> CreateCategoryAsync(Guid userId, CreateCategoryDto dto)
        {
            LastUserId = userId;
            return Task.FromResult(CategoryToReturn);
        }

        public Task<CategoryDto> UpdateCategoryAsync(Guid userId, Guid categoryId, CreateCategoryDto dto)
        {
            LastUserId = userId;
            return Task.FromResult(CategoryToReturn);
        }

        public Task DeleteCategoryAsync(Guid userId, Guid categoryId)
        {
            LastUserId = userId;
            return Task.CompletedTask;
        }
    }

    private static CategoriesController CreateController(ICategoryService service, ClaimsPrincipal user)
    {
        var controller = new CategoriesController(service);
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
    public async Task GetCategories_UsesUserIdFromClaims_AndReturnsOk()
    {
        var fakeService = new FakeCategoryService();
        var expectedUserId = Guid.NewGuid();
        var categories = new List<CategoryDto>
        {
            new CategoryDto { Id = Guid.NewGuid(), Name = "Food" }
        };
        fakeService.CategoriesToReturn = categories;

        var claimsIdentity = new ClaimsIdentity(new[]
        {
            new Claim(ClaimTypes.NameIdentifier, expectedUserId.ToString())
        }, "TestAuth");
        var user = new ClaimsPrincipal(claimsIdentity);

        var controller = CreateController(fakeService, user);

        var result = await controller.GetCategories();

        var ok = Assert.IsType<OkObjectResult>(result);
        var returnedCategories = Assert.IsAssignableFrom<IReadOnlyList<CategoryDto>>(ok.Value);
        Assert.Single(returnedCategories);
        Assert.Equal("Food", returnedCategories[0].Name);
        Assert.Equal(expectedUserId, fakeService.LastUserId);
    }

    [Fact]
    public async Task GetCategories_ThrowsUnauthorizedAccess_WhenNoUserIdClaim()
    {
        var fakeService = new FakeCategoryService();
        var user = new ClaimsPrincipal(new ClaimsIdentity());
        var controller = CreateController(fakeService, user);

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() => controller.GetCategories());
    }
}
