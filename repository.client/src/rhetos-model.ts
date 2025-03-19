/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */
/* tslint:disable:no-empty-interface class-name no-namespace */

import { createStructureInfo, createFunctionInfo, createComplexInfo, createComplexGetInfo } from '@ngx-floyd/rhetos';



export namespace Common {

    export const AddToLogInfo = createStructureInfo<Common.AddToLog>('Common/AddToLog');
    export interface AddToLog {
        Action?: string;
        Description?: string;
        ItemId?: string;
        TableName?: string;
    }

    export const AspNetFormsAuthPasswordStrengthInfo = createStructureInfo<Common.AspNetFormsAuthPasswordStrength>('Common/AspNetFormsAuthPasswordStrength');
    export interface AspNetFormsAuthPasswordStrength {
        ID: string;
        RegularExpression?: string;
        RuleDescription?: string;
    }

    export const AutoCodeCacheInfo = createStructureInfo<Common.AutoCodeCache>('Common/AutoCodeCache');
    export interface AutoCodeCache {
        ID: string;
        Entity?: string;
        Grouping?: string;
        LastCode?: number;
        MinDigits?: number;
        Prefix?: string;
        Property?: string;
    }

    export const ClaimInfo = createStructureInfo<Common.Claim>('Common/Claim');
    export interface Claim {
        ID: string;
        Active?: boolean;
        ClaimResource: string;
        ClaimRight: string;
    }

    export const ExclusiveLockInfo = createStructureInfo<Common.ExclusiveLock>('Common/ExclusiveLock');
    export interface ExclusiveLock {
        ID: string;
        LockFinish: Date;
        LockStart: Date;
        ResourceID: string;
        ResourceType: string;
        UserName: string;
        Workstation: string;
    }

    export const FilterIdInfo = createStructureInfo<Common.FilterId>('Common/FilterId');
    export interface FilterId {
        ID: string;
        Handle?: string;
        Value?: string;
    }

    export const HangfireJobInfo = createStructureInfo<Common.HangfireJob>('Common/HangfireJob');
    export interface HangfireJob {
        ID: string;
        Name?: string;
    }

    export const KeepSynchronizedMetadataInfo = createStructureInfo<Common.KeepSynchronizedMetadata>('Common/KeepSynchronizedMetadata');
    export interface KeepSynchronizedMetadata {
        ID: string;
        Context?: string;
        Source?: string;
        Target?: string;
    }

    export const LockUserInfo = createStructureInfo<Common.LockUser>('Common/LockUser');
    export interface LockUser {
        PrincipalID?: string;
    }

    export const LogInfo = createStructureInfo<Common.Log>('Common/Log');
    export interface Log {
        ID: string;
        Action: string;
        ContextInfo?: string;
        Created: Date;
        Description?: string;
        ItemId?: string;
        TableName?: string;
        UserName: string;
        Workstation: string;
    }

    export const LogArchiveInfo = createStructureInfo<Common.LogArchive>('Common/LogArchive');
    export interface LogArchive {
        ID: string;
        Action: string;
        ContextInfo?: string;
        Created: Date;
        Description?: string;
        ItemId?: string;
        TableName?: string;
        UserName: string;
        Workstation: string;
    }

    export const LogReaderInfo = createStructureInfo<Common.LogReader>('Common/LogReader');
    export interface LogReader {
        ID: string;
        Action: string;
        ContextInfo?: string;
        Created: Date;
        Description?: string;
        ItemId?: string;
        TableName?: string;
        UserName: string;
        Workstation: string;
    }

    export const LogRelatedItemInfo = createStructureInfo<Common.LogRelatedItem>('Common/LogRelatedItem');
    export interface LogRelatedItem {
        ID: string;
        ItemId?: string;
        LogID: string;
        Relation?: string;
        TableName?: string;
    }

    export const LogRelatedItemArchiveInfo = createStructureInfo<Common.LogRelatedItemArchive>('Common/LogRelatedItemArchive');
    export interface LogRelatedItemArchive {
        ID: string;
        ItemId?: string;
        LogID: string;
        Relation?: string;
        TableName?: string;
    }

    export const LogRelatedItemReaderInfo = createStructureInfo<Common.LogRelatedItemReader>('Common/LogRelatedItemReader');
    export interface LogRelatedItemReader {
        ID: string;
        ItemId?: string;
        LogID: string;
        Relation?: string;
        TableName?: string;
    }

    export const MoveLogToArchiveInfo = createStructureInfo<Common.MoveLogToArchive>('Common/MoveLogToArchive');
    export interface MoveLogToArchive {
    }

    export const MoveLogToArchivePartialInfo = createStructureInfo<Common.MoveLogToArchivePartial>('Common/MoveLogToArchivePartial');
    export interface MoveLogToArchivePartial {
    }

    export const NewerThanCurrentEntryInfo = createStructureInfo<Common.NewerThanCurrentEntry>('Common/NewerThanCurrentEntry');
    export interface NewerThanCurrentEntry {
    }

    export const OlderThanHistoryEntriesInfo = createStructureInfo<Common.OlderThanHistoryEntries>('Common/OlderThanHistoryEntries');
    export interface OlderThanHistoryEntries {
    }

    export const PermissionInfo = createStructureInfo<Common.Permission>('Common/Permission');
    export interface Permission {
        ClaimID: string;
        IsAuthorized: boolean;
        RoleID: string;
    }

    export const PrincipalInfo = createStructureInfo<Common.Principal>('Common/Principal');
    export interface Principal {
        ID: string;
        AspNetUserId?: number;
        Email?: string;
        Name: string;
    }

    export const PrincipalBrowseInfo = createStructureInfo<Common.PrincipalBrowse>('Common/PrincipalBrowse');
    export interface PrincipalBrowse {
        ID: string;
        AccountConfirmed?: boolean;
        AspNetUserID?: number;
        CreateDate?: Date;
        Email?: string;
        FirstName?: string;
        LastName?: string;
        PrincipalName?: string;
        Roles?: string;
    }

    export const PrincipalHasRoleInfo = createStructureInfo<Common.PrincipalHasRole>('Common/PrincipalHasRole');
    export interface PrincipalHasRole {
        ID: string;
        PrincipalID: string;
        RoleID: string;
    }

    export const PrincipalPermissionInfo = createStructureInfo<Common.PrincipalPermission>('Common/PrincipalPermission');
    export interface PrincipalPermission {
        ID: string;
        ClaimID: string;
        IsAuthorized: boolean;
        PrincipalID: string;
    }

    export const RelatedEventsSourceInfo = createStructureInfo<Common.RelatedEventsSource>('Common/RelatedEventsSource');
    export interface RelatedEventsSource {
        ID: string;
        Action: string;
        ContextInfo?: string;
        Created: Date;
        Description?: string;
        ItemId?: string;
        LogID?: string;
        RelatedToItem?: string;
        RelatedToTable?: string;
        Relation?: string;
        TableName?: string;
        UserName: string;
        Workstation: string;
    }

    export const ReleaseLockInfo = createStructureInfo<Common.ReleaseLock>('Common/ReleaseLock');
    export interface ReleaseLock {
        ResourceID?: string;
        ResourceType?: string;
    }

    export const RoleInfo = createStructureInfo<Common.Role>('Common/Role');
    export interface Role {
        ID: string;
        IsCustomRole?: boolean;
        Name: string;
    }

    export const RoleInheritsRoleInfo = createStructureInfo<Common.RoleInheritsRole>('Common/RoleInheritsRole');
    export interface RoleInheritsRole {
        ID: string;
        PermissionsFromID: string;
        UsersFromID: string;
    }

    export const RolePermissionInfo = createStructureInfo<Common.RolePermission>('Common/RolePermission');
    export interface RolePermission {
        ID: string;
        ClaimID: string;
        IsAuthorized: boolean;
        RoleID: string;
    }

    export const SetLockInfo = createStructureInfo<Common.SetLock>('Common/SetLock');
    export interface SetLock {
        ResourceID?: string;
        ResourceType?: string;
    }

    export const SystemRequiredActiveInfo = createStructureInfo<Common.SystemRequiredActive>('Common/SystemRequiredActive');
    export interface SystemRequiredActive {
    }

    export const SystemRequiredAspNetUserIdInfo = createStructureInfo<Common.SystemRequiredAspNetUserId>('Common/SystemRequiredAspNetUserId');
    export interface SystemRequiredAspNetUserId {
    }

    export const SystemRequiredClaimInfo = createStructureInfo<Common.SystemRequiredClaim>('Common/SystemRequiredClaim');
    export interface SystemRequiredClaim {
    }

    export const SystemRequiredLogInfo = createStructureInfo<Common.SystemRequiredLog>('Common/SystemRequiredLog');
    export interface SystemRequiredLog {
    }

    export const SystemRequiredPrincipalInfo = createStructureInfo<Common.SystemRequiredPrincipal>('Common/SystemRequiredPrincipal');
    export interface SystemRequiredPrincipal {
    }

    export const SystemRequiredRoleInfo = createStructureInfo<Common.SystemRequiredRole>('Common/SystemRequiredRole');
    export interface SystemRequiredRole {
    }

    export const SystemRequiredUsersFromInfo = createStructureInfo<Common.SystemRequiredUsersFrom>('Common/SystemRequiredUsersFrom');
    export interface SystemRequiredUsersFrom {
    }

    export const UnlockUserInfo = createStructureInfo<Common.UnlockUser>('Common/UnlockUser');
    export interface UnlockUser {
        PrincipalID?: string;
    }

    export const UpsertPrincipalInfo = createStructureInfo<Common.UpsertPrincipal>('Common/UpsertPrincipal');
    export interface UpsertPrincipal {
        Principal?: Common.Principal;
        PrincipalHasRoles?: Common.PrincipalHasRole[];
    }

    export const UserContextInfo = createStructureInfo<Common.UserContext>('Common/UserContext');
    export interface UserContext {
        Email?: string;
        FirstName?: string;
        LastName?: string;
        PrincipalID?: string;
        PrincipalName?: string;
        Roles?: string;
    }

    export const UserInfoInfo = createStructureInfo<Common.UserInfo>('Common/UserInfo');
    export interface UserInfo {
        ID: string;
        AccountConfirmed?: boolean;
        AspNetUserID?: number;
        FirstName?: string;
        HasAccess?: boolean;
        IsConfirmed?: boolean;
        IsPermanentlyLockedOut?: boolean;
        LastName?: string;
        LockoutEnd?: Date;
        PrincipalName?: string;
        Roles?: string;
    }

    export const MyClaimInfo = createStructureInfo<Common.MyClaim>('Common/MyClaim');
    export interface MyClaim {
        ID: string;
        Applies?: boolean;
    }

    export const GetUserContextInfo = createStructureInfo<Common.GetUserContext>('Common/GetUserContext');
    export interface GetUserContext {
    }

    export const GetUserContextFunctionInfo = createFunctionInfo(GetUserContextInfo, UserContextInfo);
}

export namespace DocumentProcessing {

    export const ContentControlInfoInfo = createStructureInfo<DocumentProcessing.ContentControlInfo>('DocumentProcessing/ContentControlInfo');
    export interface ContentControlInfo {
        ID: string;
        Description?: string;
        FieldGroup?: string;
        IsLongString?: boolean;
        IsMapped?: boolean;
        IsReadonly?: boolean;
        MappedFromProperty?: string;
        Tag: string;
        Title?: string;
        Value?: string;
        DocumentID?: string;
    }

    export const CurrentUserIsCreatedByUserInfo = createStructureInfo<DocumentProcessing.CurrentUserIsCreatedByUser>('DocumentProcessing/CurrentUserIsCreatedByUser');
    export interface CurrentUserIsCreatedByUser {
    }

    export const DocumentInfo = createStructureInfo<DocumentProcessing.Document>('DocumentProcessing/Document');
    export interface Document {
        ID: string;
        CreatedDate?: Date;
        DocumentStatusID?: string;
        DocumentTemplateID: string;
        CreatedByID: string;
        StudentID?: string;
        SubjectID?: string;
    }

    export const DocumentContentInfo = createStructureInfo<DocumentProcessing.DocumentContent>('DocumentProcessing/DocumentContent');
    export interface DocumentContent {
        ID: string;
        CreatedDate?: Date;
        DocumentID: string;
        FileExtension: string;
        CreatedByID: string;
    }

    export const DocumentContentControlInfoInfo = createStructureInfo<DocumentProcessing.DocumentContentControlInfo>('DocumentProcessing/DocumentContentControlInfo');
    export interface DocumentContentControlInfo {
        ID: string;
        ContentControlInfoID: string;
        DocumentID: string;
    }

    export const DocumentContentExtendedInfo = createStructureInfo<DocumentProcessing.DocumentContentExtended>('DocumentProcessing/DocumentContentExtended');
    export interface DocumentContentExtended {
        ID: string;
        CreatedDateString?: string;
    }

    export const DocumentExtendedInfo = createStructureInfo<DocumentProcessing.DocumentExtended>('DocumentProcessing/DocumentExtended');
    export interface DocumentExtended {
        ID: string;
        CreatedDateString?: string;
        DocumentContentID?: string;
        FileExtension?: string;
        SkolskaGodina?: string;
    }

    export const DocumentStatusInfo = createStructureInfo<DocumentProcessing.DocumentStatus>('DocumentProcessing/DocumentStatus');
    export interface DocumentStatus {
        ID: string;
        Label?: string;
        Name?: string;
    }

    export const DocumentStatusIds = {
		Created: '249e0bd7-a2bc-406b-9b94-58ceca6c9e5c',
		ReadyToSign: 'ade0e72d-f577-5a04-9491-140c627bc481',
		Sent: '2bc86bc1-f0f1-de4e-04d1-bc0bdf714b1a',
		Signed: '62152508-40b3-167a-f7b7-1d43a4b30500'
	};

    export const DocumentStatusItems: DocumentProcessing.DocumentStatus[] = [
		{ ID: '249e0bd7-a2bc-406b-9b94-58ceca6c9e5c', Name: 'Created', Label: 'Kreiran' },
		{ ID: 'ade0e72d-f577-5a04-9491-140c627bc481', Name: 'ReadyToSign', Label: 'Spreman za potpisivanje' },
		{ ID: '2bc86bc1-f0f1-de4e-04d1-bc0bdf714b1a', Name: 'Sent', Label: 'Poslan' },
		{ ID: '62152508-40b3-167a-f7b7-1d43a4b30500', Name: 'Signed', Label: 'Potpisan' }
	];

    export const DocumentTemplateInfo = createStructureInfo<DocumentProcessing.DocumentTemplate>('DocumentProcessing/DocumentTemplate');
    export interface DocumentTemplate {
        ID: string;
        Active?: boolean;
        CreatedDate?: Date;
        DocumentType: string;
        CreatedByID: string;
    }

    export const DocumentTemplateContentInfo = createStructureInfo<DocumentProcessing.DocumentTemplateContent>('DocumentProcessing/DocumentTemplateContent');
    export interface DocumentTemplateContent {
        ID: string;
        CreatedDate?: Date;
        DocumentTemplateID: string;
        FileExtension: string;
        CreatedByID: string;
    }

    export const DocumentTemplateContentExtendedInfo = createStructureInfo<DocumentProcessing.DocumentTemplateContentExtended>('DocumentProcessing/DocumentTemplateContentExtended');
    export interface DocumentTemplateContentExtended {
        ID: string;
        CreatedDateString?: string;
    }

    export const DocumentTemplateExtendedInfo = createStructureInfo<DocumentProcessing.DocumentTemplateExtended>('DocumentProcessing/DocumentTemplateExtended');
    export interface DocumentTemplateExtended {
        ID: string;
        CreatedDateString?: string;
        DocumentTemplateContentID?: string;
        FileExtension?: string;
    }

    export const GetContentControlInfosResponseInfo = createStructureInfo<DocumentProcessing.GetContentControlInfosResponse>('DocumentProcessing/GetContentControlInfosResponse');
    export interface GetContentControlInfosResponse {
        Items?: DocumentProcessing.ContentControlInfo[];
    }

    export const RemapContentControlInfosInfo = createStructureInfo<DocumentProcessing.RemapContentControlInfos>('DocumentProcessing/RemapContentControlInfos');
    export interface RemapContentControlInfos {
        DocumentID?: string;
    }

    export const StudentDocumentFilterInfo = createStructureInfo<DocumentProcessing.StudentDocumentFilter>('DocumentProcessing/StudentDocumentFilter');
    export interface StudentDocumentFilter {
        StudentID?: string;
    }

    export const SystemRequiredActiveInfo = createStructureInfo<DocumentProcessing.SystemRequiredActive>('DocumentProcessing/SystemRequiredActive');
    export interface SystemRequiredActive {
    }

    export const SystemRequiredDocumentInfo = createStructureInfo<DocumentProcessing.SystemRequiredDocument>('DocumentProcessing/SystemRequiredDocument');
    export interface SystemRequiredDocument {
    }

    export const SystemRequiredDocumentTemplateInfo = createStructureInfo<DocumentProcessing.SystemRequiredDocumentTemplate>('DocumentProcessing/SystemRequiredDocumentTemplate');
    export interface SystemRequiredDocumentTemplate {
    }

    export const SystemRequiredStudentInfo = createStructureInfo<DocumentProcessing.SystemRequiredStudent>('DocumentProcessing/SystemRequiredStudent');
    export interface SystemRequiredStudent {
    }

    export const TemplateUsedDocumentFilterInfo = createStructureInfo<DocumentProcessing.TemplateUsedDocumentFilter>('DocumentProcessing/TemplateUsedDocumentFilter');
    export interface TemplateUsedDocumentFilter {
        DocumentTemplateID?: string;
    }

    export const MapContentControlInfoInfo = createStructureInfo<DocumentProcessing.MapContentControlInfo>('DocumentProcessing/MapContentControlInfo');
    export interface MapContentControlInfo {
        DocumentID?: string;
        Tag?: string;
    }

    export const MapContentControlInfoFunctionInfo = createFunctionInfo(MapContentControlInfoInfo, ContentControlInfoInfo);

    export const DocumentBrowseInfo = createStructureInfo<DocumentProcessing.DocumentBrowse>('DocumentProcessing/DocumentBrowse');
    export interface DocumentBrowse {
        ID: string;
        CreatedByID?: string;
        CreatedDate?: Date;
        CreatedDateString?: string;
        DocumentContentID?: string;
        DocumentStatus?: string;
        DocumentTemplateID?: string;
        DocumentTemplateType?: string;
        FileExtension?: string;
        ProfessorFullName?: string;
        SkolskaGodina?: string;
        StudentID?: string;
        StudentFullNameAndGrade?: string;
        SubjectID?: string;
        SubjectTitle?: string;
    }

    export const DocumentComplexInfo = createStructureInfo<DocumentProcessing.DocumentComplex>('DocumentProcessing/DocumentComplex');
    export interface DocumentComplex {
        ID: string;
        Professor?: Models.Professor;
        Student?: Models.Student;
        Subject?: Models.Subject;
        CreatedByID?: string;
        CreatedDate?: Date;
        DocumentContentExtension?: string;
        DocumentContentID?: string;
        DocumentStatusID?: string;
        DocumentTemplateID?: string;
        StudentID?: string;
        SubjectID?: string;
        ContentControlInfos?: DocumentProcessing.DocumentContentControlInfosComplex[];
    }

    export const DocumentContentBrowseInfo = createStructureInfo<DocumentProcessing.DocumentContentBrowse>('DocumentProcessing/DocumentContentBrowse');
    export interface DocumentContentBrowse {
        ID: string;
        CreatedByID?: string;
        CreatedByFullName?: string;
        CreatedDate?: Date;
        CreatedDateString?: string;
        DocumentID?: string;
        FileExtension?: string;
    }

    export const DocumentTemplateBrowseInfo = createStructureInfo<DocumentProcessing.DocumentTemplateBrowse>('DocumentProcessing/DocumentTemplateBrowse');
    export interface DocumentTemplateBrowse {
        ID: string;
        Active?: boolean;
        CreatedByID?: string;
        CreatedDate?: Date;
        CreatedDateString?: string;
        DocumentTemplateContentID?: string;
        DocumentType?: string;
        FileExtension?: string;
        ProfessorFullName?: string;
    }

    export const DocumentTemplateComplexInfo = createStructureInfo<DocumentProcessing.DocumentTemplateComplex>('DocumentProcessing/DocumentTemplateComplex');
    export interface DocumentTemplateComplex {
        ID: string;
        CurrentContent?: DocumentProcessing.DocumentTemplateContent;
        Active?: boolean;
        CreatedByID?: string;
        CreatedDate?: Date;
        DocumentType?: string;
        Contents?: DocumentProcessing.DocumentTemplateContentsComplex[];
    }

    export const DocumentTemplateContentBrowseInfo = createStructureInfo<DocumentProcessing.DocumentTemplateContentBrowse>('DocumentProcessing/DocumentTemplateContentBrowse');
    export interface DocumentTemplateContentBrowse {
        ID: string;
        CreatedByID?: string;
        CreatedByFullName?: string;
        CreatedDate?: Date;
        CreatedDateString?: string;
        DocumentTemplateID?: string;
        FileExtension?: string;
    }

    export const GetContentControlInfosInfo = createStructureInfo<DocumentProcessing.GetContentControlInfos>('DocumentProcessing/GetContentControlInfos');
    export interface GetContentControlInfos {
        DocumentID?: string;
    }

    export const GetContentControlInfosFunctionInfo = createFunctionInfo(GetContentControlInfosInfo, GetContentControlInfosResponseInfo);

    export const DocumentComplexGetInfo = createStructureInfo<DocumentProcessing.DocumentComplexGet>('DocumentProcessing/DocumentComplexGet');
    export interface DocumentComplexGet {
        ID?: string;
    }

    export const DocumentComplexGetFunctionInfo = createFunctionInfo(DocumentComplexGetInfo, DocumentComplexInfo);

    export const DocumentContentControlInfosComplexInfo = createStructureInfo<DocumentProcessing.DocumentContentControlInfosComplex>('DocumentProcessing/DocumentContentControlInfosComplex');
    export interface DocumentContentControlInfosComplex {
        ID: string;
        Description?: string;
        DocumentID?: string;
        FieldGroup?: string;
        IsLongString?: boolean;
        IsMapped?: boolean;
        IsReadonly?: boolean;
        MappedFromProperty?: string;
        Tag?: string;
        Title?: string;
        Value?: string;
    }

    export const DocumentTemplateComplexGetInfo = createStructureInfo<DocumentProcessing.DocumentTemplateComplexGet>('DocumentProcessing/DocumentTemplateComplexGet');
    export interface DocumentTemplateComplexGet {
        ID?: string;
    }

    export const DocumentTemplateComplexGetFunctionInfo = createFunctionInfo(DocumentTemplateComplexGetInfo, DocumentTemplateComplexInfo);

    export const DocumentTemplateContentsComplexInfo = createStructureInfo<DocumentProcessing.DocumentTemplateContentsComplex>('DocumentProcessing/DocumentTemplateContentsComplex');
    export interface DocumentTemplateContentsComplex {
        ID: string;
        CreatedByID?: string;
        CreatedDate?: Date;
        DocumentTemplateID?: string;
        FileExtension?: string;
    }

    export const DocumentComplexSaveInfo = createStructureInfo<DocumentProcessing.DocumentComplexSave>('DocumentProcessing/DocumentComplexSave');
    export interface DocumentComplexSave {
        Item?: DocumentProcessing.DocumentComplex;
    }

    export const DocumentComplexSaveFunctionInfo = createFunctionInfo(DocumentComplexSaveInfo, DocumentComplexInfo);

    export const DocumentComplexComplexInfo = createComplexInfo(DocumentComplexGetFunctionInfo, DocumentComplexSaveFunctionInfo);

    export const DocumentTemplateComplexSaveInfo = createStructureInfo<DocumentProcessing.DocumentTemplateComplexSave>('DocumentProcessing/DocumentTemplateComplexSave');
    export interface DocumentTemplateComplexSave {
        Item?: DocumentProcessing.DocumentTemplateComplex;
    }

    export const DocumentTemplateComplexSaveFunctionInfo = createFunctionInfo(DocumentTemplateComplexSaveInfo, DocumentTemplateComplexInfo);

    export const DocumentTemplateComplexComplexInfo = createComplexInfo(DocumentTemplateComplexGetFunctionInfo, DocumentTemplateComplexSaveFunctionInfo);
}

export namespace Floyd {

    export const GetStorageInfo = createStructureInfo<Floyd.GetStorage>('Floyd/GetStorage');
    export interface GetStorage {
        ID: string;
        Key?: string;
        Value?: string;
    }

    export const MyClaimsInfo = createStructureInfo<Floyd.MyClaims>('Floyd/MyClaims');
    export interface MyClaims {
        ID: string;
        ClaimResource?: string;
        ClaimRight?: string;
    }

    export const SaveStorageItemInfo = createStructureInfo<Floyd.SaveStorageItem>('Floyd/SaveStorageItem');
    export interface SaveStorageItem {
        Key?: string;
        Value?: string;
    }

    export const StorageInfo = createStructureInfo<Floyd.Storage>('Floyd/Storage');
    export interface Storage {
        ID: string;
        StorageKey: string;
        UserName?: string;
        Value: string;
    }

    export const StructureMetadataInfo = createStructureInfo<Floyd.StructureMetadata>('Floyd/StructureMetadata');
    export interface StructureMetadata {
        Value?: string;
    }

    export const GetStructureMetadataInfo = createStructureInfo<Floyd.GetStructureMetadata>('Floyd/GetStructureMetadata');
    export interface GetStructureMetadata {
    }

    export const GetStructureMetadataFunctionInfo = createFunctionInfo(GetStructureMetadataInfo, StructureMetadataInfo);
}

export namespace Models {

    export const CurrentProfessorIsTeachingSubjectInfo = createStructureInfo<Models.CurrentProfessorIsTeachingSubject>('Models/CurrentProfessorIsTeachingSubject');
    export interface CurrentProfessorIsTeachingSubject {
    }

    export const DisabilitySubtypeInfo = createStructureInfo<Models.DisabilitySubtype>('Models/DisabilitySubtype');
    export interface DisabilitySubtype {
        ID: string;
        Active?: boolean;
        ActiveSince?: Date;
        ParentID?: string;
        Subtype: string;
        DisabilityTypeID?: string;
    }

    export const DisabilitySubtype_ChangesInfo = createStructureInfo<Models.DisabilitySubtype_Changes>('Models/DisabilitySubtype_Changes');
    export interface DisabilitySubtype_Changes {
        ID: string;
        Active?: boolean;
        ActiveSince?: Date;
        EntityID: string;
        ParentID?: string;
        Subtype: string;
        DisabilityTypeID?: string;
    }

    export const DisabilitySubtype_ChangesActiveUntilInfo = createStructureInfo<Models.DisabilitySubtype_ChangesActiveUntil>('Models/DisabilitySubtype_ChangesActiveUntil');
    export interface DisabilitySubtype_ChangesActiveUntil {
        ID: string;
        ActiveUntil?: Date;
    }

    export const DisabilitySubtype_HistoryInfo = createStructureInfo<Models.DisabilitySubtype_History>('Models/DisabilitySubtype_History');
    export interface DisabilitySubtype_History {
        ID: string;
        Active?: boolean;
        ActiveSince?: Date;
        ActiveUntil?: Date;
        EntityID: string;
        ParentID?: string;
        Subtype: string;
        DisabilityTypeID?: string;
    }

    export const DisabilityTypeInfo = createStructureInfo<Models.DisabilityType>('Models/DisabilityType');
    export interface DisabilityType {
        ID: string;
        Active?: boolean;
        ActiveSince?: Date;
        Type: string;
    }

    export const DisabilityType_ChangesInfo = createStructureInfo<Models.DisabilityType_Changes>('Models/DisabilityType_Changes');
    export interface DisabilityType_Changes {
        ID: string;
        Active?: boolean;
        ActiveSince?: Date;
        EntityID: string;
        Type: string;
    }

    export const DisabilityType_ChangesActiveUntilInfo = createStructureInfo<Models.DisabilityType_ChangesActiveUntil>('Models/DisabilityType_ChangesActiveUntil');
    export interface DisabilityType_ChangesActiveUntil {
        ID: string;
        ActiveUntil?: Date;
    }

    export const DisabilityType_HistoryInfo = createStructureInfo<Models.DisabilityType_History>('Models/DisabilityType_History');
    export interface DisabilityType_History {
        ID: string;
        Active?: boolean;
        ActiveSince?: Date;
        ActiveUntil?: Date;
        EntityID: string;
        Type: string;
    }

    export const DisabilityTypeSubtypeTreeDataInfo = createStructureInfo<Models.DisabilityTypeSubtypeTreeData>('Models/DisabilityTypeSubtypeTreeData');
    export interface DisabilityTypeSubtypeTreeData {
        ID: string;
        Active?: boolean;
        JeZadnjaRazina?: boolean;
        Naziv?: string;
        ParentID?: string;
        Tip?: string;
    }

    export const EducationLocationInfo = createStructureInfo<Models.EducationLocation>('Models/EducationLocation');
    export interface EducationLocation {
        ID: string;
        Active?: boolean;
        Location: string;
    }

    export const EducationTypeInfo = createStructureInfo<Models.EducationType>('Models/EducationType');
    export interface EducationType {
        ID: string;
        Active?: boolean;
        Type: string;
    }

    export const Grade_MaxValueFilterInfo = createStructureInfo<Models.Grade_MaxValueFilter>('Models/Grade_MaxValueFilter');
    export interface Grade_MaxValueFilter {
    }

    export const Grade_MinValueFilterInfo = createStructureInfo<Models.Grade_MinValueFilter>('Models/Grade_MinValueFilter');
    export interface Grade_MinValueFilter {
    }

    export const Oib_MaxLengthFilterInfo = createStructureInfo<Models.Oib_MaxLengthFilter>('Models/Oib_MaxLengthFilter');
    export interface Oib_MaxLengthFilter {
    }

    export const Oib_MinLengthFilterInfo = createStructureInfo<Models.Oib_MinLengthFilter>('Models/Oib_MinLengthFilter');
    export interface Oib_MinLengthFilter {
    }

    export const Oib_RegExMatchFilterInfo = createStructureInfo<Models.Oib_RegExMatchFilter>('Models/Oib_RegExMatchFilter');
    export interface Oib_RegExMatchFilter {
    }

    export const ProfessorInfo = createStructureInfo<Models.Professor>('Models/Professor');
    export interface Professor {
        ID: string;
        Active?: boolean;
        ActiveSince?: Date;
        FirstName: string;
        LastName: string;
    }

    export const Professor_ChangesInfo = createStructureInfo<Models.Professor_Changes>('Models/Professor_Changes');
    export interface Professor_Changes {
        ID: string;
        Active?: boolean;
        ActiveSince?: Date;
        EntityID: string;
        FirstName: string;
        LastName: string;
    }

    export const Professor_ChangesActiveUntilInfo = createStructureInfo<Models.Professor_ChangesActiveUntil>('Models/Professor_ChangesActiveUntil');
    export interface Professor_ChangesActiveUntil {
        ID: string;
        ActiveUntil?: Date;
    }

    export const Professor_HistoryInfo = createStructureInfo<Models.Professor_History>('Models/Professor_History');
    export interface Professor_History {
        ID: string;
        Active?: boolean;
        ActiveSince?: Date;
        ActiveUntil?: Date;
        EntityID: string;
        FirstName: string;
        LastName: string;
    }

    export const ProfessorExtendedInfo = createStructureInfo<Models.ProfessorExtended>('Models/ProfessorExtended');
    export interface ProfessorExtended {
        ID: string;
        FullName?: string;
        Roles?: string;
        Subjects?: string;
    }

    export const ProfessorSubjectInfo = createStructureInfo<Models.ProfessorSubject>('Models/ProfessorSubject');
    export interface ProfessorSubject {
        ID: string;
        ProfessorID: string;
        SubjectID: string;
    }

    export const StudentInfo = createStructureInfo<Models.Student>('Models/Student');
    export interface Student {
        ID: string;
        Active?: boolean;
        DateOfBirth?: Date;
        EducationLocationID: string;
        EducationTypeID: string;
        FirstName: string;
        Grade: number;
        GradeDivision: string;
        LastName: string;
        Oib: string;
    }

    export const StudentDisabilitySubtypeInfo = createStructureInfo<Models.StudentDisabilitySubtype>('Models/StudentDisabilitySubtype');
    export interface StudentDisabilitySubtype {
        ID: string;
        DisabilitySubtypeID: string;
        StudentID?: string;
    }

    export const StudentExtendedInfo = createStructureInfo<Models.StudentExtended>('Models/StudentExtended');
    export interface StudentExtended {
        ID: string;
        DateOfBirthString?: string;
        DisabilitySubtypeIDs?: string;
        DisabilitySubtypes?: string;
        FullGrade?: string;
        FullName?: string;
        FullNameAndGrade?: string;
    }

    export const StudentIsEnrolledInSubjectInfo = createStructureInfo<Models.StudentIsEnrolledInSubject>('Models/StudentIsEnrolledInSubject');
    export interface StudentIsEnrolledInSubject {
        StudentID?: string;
    }

    export const StudentSubjectInfo = createStructureInfo<Models.StudentSubject>('Models/StudentSubject');
    export interface StudentSubject {
        ID: string;
        StudentID: string;
        SubjectID: string;
    }

    export const SubjectInfo = createStructureInfo<Models.Subject>('Models/Subject');
    export interface Subject {
        ID: string;
        Active?: boolean;
        Title: string;
    }

    export const SubjectExtendedInfo = createStructureInfo<Models.SubjectExtended>('Models/SubjectExtended');
    export interface SubjectExtended {
        ID: string;
        Professors?: string;
    }

    export const SystemRequiredActiveInfo = createStructureInfo<Models.SystemRequiredActive>('Models/SystemRequiredActive');
    export interface SystemRequiredActive {
    }

    export const SystemRequiredDisabilityTypeInfo = createStructureInfo<Models.SystemRequiredDisabilityType>('Models/SystemRequiredDisabilityType');
    export interface SystemRequiredDisabilityType {
    }

    export const SystemRequiredEntityInfo = createStructureInfo<Models.SystemRequiredEntity>('Models/SystemRequiredEntity');
    export interface SystemRequiredEntity {
    }

    export const SystemRequiredProfessorInfo = createStructureInfo<Models.SystemRequiredProfessor>('Models/SystemRequiredProfessor');
    export interface SystemRequiredProfessor {
    }

    export const SystemRequiredStudentInfo = createStructureInfo<Models.SystemRequiredStudent>('Models/SystemRequiredStudent');
    export interface SystemRequiredStudent {
    }

    export const DisabilitySubtypeLookupInfo = createStructureInfo<Models.DisabilitySubtypeLookup>('Models/DisabilitySubtypeLookup');
    export interface DisabilitySubtypeLookup {
        ID: string;
        Active?: boolean;
        DisabilityTypeActive?: boolean;
        Subtype?: string;
    }

    export const DisabilityTypeComplexInfo = createStructureInfo<Models.DisabilityTypeComplex>('Models/DisabilityTypeComplex');
    export interface DisabilityTypeComplex {
        ID: string;
        Active?: boolean;
        ActiveSince?: Date;
        Type?: string;
        Subtypes?: Models.DisabilityTypeSubtypesComplex[];
    }

    export const ProfessorBrowseInfo = createStructureInfo<Models.ProfessorBrowse>('Models/ProfessorBrowse');
    export interface ProfessorBrowse {
        ID: string;
        Active?: boolean;
        FullName?: string;
        Roles?: string;
        Subjects?: string;
    }

    export const ProfessorComplexInfo = createStructureInfo<Models.ProfessorComplex>('Models/ProfessorComplex');
    export interface ProfessorComplex {
        ID: string;
        Principal?: Common.Principal;
        PrincipalHasRoles?: Common.PrincipalHasRole[];
        Active?: boolean;
        ActiveSince?: Date;
        FirstName?: string;
        HasAccess?: boolean;
        IsConfirmed?: boolean;
        IsPermanentlyLockedOut?: boolean;
        LastName?: string;
        LockoutEnd?: Date;
        Subjects?: Models.ProfessorSubjectsComplex[];
    }

    export const StudentBrowseInfo = createStructureInfo<Models.StudentBrowse>('Models/StudentBrowse');
    export interface StudentBrowse {
        ID: string;
        Active?: boolean;
        DateOfBirth?: Date;
        DateOfBirthString?: string;
        EducationLocation?: string;
        EducationLocationID?: string;
        EducationType?: string;
        EducationTypeID?: string;
        FirstName?: string;
        FullGrade?: string;
        FullName?: string;
        FullNameAndGrade?: string;
        Grade?: number;
        GradeDivision?: string;
        LastName?: string;
        Oib?: string;
    }

    export const StudentComplexInfo = createStructureInfo<Models.StudentComplex>('Models/StudentComplex');
    export interface StudentComplex {
        ID: string;
        Active?: boolean;
        DateOfBirth?: Date;
        EducationLocationID?: string;
        EducationTypeID?: string;
        FirstName?: string;
        Grade?: number;
        GradeDivision?: string;
        LastName?: string;
        Oib?: string;
        DisabilitySubtypes?: Models.StudentDisabilitySubtypesComplex[];
        Subjects?: Models.StudentSubjectsComplex[];
    }

    export const SubjectBrowseInfo = createStructureInfo<Models.SubjectBrowse>('Models/SubjectBrowse');
    export interface SubjectBrowse {
        ID: string;
        Active?: boolean;
        Professors?: string;
        Title?: string;
    }

    export const DisabilityTypeComplexGetInfo = createStructureInfo<Models.DisabilityTypeComplexGet>('Models/DisabilityTypeComplexGet');
    export interface DisabilityTypeComplexGet {
        ID?: string;
    }

    export const DisabilityTypeComplexGetFunctionInfo = createFunctionInfo(DisabilityTypeComplexGetInfo, DisabilityTypeComplexInfo);

    export const DisabilityTypeSubtypesComplexInfo = createStructureInfo<Models.DisabilityTypeSubtypesComplex>('Models/DisabilityTypeSubtypesComplex');
    export interface DisabilityTypeSubtypesComplex {
        ID: string;
        Active?: boolean;
        ActiveSince?: Date;
        DisabilityTypeID?: string;
        ParentID?: string;
        Subtype?: string;
    }

    export const ProfessorComplexGetInfo = createStructureInfo<Models.ProfessorComplexGet>('Models/ProfessorComplexGet');
    export interface ProfessorComplexGet {
        ID?: string;
    }

    export const ProfessorComplexGetFunctionInfo = createFunctionInfo(ProfessorComplexGetInfo, ProfessorComplexInfo);

    export const ProfessorSubjectsComplexInfo = createStructureInfo<Models.ProfessorSubjectsComplex>('Models/ProfessorSubjectsComplex');
    export interface ProfessorSubjectsComplex {
        ID: string;
        ProfessorID?: string;
        SubjectID?: string;
    }

    export const StudentComplexGetInfo = createStructureInfo<Models.StudentComplexGet>('Models/StudentComplexGet');
    export interface StudentComplexGet {
        ID?: string;
    }

    export const StudentComplexGetFunctionInfo = createFunctionInfo(StudentComplexGetInfo, StudentComplexInfo);

    export const StudentDisabilitySubtypesComplexInfo = createStructureInfo<Models.StudentDisabilitySubtypesComplex>('Models/StudentDisabilitySubtypesComplex');
    export interface StudentDisabilitySubtypesComplex {
        ID: string;
        DisabilitySubtypeID?: string;
        StudentID?: string;
    }

    export const StudentSubjectsComplexInfo = createStructureInfo<Models.StudentSubjectsComplex>('Models/StudentSubjectsComplex');
    export interface StudentSubjectsComplex {
        ID: string;
        StudentID?: string;
        SubjectID?: string;
    }

    export const DisabilityTypeComplexSaveInfo = createStructureInfo<Models.DisabilityTypeComplexSave>('Models/DisabilityTypeComplexSave');
    export interface DisabilityTypeComplexSave {
        Item?: Models.DisabilityTypeComplex;
    }

    export const DisabilityTypeComplexSaveFunctionInfo = createFunctionInfo(DisabilityTypeComplexSaveInfo, DisabilityTypeComplexInfo);

    export const DisabilityTypeComplexComplexInfo = createComplexInfo(DisabilityTypeComplexGetFunctionInfo, DisabilityTypeComplexSaveFunctionInfo);

    export const ProfessorComplexSaveInfo = createStructureInfo<Models.ProfessorComplexSave>('Models/ProfessorComplexSave');
    export interface ProfessorComplexSave {
        Item?: Models.ProfessorComplex;
    }

    export const ProfessorComplexSaveFunctionInfo = createFunctionInfo(ProfessorComplexSaveInfo, ProfessorComplexInfo);

    export const ProfessorComplexComplexInfo = createComplexInfo(ProfessorComplexGetFunctionInfo, ProfessorComplexSaveFunctionInfo);

    export const StudentComplexSaveInfo = createStructureInfo<Models.StudentComplexSave>('Models/StudentComplexSave');
    export interface StudentComplexSave {
        Item?: Models.StudentComplex;
    }

    export const StudentComplexSaveFunctionInfo = createFunctionInfo(StudentComplexSaveInfo, StudentComplexInfo);

    export const StudentComplexComplexInfo = createComplexInfo(StudentComplexGetFunctionInfo, StudentComplexSaveFunctionInfo);
}

export namespace SimpleSPRTEmail {

    export const EmailFormatInfo = createStructureInfo<SimpleSPRTEmail.EmailFormat>('SimpleSPRTEmail/EmailFormat');
    export interface EmailFormat {
        ID: string;
        Body?: string;
        IsBodyHtml?: boolean;
        Subject?: string;
    }
}

