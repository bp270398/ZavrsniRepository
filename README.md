# Informacije o repozitoriju

## Sadržaj repozitorija

* __repository.client__ - Angular klijentska aplikacija
* __Repository.Server__ - .NET API
* __Repository.Playground__ - Konzolna aplikacija koja koristi _Repository.Server.dll_ za testiranje i/ili manipulaciju podacima
* __Repository.Test__ - Aplikacija za unit testiranje

## Preduvjeti za instalaciju

* instaliran [SQL server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
  * kreirana baza za aplikaciju nad kojom je izvršen sljedeći _query_:
    ```sql
    IF (SELECT is_read_committed_snapshot_on FROM sys.databases WHERE name = DB_NAME()) = 0
    BEGIN
        ALTER DATABASE CURRENT SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
        ALTER DATABASE CURRENT SET READ_COMMITTED_SNAPSHOT ON;
    END

    ALTER DATABASE CURRENT SET MULTI_USER;
    ```
* instaliran [.NET 6 SDK](https://dotnet.microsoft.com/download/dotnet/6.0)
* instaliran [Node.js](https://nodejs.org/en/download/package-manager)
* kreiran email račun ([upute](https://support.google.com/mail/answer/185833?hl=en))

## Upute za postavljanje

1. Otvoriti _solution_ (```~/Repository.sln```) u programu Visual Studio
2. Ažurirati konfiguracijske podatke u ```~/Repository.Server/appsettings.json```
3. _Rebuild_-ati _solution_ 
4. Postaviti projekt __Repository.Playground__ kao _StartUpProject_ i pokrenuti ga kako bi se postavila lozinka (_adminUserPassword_ u ```~/Repository.Playground/Program.cs```) na _default_ administratorskom računu 
    * _Username_: admin 
    * _Password_: test 
5. ( *Opcionalno* ) Za uvoz testnih podataka pokrenuti testove u datoteci ```~/Repository.Test/TestDataImport.cs```
   * _InitialDocumentTemplateImport_ učitava _default_ predloške dokumenata
   * _TestStudentsAndProfessorsImport_ učitava testne učenike i učitelje
6. Pokrenuti projekt __Repository.Server__
   * _Client_ - https://localhost:49265/ 
   * _Server_ - https://localhost:7298/swagger/index.html

#### Za konfiguraciju URL-ova potrebno je ažurirati sljedeće datoteke

* ```~/repository.client/src/environments/environment.ts``` (rhetosConfig.url)
* ```~/repository.client/src/proxy.conf.js``` (target)
* ```~/Repository.Server/Startup.cs``` (CORS)
* ```~/Repository.Server/Program.cs``` (start-up URL)
* ```~/Repository.Server/Repository.Server.csproj``` (SpaProxyServerUrl)
  
#### Za postavljanje SSL certifikata potrebno je ažurirati sljedeće datoteke

* ```~/repository.client/https/repository.client.key``` 
* ```~/repository.client/https/repository.client.pem```

## Dokumentacija vanjskih izvora

* [Rhetos](https://github.com/Rhetos/Rhetos/wiki)
  * [RestGenerator](https://github.com/Rhetos/RestGenerator)
  * [AspNetFormsAuth](https://github.com/Rhetos/AspNetFormsAuth)
  * [FloydExtensions](https://github.com/Rhetos/FloydExtensions)
  * [AfterDeploy](https://github.com/Rhetos/AfterDeploy)
  * [Data migration](https://github.com/Rhetos/Rhetos/wiki/Data-migration)
* [DocX](https://github.com/xceedsoftware/DocX)
* [ngx-extended-pdf-viewer](https://github.com/stephanrauh/ngx-extended-pdf-viewer)
