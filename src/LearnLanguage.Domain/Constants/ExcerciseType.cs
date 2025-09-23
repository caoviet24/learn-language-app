using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LearnLanguage.Domain.Constants
{
    public class ExcerciseType
    {
        public const string MatchingCell = nameof(MatchingCell);
        public const string FillInTheBlank = nameof(FillInTheBlank);
        public const string MultipleChoice = nameof(MultipleChoice);
        public const string TrueFalse = nameof(TrueFalse);
        public const string VoiceRecording = nameof(VoiceRecording);
        public const string SelectWordUnderImage = nameof(SelectWordUnderImage);
        public const string RewriteFromRecord = nameof(RewriteFromRecord);
        public const string FindMistake = nameof(FindMistake);
    }
}