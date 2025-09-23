using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LearnLanguage.Domain.Common;

namespace LearnLanguage.Domain.Entities
{
    public class Topics : BaseAuditableEntity
    {
        public string name { get; set; } = null!;
        public string description { get; set; } = null!;
        public virtual User user { get; set; } = null!;
        public virtual ICollection<Lessons> lessons { get; set; } = new List<Lessons>();
    }
}