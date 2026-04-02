using SimpleFinance.Api.Dtos;
using SimpleFinance.Api.Exceptions;
using SimpleFinance.Api.Models;
using SimpleFinance.Api.Repositories.Interfaces;

namespace SimpleFinance.Api.Services;

public class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _categoryRepository;
    private readonly IUserRepository _userRepository;

    public CategoryService(ICategoryRepository categoryRepository, IUserRepository userRepository)
    {
        _categoryRepository = categoryRepository;
        _userRepository = userRepository;
    }

    public async Task<IReadOnlyList<CategoryDto>> GetCategoriesAsync(Guid userId)
    {
        await EnsureUserExistsAsync(userId);

        var count = await _categoryRepository.CountActiveByUserIdAsync(userId);
        if (count == 0)
            await SeedBasicCategoriesForUser(userId);

        var categories = await _categoryRepository.GetActiveByUserIdAsync(userId);
        return categories.Select(c => MapToDto(c)).ToList();
    }

    public async Task<CategoryDto> CreateCategoryAsync(Guid userId, CreateCategoryDto dto)
    {
        await EnsureUserExistsAsync(userId);
        Validate(dto);

        var existing = await _categoryRepository.GetActiveByNameAndUserIdAsync(dto.Name!, userId);
        if (existing != null)
            throw new DomainException("A category with this name already exists.");

        var category = new Category
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Type = dto.Type ?? TransactionType.Expense,
            UserId = userId
        };

        await _categoryRepository.AddAsync(category);
        await _categoryRepository.SaveChangesAsync();

        return MapToDto(category);
    }

    public async Task<CategoryDto> UpdateCategoryAsync(Guid userId, Guid categoryId, CreateCategoryDto dto)
    {
        await EnsureUserExistsAsync(userId);
        Validate(dto);

        var category = await _categoryRepository.GetActiveByIdAndUserIdAsync(categoryId, userId)
            ?? throw new KeyNotFoundException("Category not found.");

        var existing = await _categoryRepository.GetActiveByNameAndUserIdAsync(dto.Name!, userId, excludeId: categoryId);
        if (existing != null)
            throw new DomainException("A category with this name already exists.");

        category.Name = dto.Name;
        if (dto.Type.HasValue)
            category.Type = dto.Type.Value;

        await _categoryRepository.SaveChangesAsync();

        return MapToDto(category);
    }

    public async Task DeleteCategoryAsync(Guid userId, Guid categoryId)
    {
        await EnsureUserExistsAsync(userId);

        var category = await _categoryRepository.GetActiveByIdAndUserIdAsync(categoryId, userId)
            ?? throw new KeyNotFoundException("Category not found.");

        // Soft delete: keeps category for transaction history
        category.IsActive = false;
        await _categoryRepository.SaveChangesAsync();
    }

    private async Task EnsureUserExistsAsync(Guid userId)
    {
        if (!await _userRepository.ExistsAsync(userId))
            throw new UnauthorizedAccessException("User not found. Please log in again.");
    }

    private static void Validate(CreateCategoryDto dto)
    {
        if (string.IsNullOrEmpty(dto.Name))
            throw new DomainException("Category name is required.");
    }

    private async Task SeedBasicCategoriesForUser(Guid userId)
    {
        var basicCategories = new List<Category>
        {
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
            new Category { Id = Guid.NewGuid(), Name = "Salary", UserId = userId, Type = TransactionType.Income },
            new Category { Id = Guid.NewGuid(), Name = "Freelance", UserId = userId, Type = TransactionType.Income },
            new Category { Id = Guid.NewGuid(), Name = "Stocks", UserId = userId, Type = TransactionType.Income },
            new Category { Id = Guid.NewGuid(), Name = "Real Estate Funds", UserId = userId, Type = TransactionType.Income },
        };

        await _categoryRepository.AddRangeAsync(basicCategories);
        await _categoryRepository.SaveChangesAsync();
    }

    private static CategoryDto MapToDto(Category category) => new CategoryDto
    {
        Id = category.Id,
        Name = category.Name,
        IsActive = category.IsActive,
        Type = category.Type,
        UserId = category.UserId
    };
}
