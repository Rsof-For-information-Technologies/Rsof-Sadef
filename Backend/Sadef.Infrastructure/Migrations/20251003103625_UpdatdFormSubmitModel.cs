using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Sadef.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdatdFormSubmitModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CurrentOrganization",
                table: "FormSubmissions");

            migrationBuilder.DropColumn(
                name: "PastSpeakingExperience",
                table: "FormSubmissions");

            migrationBuilder.DropColumn(
                name: "PreviousProjects",
                table: "FormSubmissions");

            migrationBuilder.RenameColumn(
                name: "VisitorOrMember",
                table: "FormSubmissions",
                newName: "MemberType");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "MemberType",
                table: "FormSubmissions",
                newName: "VisitorOrMember");

            migrationBuilder.AddColumn<string>(
                name: "CurrentOrganization",
                table: "FormSubmissions",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PastSpeakingExperience",
                table: "FormSubmissions",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PreviousProjects",
                table: "FormSubmissions",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
