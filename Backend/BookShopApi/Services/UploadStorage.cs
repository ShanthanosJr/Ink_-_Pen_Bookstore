namespace BookShopApi.Services;

/// <summary>Saves uploaded files under wwwroot/uploads/{folder} with a random name (never the client's file name).</summary>
public static class UploadStorage
{
    public static readonly Dictionary<string, string> ImageTypes = new(StringComparer.OrdinalIgnoreCase)
    {
        ["image/jpeg"] = ".jpg", ["image/png"] = ".png", ["image/webp"] = ".webp", ["image/gif"] = ".gif"
    };

    public static readonly Dictionary<string, string> SlipTypes = new(ImageTypes, StringComparer.OrdinalIgnoreCase)
    {
        ["application/pdf"] = ".pdf"
    };

    // First bytes of each allowed format, so a renamed file can't pass as an image
    private static readonly (string ext, byte[] magic)[] Signatures =
    {
        (".jpg", new byte[] { 0xFF, 0xD8, 0xFF }),
        (".png", new byte[] { 0x89, 0x50, 0x4E, 0x47 }),
        (".gif", new byte[] { 0x47, 0x49, 0x46, 0x38 }),
        (".webp", new byte[] { 0x52, 0x49, 0x46, 0x46 }), // RIFF
        (".pdf", new byte[] { 0x25, 0x50, 0x44, 0x46 }),  // %PDF
    };

    public static async Task<(string? path, string? error)> SaveAsync(IFormFile? file, string folder,
        Dictionary<string, string> allowedTypes, long maxBytes)
    {
        if (file == null || file.Length == 0) return (null, "No file uploaded.");
        if (file.Length > maxBytes) return (null, $"The file is too large. The limit is {maxBytes / (1024 * 1024)} MB.");
        if (!allowedTypes.TryGetValue(file.ContentType, out var ext))
            return (null, $"This file type isn't allowed. Please upload {string.Join(", ", allowedTypes.Values.Distinct()).ToUpperInvariant().Replace(".", "")}.");

        var header = new byte[4];
        await using (var peek = file.OpenReadStream())
        {
            _ = await peek.ReadAsync(header);
        }
        var signature = Signatures.FirstOrDefault(sig => sig.ext == ext).magic;
        if (signature != null && !header.Take(signature.Length).SequenceEqual(signature))
            return (null, "The file doesn't look like a valid " + ext.TrimStart('.').ToUpperInvariant() + ".");

        var dir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", folder);
        Directory.CreateDirectory(dir);
        var name = $"{Guid.NewGuid():N}{ext}";
        await using (var stream = new FileStream(Path.Combine(dir, name), FileMode.CreateNew))
        {
            await file.CopyToAsync(stream);
        }
        return ($"/uploads/{folder}/{name}", null);
    }
}
