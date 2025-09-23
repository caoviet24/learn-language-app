using LearnLanguage.Domain.Entities;

namespace LearnLanguage.Application.Common.Interfaces;

public interface IEmailService
{
    Task SendWelcomeEmailAsync(User user, CancellationToken cancellationToken = default);
    Task SendEmailConfirmationAsync(User user, string confirmationToken, CancellationToken cancellationToken = default);
}