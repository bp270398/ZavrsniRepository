using MailKit.Net.Smtp;
using MimeKit;
using Rhetos;

namespace Repository.Server
{
    public class EmailService : IEmailService
    {
        private readonly IEmailConfiguration _emailConfiguration;

        public EmailService(Rhetos.Utilities.IConfiguration configuration)
        {
            _emailConfiguration = configuration.GetOptions<EmailConfiguration>("EmailConfiguration");
        }

        public void SendEmail(EmailMessage email)
        {
            var emailMessage = CreateEmailMessage(email);
            try
            {
                Send(emailMessage);
            }
            catch (UserException ex)
            {
                throw ex;
            }
        }

        public async Task SendEmailAsync(EmailMessage message)
        {
            var mailMessage = CreateEmailMessage(message);
            try
            {
                await SendAsync(mailMessage);
            }
            catch (Exception)
            {
                throw;
            }
        }

        private MimeMessage CreateEmailMessage(EmailMessage message)
        {

            var emailMessage = new MimeMessage();
            emailMessage.From.Add(new MailboxAddress("email", _emailConfiguration.From));
            emailMessage.To.AddRange(message.To);
            emailMessage.Subject = message.Subject;

            var bodyBuilder = new BodyBuilder { HtmlBody = string.Format("<div>{0}</div>", message.Content) };
            if (message.Attachments != null && message.Attachments.Any())
            {
                byte[] fileBytes;
                foreach (var attachment in message.Attachments)
                {
                    using (var ms = new MemoryStream())
                    {
                        attachment.CopyTo(ms);
                        fileBytes = ms.ToArray();
                    }
                    bodyBuilder.Attachments.Add(attachment.FileName, fileBytes, ContentType.Parse(attachment.ContentType));
                }
            }
            emailMessage.Body = bodyBuilder.ToMessageBody();

            return emailMessage;
        }

        private async Task Send(MimeMessage mailMessage)
        {
            using (var client = new SmtpClient())
            {
                try
                {
                    await client.ConnectAsync(_emailConfiguration.SmtpServer, _emailConfiguration.Port, true);
                    client.AuthenticationMechanisms.Remove("XOAUTH2");
                    client.Authenticate(_emailConfiguration.UserName, _emailConfiguration.Password);

                    client.Send(mailMessage);
                }
                catch (Exception ex)
                {
                    throw new Rhetos.UserException(ex.Message);
                }
                finally
                {
                    client.Disconnect(true);
                    client.Dispose();
                }
            }
        }

        private async Task SendAsync(MimeMessage mailMessage)
        {
            using (var client = new SmtpClient())
            {
                try
                {
                    await client.ConnectAsync(_emailConfiguration.SmtpServer, _emailConfiguration.Port, MailKit.Security.SecureSocketOptions.StartTls);

                    client.AuthenticationMechanisms.Remove("XOAUTH2");

                    await client.AuthenticateAsync(_emailConfiguration.UserName, _emailConfiguration.Password);

                    await client.SendAsync(mailMessage);
                }
                catch (Exception ex)
                {
                    throw new Rhetos.UserException(ex.Message);
                }
                finally
                {
                    await client.DisconnectAsync(true);
                    client.Dispose();
                }
            }
        }
    }
}
