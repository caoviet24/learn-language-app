using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LearnLanguage.Infrastructure.Data.WriteDb.Migrations
{
    /// <inheritdoc />
    public partial class update_all_db_WriteDb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ExcerciseMatches");

            migrationBuilder.DropTable(
                name: "ExcerciseTrueFalses");

            migrationBuilder.DropTable(
                name: "ExcersiteFillBlanks");

            migrationBuilder.DropTable(
                name: "Excercises");

            migrationBuilder.DropColumn(
                name: "isCompleted",
                table: "UserActivities");

            migrationBuilder.RenameColumn(
                name: "totalWords",
                table: "UserActivities",
                newName: "totalStudyTime");

            migrationBuilder.RenameColumn(
                name: "studyTime",
                table: "UserActivities",
                newName: "totalLessons");

            migrationBuilder.AddColumn<string>(
                name: "languageStudying",
                table: "UserActivities",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "studyTimeToday",
                table: "UserActivities",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Words",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    text = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    language = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    topicId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    createdAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    createdBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    updatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    deletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    deletedBy = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Words", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Words_Topics_topicId",
                        column: x => x.topicId,
                        principalTable: "Topics",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "LessonsWord",
                columns: table => new
                {
                    lessonsId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    wordsId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LessonsWord", x => new { x.lessonsId, x.wordsId });
                    table.ForeignKey(
                        name: "FK_LessonsWord_Lessons_lessonsId",
                        column: x => x.lessonsId,
                        principalTable: "Lessons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_LessonsWord_Words_wordsId",
                        column: x => x.wordsId,
                        principalTable: "Words",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_LessonsWord_wordsId",
                table: "LessonsWord",
                column: "wordsId");

            migrationBuilder.CreateIndex(
                name: "IX_Words_topicId",
                table: "Words",
                column: "topicId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LessonsWord");

            migrationBuilder.DropTable(
                name: "Words");

            migrationBuilder.DropColumn(
                name: "languageStudying",
                table: "UserActivities");

            migrationBuilder.DropColumn(
                name: "studyTimeToday",
                table: "UserActivities");

            migrationBuilder.RenameColumn(
                name: "totalStudyTime",
                table: "UserActivities",
                newName: "totalWords");

            migrationBuilder.RenameColumn(
                name: "totalLessons",
                table: "UserActivities",
                newName: "studyTime");

            migrationBuilder.AddColumn<bool>(
                name: "isCompleted",
                table: "UserActivities",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "Excercises",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    lessonId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    order = table.Column<int>(type: "int", nullable: false),
                    type = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Excercises", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Excercises_Lessons_lessonId",
                        column: x => x.lessonId,
                        principalTable: "Lessons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ExcerciseMatches",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    excerciseId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    left = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    leftMedia = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    right = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    rightMedia = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExcerciseMatches", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ExcerciseMatches_Excercises_excerciseId",
                        column: x => x.excerciseId,
                        principalTable: "Excercises",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ExcerciseTrueFalses",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    excerciseId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    answers = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    media = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    question = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExcerciseTrueFalses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ExcerciseTrueFalses_Excercises_excerciseId",
                        column: x => x.excerciseId,
                        principalTable: "Excercises",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ExcersiteFillBlanks",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    excerciseId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    answer = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    media = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    question = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExcersiteFillBlanks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ExcersiteFillBlanks_Excercises_excerciseId",
                        column: x => x.excerciseId,
                        principalTable: "Excercises",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ExcerciseMatches_excerciseId",
                table: "ExcerciseMatches",
                column: "excerciseId");

            migrationBuilder.CreateIndex(
                name: "IX_Excercises_lessonId",
                table: "Excercises",
                column: "lessonId");

            migrationBuilder.CreateIndex(
                name: "IX_ExcerciseTrueFalses_excerciseId",
                table: "ExcerciseTrueFalses",
                column: "excerciseId");

            migrationBuilder.CreateIndex(
                name: "IX_ExcersiteFillBlanks_excerciseId",
                table: "ExcersiteFillBlanks",
                column: "excerciseId");
        }
    }
}
