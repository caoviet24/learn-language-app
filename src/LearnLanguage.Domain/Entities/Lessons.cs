using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LearnLanguage.Domain.Common;

namespace LearnLanguage.Domain.Entities
{
    public class Lessons : BaseAuditableEntity
    {
        public string title { get; set; } = null!;
        public string description { get; set; } = null!;
        public int expReward { get; set; }
        public string topicId { get; set; } = null!;
        public string levelId { get; set; } = null!;
        public virtual Topics topic { get; set; } = null!;
        public virtual Levels level { get; set; } = null!;
        public virtual User user { get; set; } = null!;
        public virtual ICollection<Word> words { get; set; } = new List<Word>();
    }
}