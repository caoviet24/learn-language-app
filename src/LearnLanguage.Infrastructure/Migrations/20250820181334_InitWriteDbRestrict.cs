using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LearnLanguage.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitWriteDbRestrict : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    password = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    firstName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    lastName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    nickName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    role = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    isEmailConfirmed = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    emailConfirmedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    createdAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    createdBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    updatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    updatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    deletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    deletedBy = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Levels",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    requiredExp = table.Column<int>(type: "int", nullable: false),
                    createdAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    createdBy = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    updatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    updatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    deletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    deletedBy = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Levels", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Levels_Users_createdBy",
                        column: x => x.createdBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Topics",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    createdAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    createdBy = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    updatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    updatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    deletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    deletedBy = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Topics", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Topics_Users_createdBy",
                        column: x => x.createdBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "UserActivities",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    exp = table.Column<int>(type: "int", nullable: false),
                    level = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    streakDay = table.Column<int>(type: "int", nullable: false),
                    studyTime = table.Column<int>(type: "int", nullable: false),
                    totalWords = table.Column<int>(type: "int", nullable: false),
                    isCompleted = table.Column<bool>(type: "bit", nullable: false),
                    createdAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    createdBy = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    updatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    updatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    deletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    deletedBy = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserActivities", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserActivities_Users_createdBy",
                        column: x => x.createdBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Lessons",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    expReward = table.Column<int>(type: "int", nullable: false),
                    topicId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    levelId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    createdAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    createdBy = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    updatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    updatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    deletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    deletedBy = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Lessons", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Lessons_Levels_levelId",
                        column: x => x.levelId,
                        principalTable: "Levels",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Lessons_Topics_topicId",
                        column: x => x.topicId,
                        principalTable: "Topics",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Lessons_Users_createdBy",
                        column: x => x.createdBy,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Excercises",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    type = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    lessonId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    order = table.Column<int>(type: "int", nullable: false)
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
                    left = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    right = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    excerciseId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    leftMedia = table.Column<string>(type: "nvarchar(max)", nullable: true),
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
                    question = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    media = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    answers = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    excerciseId = table.Column<string>(type: "nvarchar(450)", nullable: false)
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
                    question = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    media = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    answer = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    excerciseId = table.Column<string>(type: "nvarchar(450)", nullable: false)
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

            migrationBuilder.CreateIndex(
                name: "IX_Lessons_createdBy",
                table: "Lessons",
                column: "createdBy");

            migrationBuilder.CreateIndex(
                name: "IX_Lessons_levelId",
                table: "Lessons",
                column: "levelId");

            migrationBuilder.CreateIndex(
                name: "IX_Lessons_topicId",
                table: "Lessons",
                column: "topicId");

            migrationBuilder.CreateIndex(
                name: "IX_Levels_createdBy",
                table: "Levels",
                column: "createdBy");

            migrationBuilder.CreateIndex(
                name: "IX_Topics_createdBy",
                table: "Topics",
                column: "createdBy");

            migrationBuilder.CreateIndex(
                name: "IX_UserActivities_createdBy",
                table: "UserActivities",
                column: "createdBy");

            migrationBuilder.CreateIndex(
                name: "IX_Users_email",
                table: "Users",
                column: "email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ExcerciseMatches");

            migrationBuilder.DropTable(
                name: "ExcerciseTrueFalses");

            migrationBuilder.DropTable(
                name: "ExcersiteFillBlanks");

            migrationBuilder.DropTable(
                name: "UserActivities");

            migrationBuilder.DropTable(
                name: "Excercises");

            migrationBuilder.DropTable(
                name: "Lessons");

            migrationBuilder.DropTable(
                name: "Levels");

            migrationBuilder.DropTable(
                name: "Topics");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
