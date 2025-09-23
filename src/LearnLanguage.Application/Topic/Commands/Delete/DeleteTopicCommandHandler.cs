using System.Threading;
using System.Threading.Tasks;
using LearnLanguage.Application.Common.DTOs;
using LearnLanguage.Application.Common.Interfaces;
using MediatR;

namespace LearnLanguage.Application.Topic.Commands.Delete
{
    public class DeleteTopicCommandHandler(
        IWriteDbContext writeDbContext
    ) : IRequestHandler<DeleteTopicCommand, ResponseDTO<bool>>
    {
        public async Task<ResponseDTO<bool>> Handle(DeleteTopicCommand request, CancellationToken cancellationToken)
        {
            var topic = await writeDbContext.Topics.FindAsync(new object[] { request.Id }, cancellationToken);
            if (topic == null)
            {
                return new ResponseDTO<bool>
                {
                    success = false,
                    message = "Topic not found.",
                    data = false
                };
            }

            writeDbContext.Topics.Remove(topic);
            await writeDbContext.SaveChangesAsync(cancellationToken);

            return new ResponseDTO<bool>
            {
                success = true,
                message = "Topic deleted successfully.",
                data = true
            };
        }
    }
}