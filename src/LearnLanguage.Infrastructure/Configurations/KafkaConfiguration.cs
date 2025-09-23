using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LearnLanguage.Infrastructure.Configurations
{
    public class KafkaConfiguration
    {
        public const string SectionName = "Kafka";
        public string BootstrapServers { get; init; } = "localhost:9092";
        public string ClientId { get; init; } = "LearnLanguage.API";
        public bool Enabled { get; init; } = true;
    }
}