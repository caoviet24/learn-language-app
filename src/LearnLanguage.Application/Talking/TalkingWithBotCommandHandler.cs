using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LearnLanguage.Application.Events;
using MediatR;

namespace LearnLanguage.Application.Talking
{
    public class TalkingWithBotCommandHandler(IPublisher publisher) : IRequestHandler<TalkingWithBotCommand, string>
    {
        public async Task<string> Handle(TalkingWithBotCommand request, CancellationToken cancellationToken)
        {
            await publisher.Publish(new UserTalkingWithBot(request.message), cancellationToken);
            return $"Received message: {request.message}";
        }
    }
}