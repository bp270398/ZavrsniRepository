using System.Text.Json;
using Autofac;

namespace Repository.Test.Tests
{
    [TestClass]
    public sealed class DocumentsServiceTest
    {

        [TestMethod]
        public void NewIoopIpReport()
        {
            using (var scope = TestScope.Create(builder => builder
                .ConfigureApplicationUser("admin")))
            {

                var context = scope.Resolve<Common.ExecutionContext>();
                var repository = scope.Resolve<Common.DomRepository>();
                var admin = repository.Common.Principal.Query().Where(x => x.Name.Equals("admin")).ToSimple().FirstOrDefault();

                var educationLocation = repository.Models.EducationLocation.Query().Where(x => x.Active.Value).ToSimple().FirstOrDefault();
                var educationType = repository.Models.EducationType.Query().Where(x => x.Active.Value).ToSimple().FirstOrDefault();
                var subject = repository.Models.Subject.Query().Where(x => x.Active.Value).ToSimple().FirstOrDefault();

                var student = new Models.StudentComplex
                {
                    ID = Guid.NewGuid(),
                    FirstName = "Testinjo",
                    LastName = "Test",
                    Oib = "12345678900",
                    DateOfBirth = new DateTime(2000, 1, 1),
                    Grade = 2,
                    GradeDivision = "a",
                    EducationLocationID = educationLocation?.ID,
                    EducationTypeID = educationType?.ID,
                    Subjects = new List<Models.StudentSubjectsComplex> { new Models.StudentSubjectsComplex { SubjectID = subject?.ID } },
                    DisabilitySubtypes = new List<Models.StudentDisabilitySubtypesComplex>()
                };

                repository.Models.StudentComplexSave.Execute(new Models.StudentComplexSave { Item = student });

                var ioopIp = new DocumentProcessing.Document
                {
                    ID = Guid.NewGuid(),
                    DocumentTemplateID = new Guid("D4F4F707-8A75-487D-B237-D065EE4C1DA6"),
                    StudentID = student.ID,
                    SubjectID = subject?.ID,
                    CreatedByID = admin?.ID

                };
                repository.DocumentProcessing.Document.Save([ioopIp], null, null);

                var doc = repository.DocumentProcessing.DocumentComplexGet.Execute(new DocumentProcessing.DocumentComplexGet { ID = ioopIp.ID });
                Console.Write(JsonSerializer.Serialize(doc));
            }
        }

        [TestMethod]
        public void NewIoopPpReport()
        {
            using (var scope = TestScope.Create(builder => builder
                .ConfigureApplicationUser("admin")))
            {

                var context = scope.Resolve<Common.ExecutionContext>();
                var repository = scope.Resolve<Common.DomRepository>();
                var admin = repository.Common.Principal.Query().Where(x => x.Name.Equals("admin")).ToSimple().FirstOrDefault();

                var educationLocation = repository.Models.EducationLocation.Query().Where(x => x.Active.Value).ToSimple().FirstOrDefault();
                var educationType = repository.Models.EducationType.Query().Where(x => x.Active.Value).ToSimple().FirstOrDefault();
                var subject = repository.Models.Subject.Query().Where(x => x.Active.Value).ToSimple().FirstOrDefault();

                var student = new Models.StudentComplex
                {
                    ID = Guid.NewGuid(),
                    FirstName = "Testinjo",
                    LastName = "Test",
                    Oib = "12345678900",
                    DateOfBirth = new DateTime(2000, 1, 1),
                    Grade = 2,
                    GradeDivision = "a",
                    EducationLocationID = educationLocation?.ID,
                    EducationTypeID = educationType?.ID,
                    Subjects = new List<Models.StudentSubjectsComplex> { new Models.StudentSubjectsComplex { SubjectID = subject?.ID } },
                    DisabilitySubtypes = new List<Models.StudentDisabilitySubtypesComplex>()
                };

                repository.Models.StudentComplexSave.Execute(new Models.StudentComplexSave { Item = student });

                var ioopIp = new DocumentProcessing.Document
                {
                    ID = Guid.NewGuid(),
                    DocumentTemplateID = new Guid("D4F4F707-8A75-487D-B237-D065EE4C1DA6"),
                    StudentID = student.ID,
                    SubjectID = subject?.ID,
                    CreatedByID = admin?.ID

                };
                repository.DocumentProcessing.Document.Save([ioopIp], null, null);

                var doc = repository.DocumentProcessing.DocumentComplexGet.Execute(new DocumentProcessing.DocumentComplexGet { ID = ioopIp.ID });
                Console.Write(JsonSerializer.Serialize(doc));
            }
        }

        [TestMethod]
        public void NewParentStatement()
        {
            using (var scope = TestScope.Create(builder => builder
                .ConfigureApplicationUser("admin")))
            {

                var context = scope.Resolve<Common.ExecutionContext>();
                var repository = scope.Resolve<Common.DomRepository>();
                var admin = repository.Common.Principal.Query().Where(x => x.Name.Equals("admin")).ToSimple().FirstOrDefault();

                var educationLocation = repository.Models.EducationLocation.Query().Where(x => x.Active.HasValue && x.Active.Value || x.Active.HasValue == false).ToSimple().FirstOrDefault();
                var educationType = repository.Models.EducationType.Query().Where(x => x.Active.Value).ToSimple().FirstOrDefault();
                var subject = repository.Models.Subject.Query().Where(x => x.Active.Value).ToSimple().FirstOrDefault();

                var student = new Models.StudentComplex
                {
                    ID = Guid.NewGuid(),
                    FirstName = "Testinjo",
                    LastName = "Test",
                    Oib = "12345678900",
                    DateOfBirth = new DateTime(2000, 1, 1),
                    Grade = 2,
                    GradeDivision = "a",
                    EducationLocationID = educationLocation?.ID,
                    EducationTypeID = educationType?.ID,
                    Subjects = new List<Models.StudentSubjectsComplex> { new Models.StudentSubjectsComplex { SubjectID = subject?.ID } },
                    DisabilitySubtypes = new List<Models.StudentDisabilitySubtypesComplex>()
                };

                repository.Models.StudentComplexSave.Execute(new Models.StudentComplexSave { Item = student });

                var ioopIp = new DocumentProcessing.Document
                {
                    ID = Guid.NewGuid(),
                    DocumentTemplateID = new Guid("D4F4F707-8A75-487D-B237-D065EE4C1DA6"),
                    StudentID = student.ID,
                    SubjectID = subject?.ID,
                    CreatedByID = admin?.ID

                };
                repository.DocumentProcessing.Document.Save([ioopIp], null, null);

                var doc = repository.DocumentProcessing.DocumentComplexGet.Execute(new DocumentProcessing.DocumentComplexGet { ID = ioopIp.ID });
                Console.Write(JsonSerializer.Serialize(doc));
            }
        }
    }
}
