using Core.SMTP;

namespace Core.Interfaces;

public interface ISMTPService
{
    public bool SendEmail(EmailMessage message);
}