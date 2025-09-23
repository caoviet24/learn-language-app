using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;

namespace LearnLanguage.Application.Topic.Commands
{
    public class CreateTopicCommandValidator : AbstractValidator<CreateTopicCommand>
    {
        public CreateTopicCommandValidator()
        {
            RuleFor(x => x.name)
                .NotEmpty().WithMessage("Name is required.")
                .MaximumLength(100).WithMessage("Name must not exceed 100 characters.");

            RuleFor(x => x.description)
                .NotEmpty().WithMessage("Description is required.")
                .MaximumLength(500).WithMessage("Description must not exceed 500 characters.");
        }
    }
}