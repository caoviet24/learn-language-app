using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LearnLanguage.Application.Common.DTOs;
using MediatR;

namespace LearnLanguage.Application.Auth.Commands.ConfirmEmail
{
    public class ConfirmEmailCommandHandler : IRequestHandler<ConfirmEmailCommand, ResponseDTO<string>>
    {
        public Task<ResponseDTO<string>> Handle(ConfirmEmailCommand request, CancellationToken cancellationToken)
        {
            return Task.FromResult(new ResponseDTO<string>
            {
                success = true,
                message = "Xác nhận email thành công",
            });
        }
    }
}