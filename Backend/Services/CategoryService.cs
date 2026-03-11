using Microsoft.EntityFrameworkCore;
using SimpleFinance.Api.Data;
using SimpleFinance.Api.Dtos;
using SimpleFinance.Api.Exceptions;
using SimpleFinance.Api.Models;

namespace SimpleFinance.Api.Services;

public class CategoryService : ICategoryService
{
    private readonly ApplicationDbContext _context;

    public CategoryService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyList<CategoryDto>> GetCategoriesAsync(Guid userId)
    {
        await EnsureUserExistsAsync(userId);

        var userCategoryCount = await _context.Categories.CountAsync(c => c.UserId == userId && c.IsActive);
        if (userCategoryCount == 0)
        {
            await SeedBasicCategoriesForUser(userId);
        }

        var categories = await _context.Categories
            .Where(c => c.UserId == userId && c.IsActive)
            .OrderBy(c => c.Name)
            .ToListAsync();

        return categories.Select(MapToDto).ToList();
    }

    public async Task<CategoryDto> CreateCategoryAsync(Guid userId, CreateCategoryDto dto)
    {
        await EnsureUserExistsAsync(userId);
        Validate(dto);

        var existingCategory = await _context.Categories
            .FirstOrDefaultAsync(c => c.IsActive && c.Name != null && c.Name.ToLower() == dto.Name!.ToLower() && c.UserId == userId);

        if (existingCategory != null)
        {
            throw new DomainException("A category with this name already exists.");
        }

        var category = new Category
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Type = dto.Type ?? TransactionType.Expense,
            UserId = userId
        };

        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        return MapToDto(category);
    }

    public async Task<CategoryDto> UpdateCategoryAsync(Guid userId, Guid categoryId, CreateCategoryDto dto)
    {
        await EnsureUserExistsAsync(userId);
        Validate(dto);

        var category = await _context.Categories
            .FirstOrDefaultAsync(c => c.Id == categoryId && c.UserId == userId && c.IsActive);

        if (category == null)
        {
            throw new KeyNotFoundException("Category not found.");
        }

        var existingCategory = await _context.Categories
            .FirstOrDefaultAsync(c => c.IsActive && c.Name != null && c.Name.ToLower() == dto.Name!.ToLower() && c.Id != categoryId && c.UserId == userId);

        if (existingCategory != null)
        {
            throw new DomainException("A category with this name already exists.");
        }

        category.Name = dto.Name;
        if (dto.Type.HasValue)
        {
            category.Type = dto.Type.Value;
        }

        await _context.SaveChangesAsync();

        return MapToDto(category);
    }

    public async Task DeleteCategoryAsync(Guid userId, Guid categoryId)
    {
        await EnsureUserExistsAsync(userId);

        var category = await _context.Categories
            .FirstOrDefaultAsync(c => c.Id == categoryId && c.UserId == userId && c.IsActive);

        if (category == null)
        {
            throw new KeyNotFoundException("Category not found.");
        }

        // Soft delete: keeps category for transaction history
        category.IsActive = false;
        await _context.SaveChangesAsync();
    }

    private async Task EnsureUserExistsAsync(Guid userId)
    {
        var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
        if (!userExists)
        {
            throw new UnauthorizedAccessException("User not found. Please log in again.");
        }
    }

    private static void Validate(CreateCategoryDto dto)
    {
        if (string.IsNullOrEmpty(dto.Name))
        {
            throw new DomainException("Category name is required.");
        }
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

    private static CategoryDto MapToDto(Category category)
    {
        return new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            IsActive = category.IsActive,
            Type = category.Type,
            UserId = category.UserId
        };
    }
}
