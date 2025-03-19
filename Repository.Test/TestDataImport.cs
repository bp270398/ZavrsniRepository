using Rhetos.Dom.DefaultConcepts;
using Rhetos.Utilities;

namespace Repository.Test
{
    [TestClass]
    public sealed class TestDataImport
    {
        [TestMethod]
        public void InitialDocumentTemplateImport()
        {
            string ioopIpTemplatePath = Path.GetFullPath(@"..\..\..\..\..\Repository\Repository.Server\Assets\Templates\IOOP_IP.docx");
            string ioopPpTemplatePath = Path.GetFullPath(@"..\..\..\..\..\Repository\Repository.Server\Assets\Templates\IOOP_PP.docx");
            string izjavaTemplatePath = Path.GetFullPath(@"..\..\..\..\..\Repository\Repository.Server\Assets\Templates\IZJAVA_roditelja.docx");

            using (var scope = TestScope.Create(builder => builder.ConfigureApplicationUser("admin")))
            {
                var context = scope.Resolve<Common.ExecutionContext>();
                var repository = scope.Resolve<Common.DomRepository>();

                var ioopIpTemplate = new DocumentProcessing.DocumentTemplate
                {
                    ID = new Guid("D4F4F707-8A75-487D-B237-D065EE4C1DA6"),
                    DocumentType = "IOOP IP obrazac",
                    CreatedDate = DateTime.Now,
                    Active = true,
                };
                var ioopPpTemplate = new DocumentProcessing.DocumentTemplate
                {
                    ID = new Guid("DB1F9BEB-C667-4BBB-B9AA-0067550A3F48"),
                    DocumentType = "IOOP PP obrazac",
                    CreatedDate = DateTime.Now,
                    Active = true,
                };
                var izjavaTemplate = new DocumentProcessing.DocumentTemplate
                {
                    ID = new Guid("8C8F1986-31F9-49AB-B8A8-46E44099EF31"),
                    DocumentType = "Izjava roditelja",
                    CreatedDate = DateTime.Now,
                    Active = true,
                };
                var ioopIpTemplateContent = new DocumentProcessing.DocumentTemplateContent
                {
                    ID = Guid.NewGuid(),
                    DocumentTemplateID = ioopIpTemplate.ID,
                    Content = File.ReadAllBytes(ioopIpTemplatePath),
                    FileExtension = ".docx",
                    CreatedDate = DateTime.Now
                };
                var ioopPpTemplateContent = new DocumentProcessing.DocumentTemplateContent
                {
                    ID = Guid.NewGuid(),
                    DocumentTemplateID = ioopPpTemplate.ID,
                    Content = File.ReadAllBytes(ioopPpTemplatePath),
                    FileExtension = ".docx",
                    CreatedDate = DateTime.Now
                };
                var izjavaTemplateContent = new DocumentProcessing.DocumentTemplateContent
                {
                    ID = Guid.NewGuid(),
                    DocumentTemplateID = izjavaTemplate.ID,
                    Content = File.ReadAllBytes(izjavaTemplatePath),
                    FileExtension = ".docx",
                    CreatedDate = DateTime.Now
                };

                var documentTemplatesToInsert = new List<DocumentProcessing.DocumentTemplate>();
                var documentTemplateContentsToInsert = new List<DocumentProcessing.DocumentTemplateContent>();

                if (!repository.DocumentProcessing.DocumentTemplate.Query().Where(x => x.ID == ioopIpTemplate.ID).Any())
                {
                    documentTemplatesToInsert.Add(ioopIpTemplate);
                    documentTemplateContentsToInsert.Add(ioopIpTemplateContent);
                }
                if (!repository.DocumentProcessing.DocumentTemplate.Query().Where(x => x.ID == ioopPpTemplate.ID).Any())
                {
                    documentTemplatesToInsert.Add(ioopPpTemplate);
                    documentTemplateContentsToInsert.Add(ioopPpTemplateContent);
                }
                if (!repository.DocumentProcessing.DocumentTemplate.Query().Where(x => x.ID == izjavaTemplate.ID).Any())
                {
                    documentTemplatesToInsert.Add(izjavaTemplate);
                    documentTemplateContentsToInsert.Add(izjavaTemplateContent);
                }

                if (documentTemplatesToInsert != null && documentTemplatesToInsert.Count != 0)
                    repository.DocumentProcessing.DocumentTemplate.Insert(documentTemplatesToInsert);
                if (documentTemplateContentsToInsert != null && documentTemplateContentsToInsert.Count != 0)
                    repository.DocumentProcessing.DocumentTemplateContent.Insert(documentTemplateContentsToInsert);

                scope.CommitAndClose();
            }
        }

        [TestMethod]
        public void TestStudentsAndProfessorsImport()
        {
            using (var scope = TestScope.Create(builder => builder
                .ConfigureApplicationUser("admin")))
            {

                var context = scope.Resolve<Common.ExecutionContext>();
                var repository = scope.Resolve<Common.DomRepository>();
                var sqlExecuter = scope.Resolve<ISqlExecuter>();

                TestExtensions.InsertStudents(repository, 40);
                TestExtensions.InsertProfessors(repository, 40);

                scope.CommitAndClose();
            }
        }
    }
}
