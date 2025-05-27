using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Sadef.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddedBlogTable4 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CoverImageUrl",
                table: "Blogs",
                newName: "CoverImage");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CoverImage",
                table: "Blogs",
                newName: "CoverImageUrl");
        }
    }
}
