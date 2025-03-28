﻿/*DATAMIGRATION 51495D82-BA7B-43CA-AD75-6E74969B62EA*/ -- Change the script's code only if it needs to be executed again.

-- The following lines are generated by: EXEC Rhetos.HelpDataMigration 'Common', 'Role';
EXEC Rhetos.DataMigrationUse 'Common', 'Role', 'ID', 'uniqueidentifier';
EXEC Rhetos.DataMigrationUse 'Common', 'Role', 'Name', 'nvarchar(256)';
EXEC Rhetos.DataMigrationUse 'Common', 'Role', 'IsCustomRole', 'bit';
GO

-- ... write the data migration queries here (don't forget to use the underscore '_' in schema name) ...
UPDATE _Common.Role 
SET Name = 'Administrator pristupnih podataka', IsCustomRole = 0 
WHERE Name = 'SecurityAdministrator'

INSERT INTO _Common.Role(ID, Name, IsCustomRole) 
VALUES('3DFE8629-F064-4795-B989-4BD9F85FE7A4', 'AllPrincipals', 0)
INSERT INTO _Common.Role(ID, Name, IsCustomRole)
VALUES('1A2EB907-8F74-4412-86F5-98F42E1BDF55', 'Anonymous', 0)

INSERT INTO _Common.Role(ID, Name, IsCustomRole)
VALUES('09A53024-6F19-4F01-8EBC-C50D0F4063BA', 'Administrator', 1)
INSERT INTO _Common.Role(ID, Name, IsCustomRole)
VALUES('E2DD03B1-2ED5-4EB8-94FA-0F295D20D360', 'Učitelj', 1)
INSERT INTO _Common.Role(ID, Name, IsCustomRole)
VALUES('E72D03D6-812E-46D5-8D0C-10D08EF289B8', 'Stručni suradnik', 1)


EXEC Rhetos.DataMigrationApplyMultiple 'Common', 'Role', 'ID, Name, IsCustomRole';