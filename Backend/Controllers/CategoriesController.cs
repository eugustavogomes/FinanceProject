using Microsoft.AspNetCore.Mvc;
using SimpleFinance.Api.Dtos;
using SimpleFinance.Api.Services;
using System.Security.Claims;

namespace SimpleFinance.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryService _categoryService;

    public CategoriesController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    [HttpGet]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> GetCategories()
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new UnauthorizedAccessException());

        var categories = await _categoryService.GetCategoriesAsync(userId);
        return Ok(categories);
    }

    [HttpPost]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryDto dto)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new UnauthorizedAccessException());

        var created = await _categoryService.CreateCategoryAsync(userId, dto);
        return Ok(created);
    }

    [HttpPut("{id}")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> UpdateCategory(Guid id, [FromBody] CreateCategoryDto dto)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new UnauthorizedAccessException());

        var updated = await _categoryService.UpdateCategoryAsync(userId, id, dto);
        return Ok(updated);
    }

    [HttpDelete("{id}")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> DeleteCategory(Guid id)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new UnauthorizedAccessException());

        await _categoryService.DeleteCategoryAsync(userId, id);
        return NoContent();
    }
}
