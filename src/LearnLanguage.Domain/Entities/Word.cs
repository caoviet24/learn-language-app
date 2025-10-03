using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LearnLanguage.Domain.Common;

namespace LearnLanguage.Domain.Entities
{
    public class Word : BaseAuditableEntity
    {
        public string text { get; set; } = null!;
        public string language { get; set; } = null!;
        public string topicId { get; set; } = null!;
        public virtual Topics topic { get; set; } = null!;
        public virtual ICollection<Lessons> lessons { get; set; } = new List<Lessons>();
    }
}