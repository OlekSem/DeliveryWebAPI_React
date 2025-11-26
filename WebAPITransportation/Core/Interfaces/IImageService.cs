using Microsoft.AspNetCore.Http;

namespace Core.Interfaces;

public interface IImageService
{
    public Task<string> UploadImageAsync(IFormFile file);
    public Task<bool> DeleteImageAsync(string name);
}