using System;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Confluent.Kafka;
using LearnLanguage.Infrastructure.Configurations;
using LearnLanguage.Infrastructure.ExternalServices.Kafka.EventsHandler;
using LearnLanguage.Application.Events;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;

namespace LearnLanguage.Infrastructure.ExternalServices.Kafka
{
    public class KafkaConsumerService : BackgroundService
    {
        private readonly KafkaConfiguration _kafkaConfiguration;
        private readonly IServiceProvider _serviceProvider;

        public KafkaConsumerService(IOptions<KafkaConfiguration> options, IServiceProvider serviceProvider)
        {
            _kafkaConfiguration = options.Value;
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var consumerConfig = new ConsumerConfig
            {
                BootstrapServers = _kafkaConfiguration.BootstrapServers,
                GroupId = "LearnLanguage.Consumer",
                AutoOffsetReset = AutoOffsetReset.Earliest,
                EnableAutoCommit = false
            };

            using var consumer = new ConsumerBuilder<string, string>(consumerConfig).Build();
            consumer.Subscribe(UserRegisteredEvent.EventName);

            try
            {
                while (!stoppingToken.IsCancellationRequested)
                {
                    try
                    {
                        var cr = consumer.Consume(TimeSpan.FromSeconds(1));
                        if (cr == null || cr.Message == null)
                        {
                            await Task.Delay(500, stoppingToken);
                            continue;
                        }



                        var userCreatedEvent = JsonSerializer.Deserialize<UserRegisteredEvent>(
                            cr.Message.Value,
                            new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
                        );

                        if (userCreatedEvent != null)
                        {
                            using var scope = _serviceProvider.CreateScope();
                            var handler = scope.ServiceProvider.GetRequiredService<UserRegisteredEventHandler>();
                            await handler.HandleAsync(userCreatedEvent, stoppingToken);
                        }

                        consumer.Commit(cr);
                    }
                    catch (ConsumeException ex)
                    {
                        Console.WriteLine($"Kafka consume error: {ex.Error.Reason}");
                    }
                }
            }
            catch (OperationCanceledException)
            {
                Console.WriteLine("Kafka consumer shutting down...");
                consumer.Close();
            }
        }
    }
}
