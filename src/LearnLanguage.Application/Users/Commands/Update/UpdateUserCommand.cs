using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;
using LearnLanguage.Application.Common.DTOs;
using LearnLanguage.Application.Users.Queries.GetAll;
using MediatR;

namespace LearnLanguage.Application.Users.Commands.Update
{
    public class UpdateUserCommand : IRequest<ResponseDTO<UserDto>>
    {
        public string Id { get; set; } = null!;
        public string firstName { get; set; } = null!;
        public string lastName { get; set; } = null!;
    }

    public class UpdateUserCommandValidator : AbstractValidator<UpdateUserCommand>
    {
        public UpdateUserCommandValidator()
        {

        }
    }


}