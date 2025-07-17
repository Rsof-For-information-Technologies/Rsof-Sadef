using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Sadef.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddNewFieldToMaintenanceRequests : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "MaintenanceRequests",
                type: "bit",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "MaintenanceRequests");
        }
    }
}
