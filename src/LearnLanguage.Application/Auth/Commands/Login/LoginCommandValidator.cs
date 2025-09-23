using FluentValidation;
using LearnLanguage.Application.Auth.Commands.Login;

public class LoginCommandValidator : AbstractValidator<LoginCommand>
{
    public LoginCommandValidator()
    {
        RuleFor(x => x)
            .Must(x => !string.IsNullOrWhiteSpace(x.email) || !string.IsNullOrWhiteSpace(x.nickName))
            .WithMessage("Email or NickName is required");
        When(x => !string.IsNullOrWhiteSpace(x.email), () =>
        {
            RuleFor(x => x.email)
                .EmailAddress()
                .WithMessage("Invalid email format");
        });

        RuleFor(x => x.password)
            .NotEmpty()
            .WithMessage("Password is required");
    }
}
