using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SimpleFinance.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddUserPreferencesToUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "is_sidebar_expanded",
                table: "users",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "preferred_theme",
                table: "users",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "is_sidebar_expanded",
                table: "users");

            migrationBuilder.DropColumn(
                name: "preferred_theme",
                table: "users");
        }
    }
}
