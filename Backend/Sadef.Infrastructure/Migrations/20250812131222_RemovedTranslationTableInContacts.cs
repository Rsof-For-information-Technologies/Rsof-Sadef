using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Sadef.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemovedTranslationTableInContacts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ContentLanguage",
                table: "Contacts");

            migrationBuilder.AddColumn<string>(
                name: "Location",
                table: "Contacts",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Message",
                table: "Contacts",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PreferredContactMethod",
                table: "Contacts",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Subject",
                table: "Contacts",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Location",
                table: "Contacts");

            migrationBuilder.DropColumn(
                name: "Message",
                table: "Contacts");

            migrationBuilder.DropColumn(
                name: "PreferredContactMethod",
                table: "Contacts");

            migrationBuilder.DropColumn(
                name: "Subject",
                table: "Contacts");

            migrationBuilder.AddColumn<int>(
                name: "ContentLanguage",
                table: "Contacts",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
