using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LearnLanguage.Infrastructure.Configurations
{
    public class JwtConfiguration
    {
        public const string SectionName = "Jwt";
        public string AccessKey { get; set; } = null!;
        public int AccessExpiresMinutes { get; set; }
        public string RefreshKey { get; set; } = null!;
        public int RefreshExpiresInDay { get; set; }
        public string ConfirmEmailKey { get; set; } = null!;
        public int ConfirmEmailExpiresInMinutes { get; set; }
        public string Issuer { get; set; } = null!;
        public string Audience { get; set; } = null!;
    }
}