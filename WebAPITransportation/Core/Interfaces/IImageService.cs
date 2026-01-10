using Microsoft.AspNetCore.Http;

namespace Core.Interfaces;

public interface IImageService
{
    public  Task<string> UploadImageAsync(IFormFile file);
     Task<bool> DeleteImageAsync(string name);
    Task<string> SaveImageAsync(byte[] bytes);
    Task<string> SaveImageFromUrlAsync(string imageUrl);
}