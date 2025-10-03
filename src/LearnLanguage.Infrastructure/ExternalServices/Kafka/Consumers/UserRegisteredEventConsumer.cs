using System;
using System.Net.Mail;
using System.Threading.Tasks;
using LearnLanguage.Application.Common.Interfaces;
using LearnLanguage.Application.Events;
using LearnLanguage.Domain.Entities;
using DomainEmail = LearnLanguage.Domain.ValueObjects.Email;
using MassTransit;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace LearnLanguage.Infrastructure.ExternalServices.MassTransit.Consumers
{
    public class UserRegisteredEventConsumer : IConsumer<UserRegisteredEvent>
    {
        private const int MaxRetryCount = 3;
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<UserRegisteredEventConsumer> _logger;

        public UserRegisteredEventConsumer(
            IServiceProvider serviceProvider,
            ILogger<UserRegisteredEventConsumer> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        public async Task Consume(ConsumeContext<UserRegisteredEvent> context)
        {
            var eventData = context.Message;
            
            using var scope = _serviceProvider.CreateScope();
            var readDbContext = scope.ServiceProvider.GetRequiredService<IReadDbContext>();

            try
            {
                _logger.LogInformation("Processing UserRegisteredEvent for user {UserId}", eventData.userId);

                var user = new User
                {
                    Id = eventData.userId,
                    email = new DomainEmail(eventData.email),
                    firstName = eventData.firstName,
                    password = eventData.password,
                    lastName = eventData.lastName,
                    role = eventData.role,
                };

                using var transaction = await readDbContext.Database.BeginTransactionAsync(context.CancellationToken);
                try
                {
                    await readDbContext.Users.AddAsync(user, context.CancellationToken);
                    await readDbContext.SaveChangesAsync(context.CancellationToken);
                    await transaction.CommitAsync(context.CancellationToken);
                    
                    _logger.LogInformation("User {UserId} added to read database successfully", eventData.userId);
                }
                catch
                {
                    await transaction.RollbackAsync(context.CancellationToken);
                    throw;
                }
                
                await HandleSendEmailAsync(eventData, context.CancellationToken, 0);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing UserRegisteredEvent for user {UserId}", eventData.userId);
                throw;
            }
        }

        private async Task HandleSendEmailAsync(UserRegisteredEvent eventData, CancellationToken cancellationToken, int retryCount = 0)
        {
            using var scope = _serviceProvider.CreateScope();
            var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();
            var jwtService = scope.ServiceProvider.GetRequiredService<IJwtService>();
            var logger = scope.ServiceProvider.GetRequiredService<ILogger<UserRegisteredEventConsumer>>();
            
            var user = new User
            {
                Id = eventData.userId,
                email = new DomainEmail(eventData.email),
                firstName = eventData.firstName,
                lastName = eventData.lastName,
                role = eventData.role
            };
            
            try
            {
                logger.LogInformation("Sending email confirmation for user {UserId}", user.Id);
                string token = await jwtService.generateEmailConfirmationTokenAsync(user);
                await emailService.SendEmailConfirmationAsync(user, token);
                logger.LogInformation("Email confirmation sent successfully for user {UserId}", user.Id);
            }
            catch (SmtpFailedRecipientException recipientEx)
            {
                logger.LogError(recipientEx, "Invalid recipient address {Email} for user {UserId}", eventData.email, eventData.userId);
            }
            catch (SmtpException smtpEx)
            {
                if (retryCount < MaxRetryCount)
                {
                    logger.LogWarning(smtpEx, "Retry {RetryCount} sending email for user {UserId}", retryCount + 1, eventData.userId);
                    await Task.Delay(TimeSpan.FromSeconds(Math.Pow(2, retryCount)), cancellationToken);
                    await HandleSendEmailAsync(eventData, cancellationToken, retryCount + 1);
                }
                else
                {
                    logger.LogError(smtpEx, "Failed to send email for user {UserId} after multiple attempts", eventData.userId);
                }
            }
            catch (Exception ex)
            {
                if (retryCount < MaxRetryCount)
                {
                    logger.LogWarning(ex, "Retry {RetryCount} sending email for user {UserId} due to unexpected error", retryCount + 1, eventData.userId);
                    await Task.Delay(TimeSpan.FromSeconds(Math.Pow(2, retryCount)), cancellationToken);
                    await HandleSendEmailAsync(eventData, cancellationToken, retryCount + 1);
                }
                else
                {
                    logger.LogError(ex, "Failed to send email for user {UserId} after {MaxRetries} attempts", eventData.userId, MaxRetryCount);
                }
            }
        }
    }
}