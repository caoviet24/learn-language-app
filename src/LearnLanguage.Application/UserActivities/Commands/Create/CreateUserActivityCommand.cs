using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LearnLanguage.Application.Common.Sercurity;
using LearnLanguage.Application.UserActivities.DTOs;
using LearnLanguage.Domain.Common;
using MediatR;

namespace LearnLanguage.Application.UserActivities.Commands.Create
{
    [Authorize]
    public class CreateUserActivityCommand : IRequest<UserActivityDTO>
    {
        public string languageStudying { get; set; } = null!;
        public int studyTimeEveryday { get; set; }
    }
    
}