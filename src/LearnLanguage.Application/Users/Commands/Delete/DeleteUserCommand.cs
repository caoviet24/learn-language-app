using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;
using LearnLanguage.Application.Common.DTOs;
using LearnLanguage.Application.Users.Queries.GetAll;
using MediatR;

namespace LearnLanguage.Application.Users.Commands.Delete
{
    public class DeleteUserCommand : IRequest<ResponseDTO<UserDto>>
    {
        public string Id { get; set; } = null!;
    }

    public class DeleteUserCommandValidator : AbstractValidator<DeleteUserCommand>
    {
        public DeleteUserCommandValidator()
        {
            RuleFor(x => x.Id).NotEmpty().WithMessage("Id is required.");
        }
    }
}