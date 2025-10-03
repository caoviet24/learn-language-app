using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MediatR;

namespace LearnLanguage.Application.Talking
{
    public class TalkingWithBotCommand : IRequest<string>
    {
        public string message { get; }
    }

    public record TalkingWithBotResponse
    {
        public string message { get; init; } = null!;
    }
}