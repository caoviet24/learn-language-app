using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LearnLanguage.Domain.Common;

namespace LearnLanguage.Domain.Entities
{
    public class ExcerciseMatch : BaseEntity
    {
        public string? left { get; set; }
        public string? right { get; set; }
        public string excerciseId { get; set; } = null!;
        public virtual Excercises excercise { get; set; } = null!;
        public string? leftMedia { get; set; }
        public string? rightMedia { get; set; }
    }
}