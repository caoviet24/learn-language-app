using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using LearnLanguage.Application.Common.Interfaces;
using LearnLanguage.Domain.Entities;
using LearnLanguage.Infrastructure.Configurations;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace LearnLanguage.Infrastructure.ExternalServices.Email
{
    public class EmailService(IOptions<EmailConfiguration> options, ILogger<EmailService> logger) : IEmailService
    {
        private readonly EmailConfiguration _emailConfiguration = options.Value;

        public async Task SendEmailConfirmationAsync(User user, string confirmationToken, CancellationToken cancellationToken = default)
        {
            var subject = "Confirm your email address";
            var confirmationLink = $"{_emailConfiguration.BaseUrl}/auth/confirm-email?token={confirmationToken}&email={user.email}";
            var body = $@"
            <html>
            <body>
                <h1>Please confirm your email address</h1>
                <p>Click the link below to confirm your email address:</p>
                <p><a href='{confirmationLink}'>Confirm Email</a></p>
                <p>If you didn't create an account with us, please ignore this email.</p>
                <br>
                <p>Best regards,<br>The LearnLanguage Team</p>
            </body>
            </html>";

            await sendEmailAsync(user.email, subject, body, cancellationToken);
            logger.LogInformation("Sending email confirmation to {Email}", user.email);
        }

        public async Task SendWelcomeEmailAsync(User user, CancellationToken cancellationToken = default)
        {
            var subject = $"Thư chào mừng người dùng {user.lastName} {user.firstName} đến với LearnLanguage!";
            var body = $@"
            <html>
            <body>
                <h1>Hi, {user.firstName} {user.lastName}!</h1>
                <p>Thank you for registering with our language learning platform.</p>
                <p>Your account has been successfully created with email: {user.email}</p>
                <p>Start your language learning journey today!</p>
                <br>
                <p>Best regards,<br>The LearnLanguage Team</p>
            </body>
            </html>";

            await sendEmailAsync(user.email, subject, body, cancellationToken);
            logger.LogInformation("Sending welcome email to {Email}", user.email);

        }

        private async Task sendEmailAsync(string email, string subject, string body, CancellationToken cancellationToken)
        {
            if (string.IsNullOrEmpty(_emailConfiguration.FromEmail) || string.IsNullOrEmpty(_emailConfiguration.FromPassword))
            {
                logger.LogWarning("Email configuration is missing. Email not sent.");
                return;
            }

            logger.LogInformation($"Sending email from {_emailConfiguration.FromEmail} password: {_emailConfiguration.FromPassword} via {_emailConfiguration.SmtpHost}:{_emailConfiguration.SmtpPort}");


            using var client = new SmtpClient(_emailConfiguration.SmtpHost, _emailConfiguration.SmtpPort)
            {
                EnableSsl = true,
                Credentials = new NetworkCredential(_emailConfiguration.FromEmail, _emailConfiguration.FromPassword)
            };

            var mailMessage = new MailMessage(_emailConfiguration.FromEmail, email, subject, body)
            {
                IsBodyHtml = true
            };

            await client.SendMailAsync(mailMessage);

        }
    }
}