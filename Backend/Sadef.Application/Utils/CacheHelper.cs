using Microsoft.Extensions.Caching.Distributed;
using System.Text;

namespace Sadef.Application.Utils
{
    public static class CacheHelper
    {
        public static async Task<int> GetCacheVersionAsync(IDistributedCache cache, string cacheVersionKey)
        {
            var versionBytes = await cache.GetAsync(cacheVersionKey);
            if (versionBytes == null) return 1;
            return BitConverter.ToInt32(versionBytes, 0);
        }

        public static async Task IncrementCacheVersionAsync(IDistributedCache cache, string cacheVersionKey)
        {
            int currentVersion = await GetCacheVersionAsync(cache, cacheVersionKey);
            int newVersion = currentVersion + 1;
            var versionBytes = BitConverter.GetBytes(newVersion);
            await cache.SetAsync(cacheVersionKey, versionBytes);
        }
        public static async Task RemoveCacheKeyAsync(IDistributedCache cache, string key)
        {
            await cache.RemoveAsync(key);
        }
        public static async Task<string> GeneratePaginatedCacheKey<TFilter>(IDistributedCache cache, string cacheVersionKey, string entityPrefix, int page, int size, TFilter filters)
        {
            int version = await GetCacheVersionAsync(cache, cacheVersionKey);
            var keyBuilder = new StringBuilder($"{entityPrefix}:{version}:page={page}&size={size}");

            if (filters != null)
            {
                var properties = typeof(TFilter).GetProperties();

                foreach (var prop in properties)
                {
                    var value = prop.GetValue(filters);
                    if (value == null) continue;

                    string stringValue = value switch
                    {
                        DateTime dt => dt.ToString("yyyyMMdd"),
                        DateTimeOffset dto => dto.ToString("yyyyMMdd"),
                        Enum e => e.ToString(),
                        _ => value.ToString()
                    };

                    if (!string.IsNullOrWhiteSpace(stringValue))
                        keyBuilder.Append($"&{prop.Name.ToLower()}={stringValue}");
                }
            }

            return keyBuilder.ToString();
        }

    }
}
