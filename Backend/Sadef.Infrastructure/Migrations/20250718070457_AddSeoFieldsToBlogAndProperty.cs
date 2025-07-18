using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Sadef.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddSeoFieldsToBlogAndProperty : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CanonicalUrl",
                table: "Properties",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MetaDescription",
                table: "Properties",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MetaKeywords",
                table: "Properties",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MetaTitle",
                table: "Properties",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Slug",
                table: "Properties",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CanonicalUrl",
                table: "Blogs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MetaDescription",
                table: "Blogs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MetaKeywords",
                table: "Blogs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MetaTitle",
                table: "Blogs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Slug",
                table: "Blogs",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CanonicalUrl",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "MetaDescription",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "MetaKeywords",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "MetaTitle",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "Slug",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "CanonicalUrl",
                table: "Blogs");

            migrationBuilder.DropColumn(
                name: "MetaDescription",
                table: "Blogs");

            migrationBuilder.DropColumn(
                name: "MetaKeywords",
                table: "Blogs");

            migrationBuilder.DropColumn(
                name: "MetaTitle",
                table: "Blogs");

            migrationBuilder.DropColumn(
                name: "Slug",
                table: "Blogs");
        }
    }
}
