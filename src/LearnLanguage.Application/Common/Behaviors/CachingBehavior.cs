using LearnLanguage.Application.Common.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Text;

namespace LearnLanguage.Application.Common.Behaviors;

public class CachingBehavior<TRequest, TResponse>(
    ICacheService cacheService,
    ILogger<CachingBehavior<TRequest, TResponse>> logger
) : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>, ICacheableQuery<TResponse>
    where TResponse : class
{
    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        var cacheKey = GenerateCacheKey(request);

        logger.LogDebug("Checking cache for key: {CacheKey}", cacheKey);

        var cachedResponse = await cacheService.GetAsync<TResponse>(cacheKey, cancellationToken);
        if (cachedResponse != null)
        {
            logger.LogInformation("Cache hit for key: {CacheKey}", cacheKey);
            return cachedResponse;
        }

        logger.LogDebug("Cache miss for key: {CacheKey}", cacheKey);

        var response = await next();

        if (response != null)
        {
            var expiration = request.CacheExpiration ?? TimeSpan.FromMinutes(30);
            await cacheService.SetAsync(cacheKey, response, expiration, cancellationToken);

            logger.LogDebug("Response cached with key: {CacheKey}, Expiration: {Expiration}", cacheKey, expiration);
        }

        return response ?? throw new InvalidOperationException("Response cannot be null"); 
    }

    private static string GenerateCacheKey(TRequest request)
    {
        var requestName = typeof(TRequest).Name;
        var keyBuilder = new StringBuilder(requestName);

        if (!string.IsNullOrEmpty(request.CacheKey))
        {
            keyBuilder.Append($":{request.CacheKey}");
        }
        else
        {
            var properties = typeof(TRequest).GetProperties()
                .Where(p => p.CanRead && p.GetValue(request) != null)
                .OrderBy(p => p.Name);

            foreach (var property in properties)
            {
                var value = property.GetValue(request);
                keyBuilder.Append($":{property.Name}={value}");
            }
        }

        return keyBuilder.ToString();
    }
}

public interface ICacheableQuery<T>
{
    string? CacheKey { get; }
    TimeSpan? CacheExpiration { get; }
}