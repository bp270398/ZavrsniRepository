using System.Globalization;
using System.Text.RegularExpressions;
using Common;
using Rhetos;
using Rhetos.Dom.DefaultConcepts;
using Rhetos.Utilities;
using Xceed.Words.NET;

namespace DocumentProcessing.Repositories
{
    public partial class GetContentControlInfos_Repository
    {
        public GetContentControlInfosResponse GetContentControlInfos(GetContentControlInfos parameter, DomRepository repository, IUserInfo userInfo)
        {
            var repo = _executionContext.Repository;
            if (parameter.DocumentID == null)
                throw new UserException("DocumentID je obavezan parametar.");

            var tags = new List<DocumentProcessing.ContentControlInfo>();
            var doc = repo.DocumentProcessing.Document.Query().Where(x => x.ID == parameter.DocumentID).FirstOrDefault();
            var template = repo.DocumentProcessing.DocumentTemplateComplexGet.Execute(new DocumentTemplateComplexGet { ID = doc.DocumentTemplateID });

            if (template == null)
                throw new UserException($"Ne postoji predložak sa ID-em '{doc.DocumentTemplateID}'.");

            if (template.CurrentContent == null)
                throw new UserException("Odabrani predložak nema dodan sadržaj.");

            var tempFileName = Guid.NewGuid().ToString() + template.CurrentContent.FileExtension;
            var tempFilePath = Path.Combine(Directory.GetCurrentDirectory(), tempFileName);

            File.WriteAllBytes(tempFilePath, template.CurrentContent.Content);

            using (DocX document = DocX.Load(tempFilePath))
            {
                foreach (Match match in new Regex(@"\[\{(.*?)\}\]").Matches(document.Text))
                {
                    var tag = match.Groups[1].Value;
                    if (!tags.Any(x => x.Tag.Equals(tag)))
                    {
                        var v = repository.DocumentProcessing.MapContentControlInfo.Execute(new DocumentProcessing.MapContentControlInfo { DocumentID = doc.ID, Tag = tag });
                        tags.Add(v);
                    }
                }

                File.Delete(tempFilePath);
            };

            return new GetContentControlInfosResponse
            {
                Items = tags,
            };
        }
    }

    public partial class MapContentControlInfo_Repository
    {
        public ContentControlInfo MapContentControlInfo(MapContentControlInfo parameter, DomRepository repository, IUserInfo userInfo)
        {
            if (parameter.DocumentID == null)
                throw new Rhetos.UserException("DocumentID je obavezan parametar.");

            if (parameter.Tag == null)
                throw new UserException("Tag je obavezan parametar.");

            var repo = _executionContext.Repository;
            var result = new DocumentProcessing.ContentControlInfo() { Tag = parameter.Tag, DocumentID = parameter.DocumentID };
            var doc = repo.DocumentProcessing.DocumentComplexGet.Execute(new DocumentComplexGet { ID = parameter.DocumentID });
            var c = doc.ContentControlInfos.Where(x => x.Tag.Equals(parameter.Tag)).Select(c => c.ConvertTo<ContentControlInfo>()).FirstOrDefault();
            if (c != null)
                result = c;


            switch (parameter.Tag)
            {
                case "SkolskaGodina":
                    result.Title = "Školska godina";
                    break;
                case "Predmet":
                    result.Title = "Nastavni predmet";
                    if (doc.Subject != null)
                        result.Value = doc.Subject.Title;
                    result.IsMapped = true;
                    result.IsReadonly = true;
                    result.MappedFromProperty = "SubjectID";
                    break;
                case "PocetakITrajanjePrograma":
                    result.Title = "Početak i trajanje primjene programa";
                    break;
                case "ImePrezimeUcenika":
                    result.Title = "Ime i prezime učenika";
                    result.Value = $"{doc.Student.FirstName} {doc.Student.LastName}";
                    result.IsMapped = true;
                    result.IsReadonly = true;
                    result.MappedFromProperty = "StudentID";
                    result.FieldGroup = "Student";
                    break;
                case "ImePrezimeUcitelja":
                    result.Title = "Ime i prezime učitelja";
                    result.Value = $"{doc.Professor.FirstName} {doc.Professor.LastName}";
                    result.IsMapped = true;
                    result.IsReadonly = true;
                    result.MappedFromProperty = "CreatedByID";
                    break;
                case "DatumRodenjaUcenika":
                    result.Title = "Datum rođenja učenika";
                    result.Value = doc.Student.DateOfBirth.Value.ToString("d", new CultureInfo("hr-HR"));
                    result.IsMapped = true;
                    result.IsReadonly = true;
                    result.MappedFromProperty = "StudentID";
                    result.FieldGroup = "Student";
                    break;
                case "StrucniSuradnik":
                    result.Title = "Stručni suradnik";
                    break;
                case "RazredUcenika":
                    result.Title = "Razred";
                    result.Value = $"{doc.Student.Grade}.{doc.Student.GradeDivision}";
                    result.IsMapped = true;
                    result.IsReadonly = true;
                    result.MappedFromProperty = "StudentID";
                    result.FieldGroup = "Student";
                    break;
                case "BrojUcenikaURazredu":
                    result.Title = "Broj učenika u razredu";
                    break;
                case "Integracija":
                    result.Title = "Sati/dani učenika po tjednu u nastavi (integracija)";
                    break;
                case "OsobaKojaSudjelujeIUloga":
                    result.Title = "Ime i prezime druge osobe koja stalno/povremeno sudjeluje i uloga)";
                    break;
                case "InicijalnaProcjena":
                    result.Title = "INICIJALNA PROCJENA (navesti specifičnosti učenikove utvrđene teškoće, njegovih kompetencija, interesa, predznanja i njegove utvrđene potrebe: odgojne, obrazovne, socioemocionalne; navesti jake i slabe strane učenika/ice.)";
                    result.IsLongString = true;
                    break;
                case "GodisnjiCiljeviIZadaci":
                    result.Title = "GODIŠNJI CILJEVI I ZADACI RADA S UČENIKOM (kratkoročni i dugoročni)";
                    result.IsLongString = true;
                    break;
                case "MetodeIndividualizacijePostupciPrilagodavanjaSredstvaIPomagala":
                    result.Title = "METODE INDIVIDUALIZACIJE, POSTUPCI PRILAGOĐAVANJA, SREDSTVA I POMAGALA";
                    result.IsLongString = true;
                    break;
                case "Napomena":
                    result.Title = "NAPOMENE (na što treba posebno obratiti pažnju, a nije prije spomenuto)";
                    result.IsLongString = true;
                    break;
                case "SadrzajEdukacijeRujan":
                    result.Title = "RUJAN: sadržaj edukacije (područja/teme/ključni pojmovi)";
                    result.IsLongString = true;
                    break;
                case "SadrzajEdukacijeListopad":
                    result.Title = "LISTOPAD: sadržaj edukacije (područja/teme/ključni pojmovi)";
                    result.IsLongString = true;
                    break;
                case "SadrzajEdukacijeStudeni":
                    result.Title = "STUDENI: sadržaj edukacije (područja/teme/ključni pojmovi)";
                    result.IsLongString = true;
                    break;
                case "SadrzajEdukacijeProsinac":
                    result.Title = "PROSINAC: sadržaj edukacije (područja/teme/ključni pojmovi)";
                    result.IsLongString = true;
                    break;
                case "SadrzajEdukacijeSijecanj":
                    result.Title = "SIJEČANJ: sadržaj edukacije (područja/teme/ključni pojmovi)";
                    result.IsLongString = true;
                    break;
                case "SadrzajEdukacijeVeljaca":
                    result.Title = "VELJAČA: sadržaj edukacije (područja/teme/ključni pojmovi)";
                    result.IsLongString = true;
                    break;
                case "SadrzajEdukacijeOzujak":
                    result.Title = "OŽUJAK: sadržaj edukacije (područja/teme/ključni pojmovi)";
                    result.IsLongString = true;
                    break;
                case "SadrzajEdukacijeTravanj":
                    result.Title = "TRAVANJ: sadržaj edukacije (područja/teme/ključni pojmovi)";
                    result.IsLongString = true;
                    break;
                case "SadrzajEdukacijeSvibanj":
                    result.Title = "SVIBANJ: sadržaj edukacije (područja/teme/ključni pojmovi)";
                    result.IsLongString = true;
                    break;
                case "SadrzajEdukacijeLipanj":
                    result.Title = "LIPANJ: sadržaj edukacije (područja/teme/ključni pojmovi)";
                    result.IsLongString = true;
                    break;
                case "CiljeviRujan":
                    result.Title = "RUJAN: ciljevi za učenika (očekivane razine usvojenosti odgojno-obrazovnih ishoda: „učenik će moći: …“)";
                    result.IsLongString = true;
                    break;
                case "CiljeviListopad":
                    result.Title = "LISTOPAD: ciljevi za učenika (očekivane razine usvojenosti odgojno-obrazovnih ishoda: „učenik će moći: …“)";
                    result.IsLongString = true;
                    break;
                case "CiljeviStudeni":
                    result.Title = "STUDENI: ciljevi za učenika (očekivane razine usvojenosti odgojno-obrazovnih ishoda: „učenik će moći: …“)";
                    result.IsLongString = true;
                    break;
                case "CiljeviProsinac":
                    result.Title = "PROSINAC: ciljevi za učenika (očekivane razine usvojenosti odgojno-obrazovnih ishoda: „učenik će moći: …“)";
                    result.IsLongString = true;
                    break;
                case "CiljeviSijecanj":
                    result.Title = "SIJEČANJ: ciljevi za učenika (očekivane razine usvojenosti odgojno-obrazovnih ishoda: „učenik će moći: …“)";
                    result.IsLongString = true;
                    break;
                case "CiljeviVeljaca":
                    result.Title = "VELJAČA: ciljevi za učenika (očekivane razine usvojenosti odgojno-obrazovnih ishoda: „učenik će moći: …“)";
                    result.IsLongString = true;
                    break;
                case "CiljeviOzujak":
                    result.Title = "OŽUJAK: ciljevi za učenika (očekivane razine usvojenosti odgojno-obrazovnih ishoda: „učenik će moći: …“)";
                    result.IsLongString = true;
                    break;
                case "CiljeviTravanj":
                    result.Title = "TRAVANJ: ciljevi za učenika (očekivane razine usvojenosti odgojno-obrazovnih ishoda: „učenik će moći: …“)";
                    result.IsLongString = true;
                    break;
                case "CiljeviSvibanj":
                    result.Title = "SVIBANJ: ciljevi za učenika (očekivane razine usvojenosti odgojno-obrazovnih ishoda: „učenik će moći: …“)";
                    result.IsLongString = true;
                    break;
                case "CiljeviLipanj":
                    result.Title = "LIPANJ: ciljevi za učenika (očekivane razine usvojenosti odgojno-obrazovnih ishoda: „učenik će moći: …“)";
                    result.IsLongString = true;
                    break;
                case "AktivnostiRujan":
                    result.Title = "RUJAN: aktivnosti";
                    result.IsLongString = true;
                    break;
                case "AktivnostiListopad":
                    result.Title = "LISTOPAD: aktivnosti";
                    result.IsLongString = true;
                    break;
                case "AktivnostiStudeni":
                    result.Title = "STUDENI: aktivnosti";
                    result.IsLongString = true;
                    break;
                case "AktivnostiProsinac":
                    result.Title = "PROSINAC: aktivnosti";
                    result.IsLongString = true;
                    break;
                case "AktivnostiSijecanj":
                    result.Title = "SIJEČANJ: aktivnosti";
                    result.IsLongString = true;
                    break;
                case "AktivnostiVeljaca":
                    result.Title = "VELJAČA: aktivnosti";
                    result.IsLongString = true;
                    break;
                case "AktivnostiOzujak":
                    result.Title = "OŽUJAK: aktivnosti";
                    result.IsLongString = true;
                    break;
                case "AktivnostiTravanj":
                    result.Title = "TRAVANJ: aktivnosti";
                    result.IsLongString = true;
                    break;
                case "AktivnostiSvibanj":
                    result.Title = "SVIBANJ: aktivnosti";
                    result.IsLongString = true;
                    break;
                case "AktivnostiLipanj":
                    result.Title = "LIPANJ: aktivnosti";
                    result.IsLongString = true;
                    break;
                case "StrategijePodrskeRujan":
                    result.Title = "RUJAN: strategije podrške (prilagodba metoda, sredstava, oblika, postupaka, zahtjeva)";
                    result.IsLongString = true;
                    break;
                case "StrategijePodrskeListopad":
                    result.Title = "LISTOPAD: strategije podrške (prilagodba metoda, sredstava, oblika, postupaka, zahtjeva)";
                    result.IsLongString = true;
                    break;
                case "StrategijePodrskeStudeni":
                    result.Title = "STUDENI: strategije podrške (prilagodba metoda, sredstava, oblika, postupaka, zahtjeva)";
                    result.IsLongString = true;
                    break;
                case "StrategijePodrskeProsinac":
                    result.Title = "PROSINAC: strategije podrške (prilagodba metoda, sredstava, oblika, postupaka, zahtjeva)";
                    result.IsLongString = true;
                    break;
                case "StrategijePodrskeSijecanj":
                    result.Title = "SIJEČANJ: strategije podrške (prilagodba metoda, sredstava, oblika, postupaka, zahtjeva)";
                    result.IsLongString = true;
                    break;
                case "StrategijePodrskeVeljaca":
                    result.Title = "VELJAČA: strategije podrške (prilagodba metoda, sredstava, oblika, postupaka, zahtjeva)";
                    result.IsLongString = true;
                    break;
                case "StrategijePodrskeOzujak":
                    result.Title = "OŽUJAK: strategije podrške (prilagodba metoda, sredstava, oblika, postupaka, zahtjeva)";
                    result.IsLongString = true;
                    break;
                case "StrategijePodrskeTravanj":
                    result.Title = "TRAVANJ: strategije podrške (prilagodba metoda, sredstava, oblika, postupaka, zahtjeva)";
                    result.IsLongString = true;
                    break;
                case "StrategijePodrskeSvibanj":
                    result.Title = "SVIBANJ: strategije podrške (prilagodba metoda, sredstava, oblika, postupaka, zahtjeva)";
                    result.IsLongString = true;
                    break;
                case "StrategijePodrskeLipanj":
                    result.Title = "LIPANJ: strategije podrške (prilagodba metoda, sredstava, oblika, postupaka, zahtjeva)";
                    result.IsLongString = true;
                    break;
                case "OstvareneZadaceRujan":
                    result.Title = "RUJAN: ostvarene zadaće";
                    result.IsLongString = true;
                    break;
                case "OstvareneZadaceListopad":
                    result.Title = "LISTOPAD: ostvarene zadaće";
                    result.IsLongString = true;
                    break;
                case "OstvareneZadaceStudeni":
                    result.Title = "STUDENI: ostvarene zadaće";
                    result.IsLongString = true;
                    break;
                case "OstvareneZadaceProsinac":
                    result.Title = "PROSINAC: ostvarene zadaće";
                    result.IsLongString = true;
                    break;
                case "OstvareneZadaceSijecanj":
                    result.Title = "SIJEČANJ: ostvarene zadaće";
                    result.IsLongString = true;
                    break;
                case "OstvareneZadaceVeljaca":
                    result.Title = "VELJAČA: ostvarene zadaće";
                    result.IsLongString = true;
                    break;
                case "OstvareneZadaceOzujak":
                    result.Title = "OŽUJAK: ostvarene zadaće";
                    result.IsLongString = true;
                    break;
                case "OstvareneZadaceTravanj":
                    result.Title = "TRAVANJ: ostvarene zadaće";
                    result.IsLongString = true;
                    break;
                case "OstvareneZadaceSvibanj":
                    result.Title = "SVIBANJ: ostvarene zadaće";
                    result.IsLongString = true;
                    break;
                case "OstvareneZadaceLipanj":
                    result.Title = "LIPANJ: ostvarene zadaće";
                    result.IsLongString = true;
                    break;

                default:
                    break;
            }


            return result;
        }
    }

    public partial class RemapContentControlInfos_Repository
    {
        public void RemapContentControlInfos(RemapContentControlInfos parameter, DomRepository repository, IUserInfo userInfo)
        {
            if (parameter.DocumentID == null)
                throw new UserException("DocumentID je obavezan parametar.");

            var repo = _executionContext.Repository;
            var tags = new List<DocumentProcessing.ContentControlInfo>();
            var doc = repo.DocumentProcessing.DocumentComplexGet.Execute(new DocumentComplexGet { ID = parameter.DocumentID });
            if (doc != null)
            {
                var mappedContentControls = doc.ContentControlInfos.Where(x => x.IsMapped == true).Select(x => x.ConvertTo<ContentControlInfo>());
                var contentControlsToUpdate = new List<DocumentProcessing.ContentControlInfo>();
                foreach (var c in mappedContentControls)
                {
                    var remapped = repo.DocumentProcessing.MapContentControlInfo.Execute(new MapContentControlInfo { DocumentID = c.DocumentID, Tag = c.Tag });
                    if (remapped != null && !c.Value.Equals(remapped.Value))
                    {
                        c.Value = remapped.Value;
                        contentControlsToUpdate.Add(c);
                    }
                }
                if (contentControlsToUpdate.Count > 0)
                    repo.DocumentProcessing.ContentControlInfo.Update(contentControlsToUpdate);
            }
        }
    }

}
