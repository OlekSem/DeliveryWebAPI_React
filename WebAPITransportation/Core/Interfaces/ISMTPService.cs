namespace Core.Interfaces;

public interface ISMTPService
{
    public bool SendEmail(string email, string subject, string text);
}