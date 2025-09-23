using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Threading.Tasks;
using LearnLanguage.Application.Common.Interfaces;
using LearnLanguage.Application.Events;
using LearnLanguage.Domain.Entities;
using LearnLanguage.Infrastructure.Data.Read;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace LearnLanguage.Infrastructure.ExternalServices.Kafka.EventsHandler
{
    public class UserRegisteredEventHandler
    {
        private const int max_retry_count = 3;
        private readonly IServiceProvider _serviceProvider;

        public UserRegisteredEventHandler(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        public async Task HandleAsync(UserRegisteredEvent eventData, CancellationToken cancellationToken)
        {
            using var scope = _serviceProvider.CreateScope();
            var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();
            var readDbContext = scope.ServiceProvider.GetRequiredService<ReadDbContext>();

            var user = new User
            {
                Id = eventData.userId,
                email = eventData.email,
                firstName = eventData.firstName,
                password = eventData.password,
                lastName = eventData.lastName,
                role = eventData.role,
            };

            await readDbContext.Users.AddAsync(user, cancellationToken);
            await readDbContext.SaveChangesAsync(cancellationToken);
            await HandleSendEmailAsync(eventData, cancellationToken, 0);

        }

        private async Task HandleSendEmailAsync(UserRegisteredEvent eventData, CancellationToken cancellationToken, int retryCount = 0)
        {
            using var scope = _serviceProvider.CreateScope();
            var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();
            var jwtService = scope.ServiceProvider.GetRequiredService<IJwtService>();
            var logger = scope.ServiceProvider.GetRequiredService<ILogger<UserRegisteredEventHandler>>();
            var user = new User
            {
                Id = eventData.userId,
                email = eventData.email,
                firstName = eventData.firstName,
                lastName = eventData.lastName,
                role = eventData.role
            };
            try
            {
                logger.LogInformation("Sending email confirmation for user {UserId}", user.Id);
                string token = await jwtService.generateEmailConfirmationTokenAsync(user);
                await emailService.SendEmailConfirmationAsync(user, token);
            }
            catch (SmtpFailedRecipientException recipientEx)
            {
                logger.LogError(recipientEx, "Invalid recipient address {Email} for user {UserId}", eventData.email, eventData.userId);
            }
            catch (SmtpException smtpEx)
            {
                if (retryCount < max_retry_count)
                {
                    logger.LogWarning(smtpEx, "Retry {RetryCount} sending email for user {UserId}", retryCount + 1, eventData.userId);
                    await HandleSendEmailAsync(eventData, cancellationToken, retryCount + 1);
                }
                else
                {
                    logger.LogError(smtpEx, "Failed to send email for user {UserId} after multiple attempts", eventData.userId);
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Unexpected error while sending email for user {UserId}", eventData.userId);
                await HandleSendEmailAsync(eventData, cancellationToken, retryCount + 1);
            }
        }


    }
}