using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;
using LearnLanguage.Application.Users.Queries.GetAll;
using MediatR;

namespace LearnLanguage.Application.Users.Queries.GetById
{
    public class GetUserByIdQuery : IRequest<UserDto>
    {
        public string Id { get; set; } = null!;
    }

    public class GetUserByIdQueryValidator : AbstractValidator<GetUserByIdQuery>
    {
        public GetUserByIdQueryValidator()
        {
            RuleFor(x => x.Id).NotEmpty().WithMessage("Id is required.");
        }
    }


}