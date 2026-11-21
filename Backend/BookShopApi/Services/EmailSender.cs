using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Options;

namespace BookShopApi.Services;

/// <summary>Bound from the "Email" section. Leave SmtpHost empty to log emails instead of sending them.</summary>
public class EmailSettings
{
    public string? SmtpHost { get; set; }
    public int SmtpPort { get; set; } = 587;
    public bool EnableSsl { get; set; } = true;
    public string? Username { get; set; }
    public string? Password { get; set; }
    public string FromAddress { get; set; } = "no-reply@inkandpens.com";
    public string FromName { get; set; } = "Ink & Pens";
    // Where contact-form messages are forwarded (optional)
    public string? ShopInbox { get; set; }
}

public interface IEmailSender
{
    /// <summary>Sends a plain-text email. Never throws: email problems must not break orders or sign-in.</summary>
    Task SendAsync(string to, string subject, string body);
}

public class EmailSender : IEmailSender
{
    private readonly EmailSettings _settings;
    private readonly ILogger<EmailSender> _logger;

    public EmailSender(IOptions<EmailSettings> settings, ILogger<EmailSender> logger)
    {
        _settings = settings.Value;
        _logger = logger;
    }

    public async Task SendAsync(string to, string subject, string body)
    {
        if (string.IsNullOrWhiteSpace(_settings.SmtpHost))
        {
            // Development mode: show the email in the API console
            _logger.LogInformation("Email (not sent, SMTP not configured)\nTo: {To}\nSubject: {Subject}\n\n{Body}", to, subject, body);
            return;
        }

        try
        {
            using var message = new MailMessage
            {
                From = new MailAddress(_settings.FromAddress, _settings.FromName),
                Subject = subject,
                Body = body,
                IsBodyHtml = false
            };
            message.To.Add(to);

            using var client = new SmtpClient(_settings.SmtpHost, _settings.SmtpPort)
            {
                EnableSsl = _settings.EnableSsl,
                Credentials = string.IsNullOrEmpty(_settings.Username)
                    ? CredentialCache.DefaultNetworkCredentials
                    : new NetworkCredential(_settings.Username, _settings.Password)
            };
            await client.SendMailAsync(message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email '{Subject}' to {To}", subject, to);
        }
    }
}
