using DocumentProcessing;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Rhetos;
using Rhetos.AspNetFormsAuth;
using Rhetos.Dom.DefaultConcepts;
using Rhetos.Host.AspNet.RestApi.Filters;
using Xceed.Document.NET;
using Xceed.Words.NET;
using Claim = Rhetos.Security.Claim;

namespace Repository.Server.Controllers
{
    [ApiController]
    [Route("rest/[controller]")]
    [ServiceFilter(typeof(ApiExceptionFilter))]
    [ServiceFilter(typeof(ApiCommitOnSuccessFilter))]
    public class DocumentProcessingController : Controller
    {
        private readonly Common.ExecutionContext _executionContext;
        private readonly AuthenticationService _authenticationService;
        private readonly UserManager<IdentityUser<Guid>> _userManager;
        public DocumentProcessingController(IRhetosComponent<Common.ExecutionContext> executionContext)
        {
            _executionContext = executionContext.Value;
        }

        /*
        
        CustomClaim "DocumentProcessing.UploadDocumentTemplate" "Execute";
        CustomClaim "DocumentProcessing.DownloadDocumentTemplateContent" "Execute";
        CustomClaim "DocumentProcessing.UploadDocument" "Execute";
        CustomClaim "DocumentProcessing.DownloadDocumentContent" "Execute";
        CustomClaim "DocumentProcessing.GenerateDocument" "Execute";

        */

        [HttpPost("UploadDocumentTemplate")]
        public IActionResult UploadDocumentTemplate(IFormFile file, [FromQuery] Guid documentTemplateId, [FromQuery] string fileName)
        {
            // TODO check if user auth-ed
            if (!_executionContext.Repository.DocumentProcessing.DocumentTemplate.Query().Where(x => x.ID == documentTemplateId).Any())
                return BadRequest(new UserException($"There is no DocumentProcessing.DocumentTemplate with ID '{documentTemplateId}'"));

            byte[] fileBytes;

            if (file.Length > 0)
            {
                using (var ms = new MemoryStream())
                {
                    file.CopyTo(ms);
                    fileBytes = ms.ToArray();

                    _executionContext.Repository.DocumentProcessing.DocumentTemplateContent.Insert(new DocumentTemplateContent
                    {
                        DocumentTemplateID = documentTemplateId,
                        Content = fileBytes,
                        FileExtension = System.IO.Path.GetExtension(file.FileName)
                    });
                }
            }
            return Ok();
        }

        [HttpGet("DownloadDocumentTemplateContent")]
        public IActionResult DownloadDocumentTemplateContent([FromQuery] Guid documentTemplateContentId)
        {
            // TODO check if user auth-ed
            var content = _executionContext.Repository.DocumentProcessing.DocumentTemplateContent.Query().Where(x => x.ID == documentTemplateContentId).ToSimple().FirstOrDefault();

            if (content == null)
                return BadRequest(new UserException($"There is no DocumentProcessing.DocumentTemplateContent with ID '{documentTemplateContentId}'"));

            var template = _executionContext.Repository.DocumentProcessing.DocumentTemplate.Query().Where(x => x.ID == content.DocumentTemplateID).ToSimple().FirstOrDefault();

            return File(new MemoryStream(content.Content), "application/octet-stream", $"{template.DocumentType}{content.FileExtension}");
        }

        [HttpPost("UploadDocument")]
        public void UploadDocument(IFormFile file, [FromQuery] Guid documentId, [FromQuery] string fileName)
        {
            // TODO check if user auth-ed

            //_userManager.claim
            var hasPermissionToExecute = _executionContext.AuthorizationManager.GetAuthorizations(new List<Claim>() { new Claim("DocumentProcessing.DocumentContent", "New") });
            if (!hasPermissionToExecute.FirstOrDefault())
                throw new UserException($"You are not authorized for action 'New' on resource 'DocumentProcessing.DocumentContent', user '{this._executionContext.UserInfo.UserName}'");

            var documentQuery = _executionContext.Repository.DocumentProcessing.Document.Query().Where(x => x.ID == documentId);
            if (!documentQuery.Any())
                throw new UserException($"There is no DocumentProcessing.Document with ID '{documentId}'");

            var user = _executionContext.Repository.Common.Principal.Query().Where(x => x.Name.Equals(_executionContext.UserInfo.UserName)).ToSimple().FirstOrDefault();
            if (user == null || documentQuery.Select(x => x.CreatedByID).FirstOrDefault() != user.ID)
                throw new UserException($"Niste ovlašteni za izmijene nad dokumentima koje niste kreirali.");


            byte[] fileBytes;

            if (file.Length > 0)
            {
                using (var ms = new MemoryStream())
                {
                    file.CopyTo(ms);
                    fileBytes = ms.ToArray();

                    _executionContext.Repository.DocumentProcessing.DocumentContent.Insert(new DocumentContent
                    {
                        DocumentID = documentId,
                        Content = fileBytes,
                        FileExtension = System.IO.Path.GetExtension(file.FileName)
                    });
                }
            }
        }

        [HttpGet("DownloadDocumentContent")]
        public IActionResult DownloadDocumentContent([FromQuery] Guid documentContentId)
        {
            var content = _executionContext.Repository.DocumentProcessing.DocumentContent.Query().Where(x => x.ID == documentContentId).ToSimple().FirstOrDefault();
            if (content == null)
                return BadRequest(new UserException($"There is no DocumentProcessing.DocumentContent with ID '{documentContentId}'"));

            return File(new MemoryStream(content.Content), "application/octet-stream", $"{content.DocumentID}{content.FileExtension}");
        }

        [HttpGet("GenerateDocument")]
        public IActionResult GenerateDocument([FromQuery] Guid documentId)
        {

            // TODO check if user auth-ed
            var a = this._executionContext.AuthorizationManager.GetAuthorizations(new List<Claim> { new Claim("DocumentProcessing.GenerateDocument", "Execute") });
            if (documentId == null)
                return BadRequest(new UserException("documentId je obavezan parametar."));

            _executionContext.Repository.DocumentProcessing.RemapContentControlInfos.Execute(new RemapContentControlInfos { DocumentID = documentId });

            var doc = _executionContext.Repository.DocumentProcessing.DocumentComplexGet.Execute(new DocumentComplexGet { ID = documentId });

            if (doc == null)
                return BadRequest(new UserException($"There is no DocumentProcessing.Document with ID '{documentId}'"));

            var template = _executionContext.Repository.DocumentProcessing.DocumentTemplateComplexGet.Execute(new DocumentTemplateComplexGet { ID = doc.DocumentTemplateID });

            if (template == null)
                throw new UserException($"There is no DocumentProcessing.DocumentTemplate with ID '{doc.DocumentTemplateID}'.");

            if (template.CurrentContent == null)
                throw new UserException("Selected template has no content uploaded.");


            var tempFileName = Guid.NewGuid().ToString() + template.CurrentContent.FileExtension;
            var tempFilePath = Path.Combine(Directory.GetCurrentDirectory(), tempFileName);

            System.IO.File.WriteAllBytes(tempFilePath, template.CurrentContent.Content);

            try
            {
                using (DocX document = DocX.Load(tempFilePath))
                {
                    foreach (var entry in doc.ContentControlInfos)
                    {
                        document.ReplaceText(new StringReplaceTextOptions
                        {
                            SearchValue = $"[{{{entry.Tag}}}]",
                            NewValue = entry.Value ?? string.Empty
                        });
                    }
                    document.Save();
                }

                var file = File(new MemoryStream(System.IO.File.ReadAllBytes(tempFilePath)), "application/octet-stream", $"{template.DocumentType}{template.CurrentContent.FileExtension}");
                return file;
            }
            finally
            {
                if (System.IO.File.Exists(tempFilePath))
                {
                    System.IO.File.Delete(tempFilePath);
                }
            }
        }
    }
}
