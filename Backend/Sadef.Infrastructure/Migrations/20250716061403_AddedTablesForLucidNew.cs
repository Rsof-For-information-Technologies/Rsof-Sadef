using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Sadef.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddedTablesForLucidNew : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AppointmentNumber",
                table: "Timeslots");

            migrationBuilder.AddColumn<string>(
                name: "AppointmentNumber",
                table: "UserInfos",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AppointmentNumber",
                table: "UserInfos");

            migrationBuilder.AddColumn<string>(
                name: "AppointmentNumber",
                table: "Timeslots",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
