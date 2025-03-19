
/* Runs on every deploy */

DECLARE 
    @ID UNIQUEIDENTIFIER = (SELECT TOP 1 ID FROM Common.Principal WHERE Name = 'admin'),
    @AdministratorRoleID UNIQUEIDENTIFIER = '09A53024-6F19-4F01-8EBC-C50D0F4063BA'

BEGIN
   IF NOT EXISTS (SELECT * FROM Models.Professor WHERE ID = @ID)
   BEGIN
       INSERT INTO Models.Professor(ID, FirstName, LastName, Active)
       VALUES (@ID, 'Administrator', 'Sustava', 1 )
   END
   IF NOT EXISTS (SELECT * FROM Common.PrincipalHasRole WHERE PrincipalID = @ID AND RoleID = @AdministratorRoleID)
   BEGIN
       INSERT INTO Common.PrincipalHasRole(PrincipalID, RoleID)
       VALUES (@ID,@AdministratorRoleID)
   END
   IF NOT EXISTS (
       SELECT * 
       FROM dbo.webpages_Membership
       WHERE UserId = 1 AND IsConfirmed = 1)
   BEGIN
       UPDATE  dbo.webpages_Membership
       SET IsConfirmed = 1
       WHERE UserId = 1
       
   END
END