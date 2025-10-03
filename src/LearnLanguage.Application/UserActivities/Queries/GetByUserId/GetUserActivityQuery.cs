using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LearnLanguage.Application.Common.Sercurity;
using LearnLanguage.Application.UserActivities.DTOs;
using MediatR;

namespace LearnLanguage.Application.UserActivities.Queries.GetByUserId
{
    [Authorize]
    public class GetUserActivityQuery : IRequest<List<UserActivityDTO>>
    {

    }
    
}