using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Sadef.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class addedPropertyInLeadTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.CreateIndex(
                name: "IX_Leads_PropertyId",
                table: "Leads",
                column: "PropertyId");

            migrationBuilder.AddForeignKey(
                name: "FK_Leads_Properties_PropertyId",
                table: "Leads",
                column: "PropertyId",
                principalTable: "Properties",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Leads_Properties_PropertyId",
                table: "Leads");

            migrationBuilder.DropIndex(
                name: "IX_Leads_PropertyId",
                table: "Leads");
        }
    }
}
