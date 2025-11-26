using Core.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Webp;
using SixLabors.ImageSharp.Processing;

namespace Core.Services;

public class ImageService(IConfiguration configuration) : IImageService
{
    public async Task<string> UploadImageAsync(IFormFile file)
    {
        try
        {
            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);
            var fileName = Path.GetRandomFileName() + ".webp";
            var bytes = memoryStream.ToArray();
            using var image = Image.Load(bytes);
            image.Mutate(imgc =>
            {
                imgc.Resize(new ResizeOptions
                {
                    Size = new Size(600, 600),
                    Mode = ResizeMode.Max
                });
            });
            var dirImageName = configuration["DirImageName"] ?? "images";
            var path = Path.Combine(Directory.GetCurrentDirectory(), dirImageName, fileName);
            await image.SaveAsync(path, new WebpEncoder());
            return fileName;
        }
        catch
        {
            return String.Empty;
        }
    }

    public async Task<bool> DeleteImageAsync(string name)
    {
        if (string.IsNullOrEmpty(name))
            return false;

        var imagePath = Path.Combine(Directory.GetCurrentDirectory(), "images", name);

        if (!File.Exists(imagePath))
            return false;

        try
        {
            File.Delete(imagePath);
            await Task.CompletedTask;

            return true;
        }
        catch (Exception ex)
        {
            return false;
        }
    }
}