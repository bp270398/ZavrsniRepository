
/* Runs on every deploy */

-- Common.RolePermission insert 

-- becuase the claims in Common.Claim table are generated automatically at the end of each deployment

CREATE OR ALTER PROC Common.InsertRolePermission
    @Role NVARCHAR(MAX),
    @ClaimResource NVARCHAR(256) = NULL,
    @ClaimRight NVARCHAR(256) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @RoleID UNIQUEIDENTIFIER;
    SELECT @RoleID = ID FROM Common.Role WHERE Name = @Role;

    IF @RoleID IS NULL
    BEGIN
        PRINT 'Error: Role does not exist.';
        RETURN;
    END

    IF @ClaimResource IS NULL AND @ClaimRight IS NULL
    BEGIN
        INSERT INTO Common.RolePermission (RoleID, ClaimID, IsAuthorized)
        SELECT @RoleID, c.ID, 1
        FROM Common.Claim c
        WHERE NOT EXISTS (
            SELECT 1 FROM Common.RolePermission rp 
            WHERE rp.ClaimID = c.ID AND rp.RoleID = @RoleID
        );
    END
    ELSE
    BEGIN
        IF NOT EXISTS (
            SELECT 1 
            FROM Common.RolePermission rp
            JOIN Common.Claim c ON c.ID = rp.ClaimID
            JOIN Common.Role r ON r.ID = rp.RoleID
            WHERE r.Name = @Role 
            AND c.ClaimResource = @ClaimResource 
            AND c.ClaimRight = @ClaimRight
        )
        BEGIN
            INSERT INTO Common.RolePermission (RoleID, ClaimID, IsAuthorized) 
            VALUES (
                @RoleID,
                (SELECT ID FROM Common.Claim WHERE ClaimResource = @ClaimResource AND ClaimRight = @ClaimRight),
                1
            );
        END
    END
END
GO


-- Anonymous 
EXEC Common.InsertRolePermission 'Anonymous', 'Common.GetUserContext', 'Execute';
EXEC Common.InsertRolePermission 'Anonymous', 'Floyd.MyClaims', 'Read';
EXEC Common.InsertRolePermission 'Anonymous', 'Floyd.GetStructureMetadata', 'Execute';
EXEC Common.InsertRolePermission 'Anonymous', 'Floyd.GetStorage', 'Read';
EXEC Common.InsertRolePermission 'Anonymous', 'Floyd.Storage', 'Read';

-- AllPrincipals 
EXEC Common.InsertRolePermission 'AllPrincipals', 'Floyd.SaveStorageItem', 'Execute';
EXEC Common.InsertRolePermission 'AllPrincipals', 'Floyd.Storage', 'New';
EXEC Common.InsertRolePermission 'AllPrincipals', 'Floyd.Storage', 'Edit';
EXEC Common.InsertRolePermission 'AllPrincipals', 'Floyd.Storage', 'Remove';
EXEC Common.InsertRolePermission 'AllPrincipals', 'Common.GetUserContext', 'Execute';
EXEC Common.InsertRolePermission 'AllPrincipals', 'DslModel', 'Load';
EXEC Common.InsertRolePermission 'AllPrincipals', 'Models.Subject', 'Read';
EXEC Common.InsertRolePermission 'AllPrincipals', 'Models.SubjectBrowse', 'Read';
EXEC Common.InsertRolePermission 'AllPrincipals', 'Models.EducationType', 'Read';
EXEC Common.InsertRolePermission 'AllPrincipals', 'Models.EducationLocation', 'Read';
EXEC Common.InsertRolePermission 'AllPrincipals', 'Models.DisabilityType', 'Read';
EXEC Common.InsertRolePermission 'AllPrincipals', 'Models.DisabilitySubtype', 'Read';
EXEC Common.InsertRolePermission 'AllPrincipals', 'Models.DisabilityTypeSubtypeTreeData', 'Read';
EXEC Common.InsertRolePermission 'AllPrincipals', 'Models.DisabilitySubtypeLookup', 'Read';
EXEC Common.InsertRolePermission 'AllPrincipals', 'Models.StudentBrowse', 'Read';
EXEC Common.InsertRolePermission 'AllPrincipals', 'Models.StudentComplexGet', 'Execute';
EXEC Common.InsertRolePermission 'AllPrincipals', 'Models.ProfessorBrowse', 'Read';
EXEC Common.InsertRolePermission 'AllPrincipals', 'Models.ProfessorExtended', 'Read';
EXEC Common.InsertRolePermission 'AllPrincipals', 'Models.ProfessorComplexGet', 'Execute';
EXEC Common.InsertRolePermission 'AllPrincipals', 'DocumentProcessing.DocumentBrowse', 'Read';
EXEC Common.InsertRolePermission 'AllPrincipals', 'DocumentProcessing.DocumentContentBrowse', 'Read';
EXEC Common.InsertRolePermission 'AllPrincipals', 'DocumentProcessing.DocumentComplexGet', 'Execute';
EXEC Common.InsertRolePermission 'AllPrincipals', 'DocumentProcessing.DocumentTemplateBrowse', 'Read';
EXEC Common.InsertRolePermission 'AllPrincipals', 'DocumentProcessing.DocumentTemplateContentBrowse', 'Read';
EXEC Common.InsertRolePermission 'AllPrincipals', 'DocumentProcessing.DocumentTemplate', 'Read';

-- Administrator 
EXEC Common.InsertRolePermission 'Administrator', NULL, NULL; 

-- Učitelj 
EXEC Common.InsertRolePermission 'Učitelj', 'DocumentProcessing.DocumentComplexSave', 'Execute';
EXEC Common.InsertRolePermission 'Učitelj', 'DocumentProcessing.DocumentComplexGet', 'Execute';
EXEC Common.InsertRolePermission 'Učitelj', 'DocumentProcessing.DocumentContent', 'Remove';
EXEC Common.InsertRolePermission 'Učitelj', 'DocumentProcessing.Document', 'Remove';
EXEC Common.InsertRolePermission 'Učitelj', 'DocumentProcessing.DocumentContent', 'New';

-- Stručni suradnik 
EXEC Common.InsertRolePermission 'StručniSuradnik', 'Models.Subject', 'New';
EXEC Common.InsertRolePermission 'StručniSuradnik', 'Models.Subject', 'Edit';
EXEC Common.InsertRolePermission 'StručniSuradnik', 'Models.Subject', 'Remove';
EXEC Common.InsertRolePermission 'StručniSuradnik', 'Models.EducationType', 'New';
EXEC Common.InsertRolePermission 'StručniSuradnik', 'Models.EducationType', 'Edit';
EXEC Common.InsertRolePermission 'StručniSuradnik', 'Models.EducationType', 'Remove';
EXEC Common.InsertRolePermission 'StručniSuradnik', 'Models.EducationLocation', 'New';
EXEC Common.InsertRolePermission 'StručniSuradnik', 'Models.EducationLocation', 'Edit';
EXEC Common.InsertRolePermission 'StručniSuradnik', 'Models.EducationLocation', 'Remove';
EXEC Common.InsertRolePermission 'StručniSuradnik', 'Models.DisabilityType', 'New';
EXEC Common.InsertRolePermission 'StručniSuradnik', 'Models.DisabilityType', 'Edit';
EXEC Common.InsertRolePermission 'StručniSuradnik', 'Models.DisabilityType', 'Remove';
EXEC Common.InsertRolePermission 'StručniSuradnik', 'Models.DisabilitySubtype', 'New';
EXEC Common.InsertRolePermission 'StručniSuradnik', 'Models.DisabilitySubtype', 'Edit';
EXEC Common.InsertRolePermission 'StručniSuradnik', 'Models.DisabilitySubtype', 'Remove';
EXEC Common.InsertRolePermission 'StručniSuradnik', 'Models.StudentComplexSave', 'Execute';
EXEC Common.InsertRolePermission 'StručniSuradnik', 'Models.Student', 'Remove';
EXEC Common.InsertRolePermission 'StručniSuradnik', 'Models.ProfessorComplexSave', 'Execute';
EXEC Common.InsertRolePermission 'StručniSuradnik', 'Models.Professor', 'Remove';

GO

