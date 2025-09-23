using FluentValidation.TestHelper;
using LearnLanguage.Application.Auth.Commands.Register;
using Xunit;

namespace LearnLanguage.Application.Tests.Auth.Commands.Register;

public class RegisterCommandValidatorTests
{
    private readonly RegisterCommandValidator _validator;

    public RegisterCommandValidatorTests()
    {
        _validator = new RegisterCommandValidator();
    }

    [Fact]
    public void Should_Have_Error_When_Email_Is_Empty()
    {
        // Arrange
        var command = new RegisterCommand()
        {
            email = "",
            password = "test@123",
            firstName = "Viet",
            lastName = "Cao"
        };

        // Act & Assert
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.email);
    }

    [Fact]
    public void Should_Have_Error_When_Email_Is_Invalid_Format()
    {
        // Arrange
        var command = new RegisterCommand()
        {
            email = "invalid-email.hehe",
            password = "test@123",
            firstName = "Viet",
            lastName = "Cao"
        };

        // Act & Assert
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.email);
    }

    [Fact]
    public void Should_Have_Error_When_Invalid_Password_Format()
    {
        // Arrange
        var command = new RegisterCommand()
        {
            email = "test@example.com",
            password = "hehe",
            firstName = "Viet",
            lastName = "Cao"
        };

        // Act & Assert
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.password);
    }

    [Fact]
    public void Should_Have_Error_When_Password_Is_Empty()
    {
        // Arrange
        var command = new RegisterCommand()
        {
            email = "test@example.com",
            password = "",
            firstName = "Viet",
            lastName = "Cao"
        };

        // Act & Assert
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.password);
    }

    [Fact]
    public void Should_Not_Have_Error_When_All_Fields_Are_Valid()
    {
        // Arrange
        var command = new RegisterCommand()
        {
            email = "test@example.com",
            password = "Test@123!",
            firstName = "Viet",
            lastName = "Cao"
        };

        // Act & Assert
        var result = _validator.TestValidate(command);
        result.ShouldNotHaveAnyValidationErrors();
    }
}