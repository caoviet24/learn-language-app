using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LearnLanguage.Application.Events
{
    public class UserTalkingWithBot
    {
        public const string EventName = "UserTalkingWithBot";
        public string Text { get; }

        public UserTalkingWithBot(string text)
        {
            Text = text;
        }
    }
}