namespace Repository.Server
{
    public interface IEmailService
    {
        void SendEmail(EmailMessage email);
        Task SendEmailAsync(EmailMessage message);
    }
}
