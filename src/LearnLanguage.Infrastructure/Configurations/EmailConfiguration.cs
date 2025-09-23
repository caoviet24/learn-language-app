using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LearnLanguage.Infrastructure.Configurations
{
    public class EmailConfiguration
    {
        public const string SectionName = "Email";
        public string BaseUrl { get; init; } = null!;
        public string SmtpHost { get; init; } = null!;
        public int SmtpPort { get; init; }
        public bool UseSsl { get; init; } = true;
        public string FromEmail { get; init; } = null!;
        public string FromPassword { get; init; } = null!;
        public string FromName { get; init; } = "LearnLanguage";
    }
}