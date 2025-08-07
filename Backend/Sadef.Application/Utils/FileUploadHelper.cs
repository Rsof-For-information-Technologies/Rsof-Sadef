using Microsoft.AspNetCore.Http;

namespace Sadef.Application.Utils
{
    public static class FileUploadHelper
    {
        public static async Task<List<(string Url, string ContentType)>> SaveFilesAsync(
        IEnumerable<IFormFile> files, string uploadRoot, string filePrefix, string virtualPathBase = "")
        {
            var savedFiles = new List<(string Url, string ContentType)>();
            Directory.CreateDirectory(uploadRoot);

            foreach (var file in files)
            {
                var extension = Path.GetExtension(file.FileName);
                var fileName = $"{filePrefix}_{Guid.NewGuid()}{extension}";
                var filePath = Path.Combine(uploadRoot, fileName);

                using var stream = new FileStream(filePath, FileMode.Create);
                await file.CopyToAsync(stream);

                var virtualPath = Path.Combine(virtualPathBase, fileName).Replace("\\", "/");
                savedFiles.Add(($"{virtualPath.TrimStart('/')}", file.ContentType));
            }

            return savedFiles;
        }

        public static void RemoveFileIfExists(string relativePath)
        {
            if (string.IsNullOrWhiteSpace(relativePath))
                return;

            var fullPath = Path.Combine("wwwroot", relativePath.TrimStart('/'));

            if (File.Exists(fullPath))
            {
                File.Delete(fullPath);
            }
        }

        public static void DeleteFiles(IEnumerable<string> relativePaths)
        {
            if (relativePaths == null) return;

            foreach (var path in relativePaths)
            {
                if (string.IsNullOrWhiteSpace(path)) continue;

                var fullPath = Path.Combine("wwwroot", path.TrimStart('/'));

                if (File.Exists(fullPath))
                {
                    File.Delete(fullPath);
                }
            }
        }

    }

}
