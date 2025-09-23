using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LearnLanguage.Domain.Common;

namespace LearnLanguage.Domain.Entities
{
    public class Levels : BaseAuditableEntity
    {
        public string name { get; set; } = null!;
        public int requiredExp { get; set; }
        public virtual User user { get; set; } = null!;
    }
}