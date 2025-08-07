using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Sadef.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ReplacePropertyMediaByteArrayWithFiledUrl : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "VideoData",
                table: "PropertyVideos");

            migrationBuilder.DropColumn(
                name: "ImageData",
                table: "PropertyImages");

            migrationBuilder.AddColumn<string>(
                name: "VideoUrl",
                table: "PropertyVideos",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "PropertyImages",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "VideoUrl",
                table: "PropertyVideos");

            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "PropertyImages");

            migrationBuilder.AddColumn<byte[]>(
                name: "VideoData",
                table: "PropertyVideos",
                type: "varbinary(max)",
                nullable: false,
                defaultValue: new byte[0]);

            migrationBuilder.AddColumn<byte[]>(
                name: "ImageData",
                table: "PropertyImages",
                type: "varbinary(max)",
                nullable: false,
                defaultValue: new byte[0]);
        }
    }
}
