using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LearnLanguage.Infrastructure.Data.ReadDb.Migrations
{
    /// <inheritdoc />
    public partial class update_UserActivity_ReadDb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "studyTimeEveryday",
                table: "UserActivities",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "studyTimeEveryday",
                table: "UserActivities");
        }
    }
}
