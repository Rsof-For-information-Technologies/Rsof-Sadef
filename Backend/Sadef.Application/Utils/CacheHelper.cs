using Microsoft.Extensions.Caching.Distributed;

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
    }
}
