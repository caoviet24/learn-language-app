using LearnLanguage.Application.Common.Interfaces;
using LearnLanguage.Infrastructure.Configurations;
using LearnLanguage.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.DependencyInjection;
using LearnLanguage.Infrastructure.Data.Write;
using LearnLanguage.Infrastructure.Data.Read;
using LearnLanguage.Infrastructure.ExternalServices.Email;
using LearnLanguage.Infrastructure.InternalServices;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using LearnLanguage.Infrastructure.ExternalServices.Jwt;
using LearnLanguage.Infrastructure.Data.WriteDb.Interceptor;
using Microsoft.EntityFrameworkCore.Diagnostics;
using LearnLanguage.Domain.Entities;
using LearnLanguage.Infrastructure.ExternalServices.MassTransit;
using LearnLanguage.Infrastructure.ExternalServices.MassTransit.Consumers;
using LearnLanguage.Application.Events;
using MassTransit;

namespace LearnLanguage.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<WriteDbAuditableInterceptor>();

        services.AddDbContext<WriteDbContext>((sp, options) =>
        {
            options.UseSqlServer(configuration.GetConnectionString("WriteDb"));
            options.AddInterceptors(sp.GetRequiredService<WriteDbAuditableInterceptor>());
        });

        services.AddDbContext<ReadDbContext>((sp, options) =>
        {
            var connectionString = configuration.GetConnectionString("ReadDb");
            options.UseSqlServer(connectionString);
        });

        services.Configure<JwtConfiguration>(options => configuration.GetSection(JwtConfiguration.SectionName).Bind(options));
        services.Configure<KafkaConfiguration>(options => configuration.GetSection(KafkaConfiguration.SectionName).Bind(options));
        services.Configure<EmailConfiguration>(options => configuration.GetSection(EmailConfiguration.SectionName).Bind(options));

        //JWT
        services.AddAuthentication(opt =>
        {
            opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(opt =>
        {
            opt.SaveToken = true;
            opt.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = configuration["Jwt:Issuer"],
                ValidAudience = configuration["Jwt:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(configuration["Jwt:AccessKey"] ?? throw new InvalidOperationException("JWT Access Key is not configured")))
            };
        });

        services.AddHttpContextAccessor();

        // Register Memory Cache
        services.AddMemoryCache();
        services.AddScoped<ICacheService, MemoryCacheService>();

        // Register Internal services
        services.AddScoped<IPasswordHasher, PasswordHasher>();
        services.AddScoped<IWriteDbContext, WriteDbContext>();
        services.AddScoped<IReadDbContext, ReadDbContext>();
        services.AddScoped<IUser, GetCurrentUser>();

        // Register MassTransit with Kafka Rider
        services.AddMassTransit(x =>
        {
            x.AddConsumer<UserRegisteredEventConsumer>();
            
            // Use In-Memory transport for the bus
            x.UsingInMemory((context, cfg) =>
            {
                cfg.ConfigureEndpoints(context);
            });

            // Add Kafka as a rider only if enabled
            var kafkaConfig = configuration.GetSection(KafkaConfiguration.SectionName).Get<KafkaConfiguration>()
                ?? new KafkaConfiguration();
            
            if (kafkaConfig.Enabled)
            {
                x.AddRider(rider =>
                {
                    rider.AddConsumer<UserRegisteredEventConsumer>();
                    
                    rider.AddProducer<UserRegisteredEvent>("user-registered-events");
        
                    rider.UsingKafka((context, k) =>
                    {
                        k.Host(kafkaConfig.BootstrapServers);
        
                        k.TopicEndpoint<UserRegisteredEvent>("user-registered-events", kafkaConfig.GroupId, e =>
                        {
                            e.ConfigureConsumer<UserRegisteredEventConsumer>(context);
                            
                            // Configure consumer settings
                            e.AutoOffsetReset = Confluent.Kafka.AutoOffsetReset.Earliest;
                            e.CheckpointInterval = TimeSpan.FromSeconds(10);
                            e.CheckpointMessageCount = 5000;
                        });
                    });
                });
            }
        });

        // Register external services
        services.AddScoped<IEventPublisher, MassTransitEventPublisher>();
        services.AddScoped<IEmailService, EmailService>();
        services.AddScoped<IJwtService, JwtService>();

        return services;
    }
}
