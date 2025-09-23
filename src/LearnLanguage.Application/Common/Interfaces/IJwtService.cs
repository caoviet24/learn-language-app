using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LearnLanguage.Domain.Entities;

namespace LearnLanguage.Application.Common.Interfaces
{
    public interface IJwtService
    {
        Task<string> generateAccessTokenAsync(User user);
        Task<string> generateRefreshTokenAsync(User user);
        Task<string> generateEmailConfirmationTokenAsync(User user);

    }
}