using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Confluent.Kafka;
using LearnLanguage.Application.Common.Interfaces;
using LearnLanguage.Infrastructure.Configurations;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace LearnLanguage.Infrastructure.ExternalServices.Kafka
{
    public class KafkaProducerService(
    ILogger<KafkaProducerService> logger,
    IOptions<KafkaConfiguration> kafkaOptions
) : IDisposable, IEventPublisher
    {
        private readonly IProducer<string, string> _producer = CreateProducer(kafkaOptions.Value);

        private static IProducer<string, string> CreateProducer(KafkaConfiguration settings)
        {
            var config = new ProducerConfig
            {
                BootstrapServers = settings.BootstrapServers,
                ClientId = settings.ClientId,
                Acks = Acks.All,
                RetryBackoffMs = 1000,
                MessageSendMaxRetries = 3,
                EnableIdempotence = true,
                CompressionType = CompressionType.Snappy,
                BatchSize = 16384,
                LingerMs = 5
            };

            return new ProducerBuilder<string, string>(config)
                .SetErrorHandler((_, e) => Console.WriteLine($"Kafka Producer Error: {e.Reason}"))
                .Build();
        }

        public async Task PublishAsync<T>(T @event, CancellationToken cancellationToken = default) where T : class
        {
            try
            {
                var _key = @event.GetType().Name;
                var value = JsonSerializer.Serialize(@event);
                var headers = new Headers();
                headers.Add("event-type", System.Text.Encoding.UTF8.GetBytes(@event.GetType().FullName!));
                headers.Add("timestamp", System.Text.Encoding.UTF8.GetBytes(DateTimeOffset.UtcNow.ToString()));
                headers.Add("source", System.Text.Encoding.UTF8.GetBytes("LearnLanguage.API"));
                var message = new Message<string, string>
                {
                    Key = _key,
                    Value = value,
                    Headers = headers
                };

                var deliveryReport = await _producer.ProduceAsync(@event.GetType().Name, message, cancellationToken);

                logger.LogInformation(
                    "Event published to Kafka - Topic: {Topic}, Key: {Key}, Partition: {Partition}, Offset: {Offset}",
                    deliveryReport.Topic,
                    deliveryReport.Key,
                    deliveryReport.Partition,
                    deliveryReport.Offset
                );
            }
            catch (ProduceException<string, string> ex)
            {
                logger.LogError(ex, "Failed to publish event to Kafka - Topic: {Topic}, Key: {Key}",
                    @event.GetType().Name, @event.GetType().Name);
                throw;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Unexpected error publishing event to Kafka");
                throw;
            }
        }

        public void Dispose()
        {
            try
            {
                _producer?.Flush(TimeSpan.FromSeconds(10));
                _producer?.Dispose();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error disposing Kafka producer");
            }
        }
    }

}