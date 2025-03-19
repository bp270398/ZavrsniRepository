using System.Data;
using System.Text;
using Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Rhetos;
using Rhetos.AspNetFormsAuth;
using Rhetos.Host.AspNet.RestApi.Filters;
using Rhetos.Utilities;

namespace Repository.Server.Controllers
{
    [ApiController]
    [Route("rest/[controller]")]
    [ServiceFilter(typeof(ApiExceptionFilter))]
    [ServiceFilter(typeof(ApiCommitOnSuccessFilter))]
    public class AuthController : Controller
    {
        private readonly Common.ExecutionContext _executionContext;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly UserManager<IdentityUser<Guid>> _userManager;
        private readonly IEmailService _emailService;
        private readonly AuthenticationService _authenticationService;

        public AuthController(
             IRhetosComponent<Common.ExecutionContext> executionContext,
             AuthenticationService authenticationService,
             UserManager<IdentityUser<Guid>> professorManager,
             IRhetosComponent<IEmailService> emailService,
             IHttpContextAccessor httpContextAccessor)
        {
            _executionContext = executionContext.Value;
            _httpContextAccessor = httpContextAccessor;
            _emailService = emailService.Value;
            _userManager = professorManager;
            _authenticationService = authenticationService;
        }


        [AllowAnonymous, HttpPost("SendResetPasswordEmail")]
        public async Task<IActionResult> SendResetPasswordEmail(string Email)
        {
            if (string.IsNullOrWhiteSpace(Email)) throw new UserException("There is no Email provided.");

            var email = Email.Trim().ToLower();

            string userName = "";
            int aspNetUserId = 0;

            _executionContext.SqlExecuter.ExecuteReaderRaw($"SELECT Name, AspNetUserId FROM Common.Principal WHERE Email = '{email}'", null,
            reader =>
            {
                userName = reader.IsDBNull(0) ? "" : reader.GetString(0);
                aspNetUserId = reader.IsDBNull(1) ? 0 : reader.GetInt32(1);
            });

            if (String.IsNullOrEmpty(userName) || aspNetUserId == 0) throw new UserException($"There is no Common.Principal with Email '{email}'");

            string token = Guid.NewGuid().ToString();

            _executionContext.SqlExecuter.ExecuteSqlInterpolated($"UPDATE dbo.webpages_Membership SET PasswordVerificationToken = CAST({token} AS NVARCHAR(128)), PasswordVerificationTokenExpirationDate = DATEADD(MINUTE, 15, CURRENT_TIMESTAMP), IsConfirmed = 1 WHERE UserId = {aspNetUserId}");

            string resetPasswordLink = $"https://localhost:49265/postavljanje-lozinke?id={token}";

            StringBuilder sb = new StringBuilder();
            sb.Append("<div class='container'><h2>Resetiraj ili postavi lozinku za pristup svom računu</h2>");
            sb.Append($"<p>klikom na <a href='{resetPasswordLink}'>ovu poveznicu</a>.</p></div>");

            string confirmationEmailHtml = sb.ToString();
            try
            {
                await _emailService.SendEmailAsync(
                  new EmailMessage(
                      new List<string> { email },
                      "Resetiranje lozinke",
                      confirmationEmailHtml,
                      null
                  )
              );
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
            return Ok();
        }

        [AllowAnonymous, HttpGet("VerifyToken")]
        public IActionResult VerifyToken([FromQuery] string Token)
        {
            DateTime undef = DateTime.Now.AddYears(-100);
            DateTime passwordVerificationTokenExpirationDate = new DateTime(undef.Ticks);

            var sqlQuery = $"SELECT TOP 1 PasswordVerificationTokenExpirationDate FROM dbo.webpages_Membership WHERE PasswordVerificationToken = '{Token}' AND PasswordVerificationTokenExpirationDate > CURRENT_TIMESTAMP";
            _executionContext.SqlExecuter.ExecuteReaderRaw(sqlQuery, null, reader => passwordVerificationTokenExpirationDate = reader.IsDBNull(0) ? passwordVerificationTokenExpirationDate : reader.GetDateTime(0));

            return Ok(passwordVerificationTokenExpirationDate == undef ? null : passwordVerificationTokenExpirationDate);
        }

        [AllowAnonymous, HttpPost("ResetPassword")]
        public async Task<IActionResult> ResetPassword(string Token, string Password)
        {

            var pwd = Password.Trim().ToLower();

            if (string.IsNullOrEmpty(Token)) throw new UserException($"There is no Token provided");

            if (string.IsNullOrEmpty(pwd)) throw new UserException($"There is no Password provided");

            var professorId = 0;

            var sqlQuery = $"SELECT UserId FROM dbo.webpages_Membership WHERE PasswordVerificationToken = '{Token}'";
            _executionContext.SqlExecuter.ExecuteReaderRaw(sqlQuery, null, reader => professorId = reader.IsDBNull(0) ? 0 : reader.GetInt32(0));

            if (professorId == 0)
                throw new UserException("User not found.");

            var principal = _executionContext.Repository.Common.Principal.Query().Where(x => x.AspNetUserId == professorId).ToSimple().FirstOrDefault();

            if (principal == null) throw new UserException($"There is no user with the provided token.");

            var professor = await _userManager.FindByNameAsync(principal.Name);
            if (professor == null)
                throw new UserException("User not found.");

            var token = await _userManager.GeneratePasswordResetTokenAsync(professor);

            var changedPasswordResults = _userManager.ResetPasswordAsync(professor, token, pwd).Result;

            if (!changedPasswordResults.Succeeded)
                throw new UserException($"Cannot change password. ResetPassword failed with errors: {string.Join(Environment.NewLine, changedPasswordResults.Errors.Select(x => x.Description))}.");

            return Ok();
        }
    }

    public class UpsertPrincipalRequest
    {
        public Principal Principal;
        public List<PrincipalHasRole> PrincipalHasRoles;
    }
}
