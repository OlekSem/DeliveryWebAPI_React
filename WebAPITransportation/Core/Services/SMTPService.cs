using System.Net;
using System.Net.Mail;
using Core.Interfaces;

namespace Core.Services;

public class SMTPService : ISMTPService
{
    public bool SendEmail(string email, string subject, string text)
    {
        var fromAddress = new MailAddress("quizzytests@gmail.com", "Quizzy");
        var toAddress = new MailAddress(email, "Dear User");
        const string fromPassword = "eplc imyv edac hxzn";
        
        var smtp = new SmtpClient
        {
            Host = "smtp.gmail.com",
            Port = 587,
            EnableSsl = true,
            DeliveryMethod = SmtpDeliveryMethod.Network,
            UseDefaultCredentials = false,
            Credentials = new NetworkCredential(fromAddress.Address, fromPassword)
        };

        using var message = new MailMessage(fromAddress, toAddress)
        {
            Subject = subject,
            Body = text
        };

        try
        {
            smtp.Send(message);
            Console.WriteLine("Email sent successfully.");
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine("Error: " + ex.Message);
            return false;
        }
    }
}