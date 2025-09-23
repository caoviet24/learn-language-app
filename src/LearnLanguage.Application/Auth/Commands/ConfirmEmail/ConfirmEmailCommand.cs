using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LearnLanguage.Application.Common.DTOs;
using LearnLanguage.Domain.ValueObjects;
using MediatR;

namespace LearnLanguage.Application.Auth.Commands.ConfirmEmail
{
    public class ConfirmEmailCommand : IRequest<ResponseDTO<string>>
    {
        public string token { get; init; } = null!;
    }
}