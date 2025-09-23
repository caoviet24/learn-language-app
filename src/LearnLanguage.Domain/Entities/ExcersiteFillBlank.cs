using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LearnLanguage.Domain.Common;

namespace LearnLanguage.Domain.Entities
{
    public class ExcersiteFillBlank : BaseEntity
    {
        public string question { get; set; } = null!;
        public string? media { get; set; }
        public string answer { get; set; } = null!;
        public string excerciseId { get; set; } = null!;
        public virtual Excercises excercise { get; set; } = null!;
    }
}