using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LearnLanguage.Domain.Common;
using LearnLanguage.Domain.Constants;

namespace LearnLanguage.Domain.Entities
{
    public class Excercises : BaseEntity
    {
        public string type { get; set; } = null!;
        public string content { get; set; } = null!;
        public string lessonId { get; set; } = null!;
        public int order { get; set; }
        public virtual Lessons lesson { get; set; } = null!;
        public virtual ICollection<ExcersiteFillBlank> excersiteFillBlanks { get; set; } = new List<ExcersiteFillBlank>();
        public virtual ICollection<ExcerciseTrueFalse> excerciseTrueFalse { get; set; } = new List<ExcerciseTrueFalse>();
        public virtual ICollection<ExcerciseMatch> excerciseMatch { get; set; } = new List<ExcerciseMatch>();
          
    }
}