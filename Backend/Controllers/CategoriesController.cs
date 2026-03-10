using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SimpleFinance.Api.Data;
using SimpleFinance.Api.Models;
using SimpleFinance.Api.Dtos;
using System.Security.Claims;

namespace SimpleFinance.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    public CategoriesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> GetCategories()
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new UnauthorizedAccessException());
        
        var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
        if (!userExists)
        {
            return Unauthorized("User not found. Please log in again.");
        }
        
        var userCategoryCount = await _context.Categories.CountAsync(c => c.UserId == userId && c.IsActive);
        if (userCategoryCount == 0)
        {
            await SeedBasicCategoriesForUser(userId);
        }

        var categories = await _context.Categories
            .Where(c => c.UserId == userId && c.IsActive)
            .OrderBy(c => c.Name)
            .Select(c => new
            {
                id = c.Id,
                name = c.Name,
                isActive = c.IsActive,
                type = c.Type,
                userId = c.UserId,
                user = (object?)null,
                transactions = (object?)null
            })
            .ToListAsync();

        return Ok(categories);
    }

    [HttpPost]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryDto dto)
    {
        if (string.IsNullOrEmpty(dto.Name))
            return BadRequest("Category name is required.");

        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new UnauthorizedAccessException());

        var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
        if (!userExists)
        {
            return Unauthorized("User not found. Please log in again.");
        }

        var existingCategory = await _context.Categories
            .FirstOrDefaultAsync(c => c.IsActive && c.Name != null && c.Name.ToLower() == dto.Name.ToLower() && c.UserId == userId);
        
        if (existingCategory != null)
            return BadRequest("A category with this name already exists.");

        var category = new Category
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Type = dto.Type ?? TransactionType.Expense,
            UserId = userId
        };

        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        var result = new
        {
            id = category.Id,
            name = category.Name,
            isActive = category.IsActive,
            type = category.Type,
            userId = category.UserId,
            user = (object?)null,
            transactions = (object?)null
        };

        return Ok(result);
    }

    [HttpPut("{id}")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> UpdateCategory(Guid id, [FromBody] CreateCategoryDto dto)
    {
        if (string.IsNullOrEmpty(dto.Name))
            return BadRequest("Category name is required.");

        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new UnauthorizedAccessException());
        
        var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
        if (!userExists)
        {
            return Unauthorized("User not found. Please log in again.");
        }
        
        var category = await _context.Categories
            .FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId && c.IsActive);
        if (category == null)
            return NotFound();

        var existingCategory = await _context.Categories
            .FirstOrDefaultAsync(c => c.IsActive && c.Name != null && c.Name.ToLower() == dto.Name.ToLower() && c.Id != id && c.UserId == userId);
        
        if (existingCategory != null)
            return BadRequest("A category with this name already exists.");

        category.Name = dto.Name;
        if (dto.Type.HasValue)
        {
            category.Type = dto.Type.Value;
        }
        await _context.SaveChangesAsync();

        var result = new
        {
            id = category.Id,
            name = category.Name,
            isActive = category.IsActive,
            type = category.Type,
            userId = category.UserId,
            user = (object?)null,
            transactions = (object?)null
        };

        return Ok(result);
    }

    [HttpDelete("{id}")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> DeleteCategory(Guid id)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new UnauthorizedAccessException());
        
        var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
        if (!userExists)
        {
            return Unauthorized("User not found. Please log in again.");
        }
        
        var category = await _context.Categories
            .FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId && c.IsActive);
        
        if (category == null)
            return NotFound();

        // Soft delete: keeps category for transaction history
        category.IsActive = false;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    private async Task SeedBasicCategoriesForUser(Guid userId)
    {
        var basicCategories = new List<Category>
    {
        // EXPENSES
        new Category { Id = Guid.NewGuid(), Name = "Food", UserId = userId, Type = TransactionType.Expense },
        new Category { Id = Guid.NewGuid(), Name = "Rent", UserId = userId, Type = TransactionType.Expense },
        new Category { Id = Guid.NewGuid(), Name = "Transport", UserId = userId, Type = TransactionType.Expense },
        new Category { Id = Guid.NewGuid(), Name = "Water Bill", UserId = userId, Type = TransactionType.Expense },
        new Category { Id = Guid.NewGuid(), Name = "Electricity Bill", UserId = userId, Type = TransactionType.Expense },
        new Category { Id = Guid.NewGuid(), Name = "Internet", UserId = userId, Type = TransactionType.Expense },
        new Category { Id = Guid.NewGuid(), Name = "Phone", UserId = userId, Type = TransactionType.Expense },
        new Category { Id = Guid.NewGuid(), Name = "Health", UserId = userId, Type = TransactionType.Expense },
        new Category { Id = Guid.NewGuid(), Name = "Education", UserId = userId, Type = TransactionType.Expense },
        new Category { Id = Guid.NewGuid(), Name = "Leisure", UserId = userId, Type = TransactionType.Expense },

        // INCOMES
        new Category { Id = Guid.NewGuid(), Name = "Salary", UserId = userId, Type = TransactionType.Income },
        new Category { Id = Guid.NewGuid(), Name = "Freelance", UserId = userId, Type = TransactionType.Income },
        new Category { Id = Guid.NewGuid(), Name = "Stocks", UserId = userId, Type = TransactionType.Income },
        new Category { Id = Guid.NewGuid(), Name = "Real Estate Funds", UserId = userId, Type = TransactionType.Income },
    };

    _context.Categories.AddRange(basicCategories);
    await _context.SaveChangesAsync();
}
}
