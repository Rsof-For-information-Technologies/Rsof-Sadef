using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Sadef.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddedTablesForLucid3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Timeslots_UserInfoId",
                table: "Timeslots",
                column: "UserInfoId");

            migrationBuilder.AddForeignKey(
                name: "FK_Timeslots_UserInfos_UserInfoId",
                table: "Timeslots",
                column: "UserInfoId",
                principalTable: "UserInfos",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Timeslots_UserInfos_UserInfoId",
                table: "Timeslots");

            migrationBuilder.DropIndex(
                name: "IX_Timeslots_UserInfoId",
                table: "Timeslots");
        }
    }
}
