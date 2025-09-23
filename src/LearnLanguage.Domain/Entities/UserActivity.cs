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
        public int studyTime { get; set; }
        public int totalWords { get; set; }
        public bool isCompleted { get; set; }
        public virtual User user { get; set; } = null!;

    }
}