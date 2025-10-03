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
        public string GroupId { get; init; } = "learn-language-group";
        public bool Enabled { get; init; } = false;
        public int SessionTimeoutMs { get; init; } = 10000;
        public int HeartbeatIntervalMs { get; init; } = 3000;
        public string AutoOffsetReset { get; init; } = "earliest";
        public bool AutoCommit { get; init; } = true;
        public int AutoCommitIntervalMs { get; init; } = 1000;
        public int MessageTimeoutMs { get; init; } = 5000;
        public int RequestTimeoutMs { get; init; } = 30000;
        public int RetryBackoffMs { get; init; } = 100;
        public string CompressionType { get; init; } = "none";
        public int BatchSize { get; init; } = 16384;
        public int LingerMs { get; init; } = 0;
        public int BufferMemory { get; init; } = 33554432;
        public int MaxInFlightRequestsPerConnection { get; init; } = 5;
        public int FetchMinBytes { get; init; } = 1;
        public int FetchMaxWaitMs { get; init; } = 500;
    }
}