using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LearnLanguage.API
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApi(this IServiceCollection services, IConfiguration configuration)
        {
        
            services.AddOpenApiDocument(config =>
            {
                config.Title = "Learn Language API";
                config.Version = "v1";
                config.Description = "API documentation for Learn Language project";
                // Thêm JWT Bearer support
                config.AddSecurity("Bearer", Enumerable.Empty<string>(), new NSwag.OpenApiSecurityScheme
                {
                    Type = NSwag.OpenApiSecuritySchemeType.ApiKey,
                    Name = "Authorization",
                    In = NSwag.OpenApiSecurityApiKeyLocation.Header,
                    Description = "Nhập JWT token vào format: Bearer {token}"
                });

                // Áp dụng JWT cho tất cả operation
                config.OperationProcessors.Add(
                    new NSwag.Generation.Processors.Security.AspNetCoreOperationSecurityScopeProcessor("JWT")
                );
            });

            services.AddControllers();
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();

            return services;
        }
    }
}