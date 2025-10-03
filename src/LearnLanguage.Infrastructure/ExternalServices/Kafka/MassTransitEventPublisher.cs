using System;
using System.Threading;
using System.Threading.Tasks;
using LearnLanguage.Application.Common.Interfaces;
using LearnLanguage.Application.Events;
using LearnLanguage.Infrastructure.Configurations;
using MassTransit;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.DependencyInjection;

namespace LearnLanguage.Infrastructure.ExternalServices.MassTransit
{
    public class MassTransitEventPublisher : IEventPublisher
    {
        private readonly ITopicProducer<UserRegisteredEvent>? _userRegisteredProducer;
        private readonly IBus _bus;
        private readonly ILogger<MassTransitEventPublisher> _logger;
        private readonly IOptions<KafkaConfiguration> _kafkaOptions;

        public MassTransitEventPublisher(
            IServiceProvider serviceProvider,
            IBus bus,
            ILogger<MassTransitEventPublisher> logger,
            IOptions<KafkaConfiguration> kafkaOptions)
        {
            // Try to resolve the producer from the service provider
            _userRegisteredProducer = serviceProvider.GetService<ITopicProducer<UserRegisteredEvent>>();
            _bus = bus;
            _logger = logger;
            _kafkaOptions = kafkaOptions;
        }

        public async Task PublishAsync<T>(T @event, CancellationToken cancellationToken = default) where T : class
        {
            try
            {
                _logger.LogInformation("Publishing event of type {EventType}", typeof(T).Name);

                // Check if Kafka is enabled and producer is available
                if (_kafkaOptions.Value.Enabled && _userRegisteredProducer != null)
                {
                    // Route to the appropriate producer based on event type
                    switch (@event)
                    {
                        case UserRegisteredEvent userRegisteredEvent:
                            await _userRegisteredProducer.Produce(userRegisteredEvent, cancellationToken);
                            break;
                        default:
                            _logger.LogWarning("No producer configured for event type {EventType}", typeof(T).Name);
                            throw new NotSupportedException($"No producer configured for event type {typeof(T).Name}");
                    }
                }
                else
                {
                    // If Kafka is disabled or producer not available, publish directly to the in-memory bus
                    await _bus.Publish(@event, cancellationToken);
                    _logger.LogInformation("Published event to in-memory bus since Kafka is disabled or not configured");
                }

                _logger.LogInformation("Successfully published event of type {EventType}", typeof(T).Name);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to publish event of type {EventType}", typeof(T).Name);
                throw;
            }
        }
    }
}