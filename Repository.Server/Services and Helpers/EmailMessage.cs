using MimeKit;

namespace Repository.Server
{
    [Serializable]
    public class EmailMessage
    {
        public List<MailboxAddress> To { get; set; }
        public string Subject { get; set; }
        public string Content { get; set; }
        public IFormFileCollection Attachments { get; set; }

        public EmailMessage(IEnumerable<string> to, string subject, string content, IFormFileCollection attachements)
        {
            To = new List<MailboxAddress>();
            To.AddRange(to.Select(x => new MailboxAddress(null, x)));
            Subject = subject;
            Content = content;
            Attachments = attachements;
        }
    }
}
