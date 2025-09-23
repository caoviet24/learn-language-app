using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using LearnLanguage.Application.Common.Interfaces;
using LearnLanguage.Domain.Entities;
using LearnLanguage.Infrastructure.Configurations;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace LearnLanguage.Infrastructure.ExternalServices.Jwt
{
    public class JwtService(IOptions<JwtConfiguration> options) : IJwtService
    {
        private readonly JwtConfiguration _jwtConfig = options.Value;

        public Task<string> generateAccessTokenAsync(User user)
        {
            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_jwtConfig.AccessKey));
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Role, user.role.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(_jwtConfig.AccessExpiresMinutes),
                Issuer = _jwtConfig.Issuer,
                Audience = _jwtConfig.Audience,
                SigningCredentials = creds
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenString = tokenHandler.CreateToken(token);
            return Task.FromResult(tokenHandler.WriteToken(tokenString));
        }

        public Task<string> generateEmailConfirmationTokenAsync(User user)
        {
            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_jwtConfig.ConfirmEmailKey));
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Role, user.role.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddSeconds(_jwtConfig.ConfirmEmailExpiresInMinutes),
                Issuer = _jwtConfig.Issuer,
                Audience = _jwtConfig.Audience,
                SigningCredentials = creds
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenString = tokenHandler.CreateToken(token);
            return Task.FromResult(tokenHandler.WriteToken(tokenString));
        }

        public Task<string> generateRefreshTokenAsync(User user)
        {
             var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_jwtConfig.RefreshKey));
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Role, user.role.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(_jwtConfig.RefreshExpiresInDay),
                Issuer = _jwtConfig.Issuer,
                Audience = _jwtConfig.Audience,
                SigningCredentials = creds
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenString = tokenHandler.CreateToken(token);
            return Task.FromResult(tokenHandler.WriteToken(tokenString));
        }
    }
}