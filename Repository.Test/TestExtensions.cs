using Common;

namespace Repository.Test
{
    public static class TestExtensions
    {
        public static List<string> croatianFirstNames = new List<string>
        {
            "Marko", "Ivan", "Luka", "Petar", "Ana", "Marija", "Ivana", "Mia", "Sara", "Nikola",
            "Josip", "Filip", "Dario", "Matej", "Katarina", "Lucija", "Tihana", "Lea", "Ema", "Gabrijel"
        };

        public static List<string> croatianLastNames = new List<string>
        {
            "Horvat", "Kovačić", "Babić", "Jurić", "Vuković", "Matić", "Novak", "Petrović", "Perić", "Radić",
            "Tomić", "Vidović", "Šimić", "Mlinarić", "Pavlović", "Đurić", "Knežević", "Krstić", "Varga", "Bogdanović"
        };

        public static List<string> gradeDivisions = new List<string> { "a", "b", "c", "d" };


        public static List<Models.StudentComplex> InsertStudents(this DomRepository repository, int count)
        {
            var random = new Random();
            var subjects = repository.Models.Subject.Query().ToList();
            var educationLocations = repository.Models.EducationLocation.Query().ToList();
            var educationTypes = repository.Models.EducationType.Query().ToList();
            var disabilitySubtypes = repository.Models.DisabilitySubtype.Query().ToList();

            var students = new List<Models.StudentComplex>();
            for (int i = 0; i < count; i++)
            {
                var studentId = Guid.NewGuid();

                var student = new Models.StudentComplex
                {
                    ID = studentId,
                    Active = true,
                    Grade = random.Next(1, 9),
                    GradeDivision = gradeDivisions[random.Next(gradeDivisions.Count)],
                    Oib = GenerateRandomOIB(random),
                    DateOfBirth = DateTime.Now.AddYears(-random.Next(6, 15)),
                    EducationLocationID = educationLocations[random.Next(educationLocations.Count)].ID,
                    EducationTypeID = educationTypes[random.Next(educationTypes.Count)].ID,
                    FirstName = croatianFirstNames[random.Next(croatianFirstNames.Count)],
                    LastName = croatianLastNames[random.Next(croatianLastNames.Count)],
                    Subjects = new List<Models.StudentSubjectsComplex>(),
                    DisabilitySubtypes = new List<Models.StudentDisabilitySubtypesComplex>()
                };

                var shuffled = subjects.OrderBy(_ => random.Next()).ToList();
                int subjectCount = random.Next(3, 7);
                for (int j = 0; j < subjectCount; j++)
                {
                    student.Subjects.Add(new Models.StudentSubjectsComplex
                    {
                        StudentID = studentId,
                        SubjectID = shuffled[j].ID
                    });
                }

                var shuffledDisabilities = disabilitySubtypes.OrderBy(_ => random.Next()).ToList();
                int disabilityCount = random.Next(1, 5);
                for (int k = 0; k < disabilityCount; k++)
                {
                    student.DisabilitySubtypes.Add(new Models.StudentDisabilitySubtypesComplex
                    {
                        StudentID = studentId,
                        DisabilitySubtypeID = shuffledDisabilities[k].ID
                    });
                }

                repository.Models.StudentComplexSave.Execute(new Models.StudentComplexSave { Item = student });
            }
            return students;
        }

        public static List<Models.ProfessorComplex> InsertProfessors(this DomRepository repository, int count)
        {
            var random = new Random();
            var subjects = repository.Models.Subject.Query().ToList();
            var professors = new List<Models.ProfessorComplex>();
            for (int i = 0; i < count; i++)
            {
                var professorId = Guid.NewGuid();

                var professor = new Models.ProfessorComplex
                {
                    ID = professorId,
                    Active = true,
                    FirstName = croatianFirstNames[random.Next(croatianFirstNames.Count)],
                    LastName = croatianLastNames[random.Next(croatianLastNames.Count)],
                    Subjects = new List<Models.ProfessorSubjectsComplex>(),
                };

                var shuffled = subjects.OrderBy(_ => random.Next()).ToList();
                int subjectCount = random.Next(3, 7);
                for (int j = 0; j < subjectCount; j++)
                {
                    professor.Subjects.Add(new Models.ProfessorSubjectsComplex
                    {
                        ProfessorID = professorId,
                        SubjectID = shuffled[j].ID
                    });
                }

                repository.Models.ProfessorComplexSave.Execute(new Models.ProfessorComplexSave { Item = professor });
            }
            return professors;
        }

        public static string GenerateRandomOIB(Random random)
        {
            return random.Next(100000, 999999).ToString() + random.Next(10000, 99999).ToString();
        }
    }
}
