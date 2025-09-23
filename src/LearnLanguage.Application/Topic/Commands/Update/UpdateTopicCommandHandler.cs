using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using LearnLanguage.Application.Common.DTOs;
using LearnLanguage.Application.Common.Interfaces;
using LearnLanguage.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LearnLanguage.Application.Topic.Commands.Update
{
    public class UpdateTopicCommandHandler(
        IWriteDbContext writeDbContext,
        IReadDbContext readDbContext,
        IMapper mapper
    ) : IRequestHandler<UpdateTopicCommand, ResponseDTO<TopicDto>>
    {
        public async Task<ResponseDTO<TopicDto>> Handle(UpdateTopicCommand request, CancellationToken cancellationToken)
        {
            var topic = await writeDbContext.Topics.FindAsync(new object[] { request.Id }, cancellationToken);
            if (topic == null)
            {
                return new ResponseDTO<TopicDto>
                {
                    success = false,
                    message = "Topic not found.",
                    data = null
                };
            }

            topic.name = request.name;
            topic.description = request.description;
            await writeDbContext.SaveChangesAsync(cancellationToken);

            return new ResponseDTO<TopicDto>
            {
                success = true,
                message = "Topic updated successfully.",
                data = mapper.Map<TopicDto>(topic)
            };
        }
    }
}