using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using LearnLanguage.Application.Common.Interfaces;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;

namespace LearnLanguage.Infrastructure.InternalServices
{
    public class MemoryCacheService(
    IMemoryCache memoryCache,
    ILogger<MemoryCacheService> logger
) : ICacheService
    {
        private readonly ConcurrentDictionary<string, bool> _cacheKeys = new();

        public Task<T?> GetAsync<T>(string key, CancellationToken cancellationToken = default) where T : class
        {
            try
            {
                if (memoryCache.TryGetValue(key, out var cachedValue))
                {
                    if (cachedValue is string jsonString)
                    {
                        var result = JsonSerializer.Deserialize<T>(jsonString);
                        logger.LogDebug("Cache hit for key: {Key}", key);
                        return Task.FromResult(result);
                    }

                    if (cachedValue is T directValue)
                    {
                        logger.LogDebug("Cache hit for key: {Key}", key);
                        return Task.FromResult<T?>(directValue);
                    }
                }

                logger.LogDebug("Cache miss for key: {Key}", key);
                return Task.FromResult<T?>(null);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error getting cache value for key: {Key}", key);
                return Task.FromResult<T?>(null);
            }
        }

        public Task SetAsync<T>(string key, T value, TimeSpan? expiration = null, CancellationToken cancellationToken = default) where T : class
        {
            try
            {
                var options = new MemoryCacheEntryOptions();

                if (expiration.HasValue)
                {
                    options.SetAbsoluteExpiration(expiration.Value);
                }
                else
                {
                    // Default expiration of 30 minutes
                    options.SetAbsoluteExpiration(TimeSpan.FromMinutes(30));
                }

                // Set sliding expiration to extend cache life on access
                options.SetSlidingExpiration(TimeSpan.FromMinutes(5));

                // Set priority
                options.SetPriority(CacheItemPriority.Normal);

                // Register removal callback
                options.RegisterPostEvictionCallback((evictedKey, evictedValue, reason, state) =>
                {
                    if (evictedKey is string keyString)
                    {
                        _cacheKeys.TryRemove(keyString, out _);
                        logger.LogDebug("Cache entry removed: {Key}, Reason: {Reason}", keyString, reason);
                    }
                });

                // Serialize complex objects to JSON for better memory efficiency
                var cacheValue = value is string str ? str : JsonSerializer.Serialize(value);

                memoryCache.Set(key, cacheValue, options);
                _cacheKeys.TryAdd(key, true);

                logger.LogDebug("Cache set for key: {Key}, Expiration: {Expiration}", key, expiration);

                return Task.CompletedTask;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error setting cache value for key: {Key}", key);
                return Task.CompletedTask;
            }
        }

        public Task RemoveAsync(string key, CancellationToken cancellationToken = default)
        {
            try
            {
                memoryCache.Remove(key);
                _cacheKeys.TryRemove(key, out _);

                logger.LogDebug("Cache removed for key: {Key}", key);

                return Task.CompletedTask;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error removing cache value for key: {Key}", key);
                return Task.CompletedTask;
            }
        }

        public Task RemoveByPatternAsync(string pattern, CancellationToken cancellationToken = default)
        {
            try
            {
                var regex = new Regex(pattern, RegexOptions.Compiled | RegexOptions.IgnoreCase);
                var keysToRemove = _cacheKeys.Keys.Where(key => regex.IsMatch(key)).ToList();

                foreach (var key in keysToRemove)
                {
                    memoryCache.Remove(key);
                    _cacheKeys.TryRemove(key, out _);
                }

                logger.LogDebug("Cache removed by pattern: {Pattern}, Count: {Count}", pattern, keysToRemove.Count);

                return Task.CompletedTask;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error removing cache values by pattern: {Pattern}", pattern);
                return Task.CompletedTask;
            }
        }
    }
}