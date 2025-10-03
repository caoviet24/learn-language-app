using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LearnLanguage.Domain.Common;

namespace LearnLanguage.Domain.Entities
{
    public class UserActivity : BaseAuditableEntity
    {
        public int exp { get; set; }
        public string level { get; set; } = null!;
        public int streakDay { get; set; }
        public int studyTimeToday { get; set; }
        public int studyTimeEveryday { get; set; }
        public int totalStudyTime { get; set; }
        public string languageStudying { get; set; } = null!;
        public int totalLessons { get; set; }
        public virtual User user { get; set; } = null!;

    }
}