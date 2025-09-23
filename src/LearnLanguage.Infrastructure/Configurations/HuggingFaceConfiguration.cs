using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LearnLanguage.Infrastructure.Configurations
{
    public class HuggingFaceConfiguration
    {
        public const string SectionName = "HuggingFace";
        public string ApiKey { get; set; } = null!;
        public string Model { get; set; } = null!;
    }
}