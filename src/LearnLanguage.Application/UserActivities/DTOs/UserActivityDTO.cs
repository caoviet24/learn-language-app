using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LearnLanguage.Application.UserActivities.DTOs
{
    public class UserActivityDTO
    {
        public string Id { get; set; } = null!;
        public int exp { get; set; }
        public string level { get; set; } = null!;
        public int streakDay { get; set; }
        public int studyTimeToday { get; set; }
        public int studyTimeEveryday { get; set; }
        public int totalStudyTime { get; set; }
        public string languageStudying { get; set; } = null!;
        public string userId { get; set; } = null!;
    }
}