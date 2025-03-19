using Rhetos;

namespace Repository.Server
{
    [Options("EmailConfiguration")]
    public class EmailConfiguration : IEmailConfiguration
    {
        public string From { get; set; }
        public string SmtpServer { get; set; }
        public int Port { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
    }
}
