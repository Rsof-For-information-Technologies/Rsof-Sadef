using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Sadef.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ReplaceMediaByteArrayWithFileUrl : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "VideoData",
                table: "MaintenanceVideos");

            migrationBuilder.DropColumn(
                name: "ImageData",
                table: "MaintenanceImages");

            migrationBuilder.AddColumn<string>(
                name: "VideoUrl",
                table: "MaintenanceVideos",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "MaintenanceImages",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "VideoUrl",
                table: "MaintenanceVideos");

            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "MaintenanceImages");

            migrationBuilder.AddColumn<byte[]>(
                name: "VideoData",
                table: "MaintenanceVideos",
                type: "varbinary(max)",
                nullable: false,
                defaultValue: new byte[0]);

            migrationBuilder.AddColumn<byte[]>(
                name: "ImageData",
                table: "MaintenanceImages",
                type: "varbinary(max)",
                nullable: false,
                defaultValue: new byte[0]);
        }
    }
}
