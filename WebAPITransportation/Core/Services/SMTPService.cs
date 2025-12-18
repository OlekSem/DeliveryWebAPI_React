using System.Net;
using System.Net.Mail;
using Core.Interfaces;
using Core.SMTP;

namespace Core.Services;

public class SMTPService : ISMTPService
{
    public bool SendEmail(EmailMessage emailMessage)
    {
        var fromAddress = new MailAddress("quizzytests@gmail.com", "Transportation website");
        var fromPassword = "eplc imyv edac hxzn";

        using var smtp = new SmtpClient
        {
            Host = "smtp.gmail.com",
            Port = 587,
            EnableSsl = true,
            DeliveryMethod = SmtpDeliveryMethod.Network,
            UseDefaultCredentials = false,
            Credentials = new NetworkCredential(fromAddress.Address, fromPassword)
        };

        bool allSuccess = true;
    
        var toAddress = new MailAddress(emailMessage.To);
        using var message = new MailMessage(fromAddress, toAddress)
        {
            Subject = emailMessage.Subject,
            Body = emailMessage.Body
        };

        try
        {
            smtp.Send(message);
            Console.WriteLine($"Email sent successfully to {emailMessage.To}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error sending email to {emailMessage.To}: {ex.Message}");
            allSuccess = false;
        }


        return allSuccess;
    }
}