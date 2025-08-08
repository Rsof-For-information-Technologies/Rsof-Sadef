using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Sadef.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddedTranslationTableInBlogs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CanonicalUrl",
                table: "Blogs");

            migrationBuilder.DropColumn(
                name: "Content",
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

            migrationBuilder.DropColumn(
                name: "Title",
                table: "Blogs");

            migrationBuilder.AddColumn<int>(
                name: "ContentLanguage",
                table: "Blogs",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "BlogTranslations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BlogId = table.Column<int>(type: "int", nullable: false),
                    LanguageCode = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MetaTitle = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MetaDescription = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MetaKeywords = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Slug = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CanonicalUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BlogTranslations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BlogTranslations_Blogs_BlogId",
                        column: x => x.BlogId,
                        principalTable: "Blogs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BlogTranslations_BlogId",
                table: "BlogTranslations",
                column: "BlogId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BlogTranslations");

            migrationBuilder.DropColumn(
                name: "ContentLanguage",
                table: "Blogs");

            migrationBuilder.AddColumn<string>(
                name: "CanonicalUrl",
                table: "Blogs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Content",
                table: "Blogs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

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

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "Blogs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
