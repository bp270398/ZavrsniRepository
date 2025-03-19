import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { TableConfigurationBuilder, TableConfigurationParams } from '@ngx-floyd/table';
import { DocumentProcessing, Models } from '../../../../main';
import { FloydFormlyConfigurationBuilder, FloydFormlyConfigurationParams, FormState } from '@ngx-floyd/forms-formly';
import { RhetosLookupDataSource, RhetosQueryableDataSource, RhetosRest } from '@ngx-floyd/rhetos';
import { ComplexEntityDataService } from '../../../services/data-service/complex-entity-data.service';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService, PrimeIcons } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ErrorFormatterService } from '../../../services/error-formatter.service';
import { EntityComponent } from '../../shared/entity/entity.component';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { saveAs } from 'file-saver';
import { take } from 'rxjs';
import { DocumentsService } from '../../../services/documents.service';
import { UiAction } from '@ngx-floyd/core-ui';
import { FileUploadComponent } from '../../shared/file-upload/file-upload.component';
import { FileUploadEvent } from 'primeng/fileupload';
import { PERMISSION_MANAGER, PermissionManager } from '@ngx-floyd/core';
import { DownloadColumnComponent } from '../../shared/download-column/download-column.component';
import { TableComponent } from '../../shared/table/table.component';
import { USER_CONTEXT, UserContextProvider } from '../../../services/user-context.provider';
import { PdfViewerComponent } from '../../shared/pdf-viewer/pdf-viewer.component';
import { DocumentPreviewPresets } from '../../../dialogServicePresets';
import { ToolbarConfigurationParams } from '@ngx-floyd/toolbar';

@Component({
  selector: 'app-documents',
  template: `<app-entity 
  [tableConfiguration]="tableConfiguration"
  [formConfiguration]="formConfiguration"
  [dataService]="dataService"
  [searchFormConfiguration]="searchFormConfiguration"
  [entityActions]="entityActions"
  [extraEntityActions]="extraEntityActions"
  [createPermission]="'DocumentProcessing.DocumentComplexSave.Execute'"
  [deletePermission]="'DocumentProcessing.Document.Remove'"
  [deleteAction]="deleteAction"  
  [deleteDisabled]="deleteDisabled"
></app-entity>`,
})
export class DocumentsComponent implements OnInit {

  @Input() tableConfiguration!: TableConfigurationParams<DocumentProcessing.DocumentBrowse>;

  dataSource: RhetosQueryableDataSource<DocumentProcessing.DocumentBrowse>;
  contentDataSource: RhetosQueryableDataSource<DocumentProcessing.DocumentContentBrowse>;
  dataService: ComplexEntityDataService<DocumentProcessing.DocumentComplex>;
  formConfiguration!: () => FloydFormlyConfigurationParams;
  searchFormConfiguration!: () => FloydFormlyConfigurationParams;
  entityActions: UiAction[] = [];
  extraEntityActions: UiAction[] = [];
  deleteAction!: ($event: any, data?: any) => void;
  deleteDisabled?: (data?: any) => boolean;
  @ViewChild(EntityComponent) entity!: EntityComponent;
  entityToolbarConfiguration!: ToolbarConfigurationParams;
  private dynamicDialogRef?: DynamicDialogRef;
  hasEditPermission = false;

  constructor(private rhetos: RhetosRest,
    private router: Router,
    private lookupDataSource: RhetosLookupDataSource,
    protected confirmation: ConfirmationService,
    protected dynamicDialog: DialogService,
    protected message: MessageService,
    protected error: ErrorFormatterService,
    private documentService: DocumentsService,
    @Inject(PERMISSION_MANAGER) protected permissionManager: PermissionManager,
    @Inject(USER_CONTEXT) protected userContext: UserContextProvider
  ) {
    this.dataSource = new RhetosQueryableDataSource<DocumentProcessing.DocumentBrowse>(DocumentProcessing.DocumentBrowseInfo, this.rhetos);
    this.dataSource.sort('CreatedDate', 'desc')
    this.dataSource.filter()

    this.contentDataSource = new RhetosQueryableDataSource<DocumentProcessing.DocumentContentBrowse>(DocumentProcessing.DocumentContentBrowseInfo, this.rhetos);
    this.contentDataSource.sort('CreatedDate', 'desc')
    this.contentDataSource.filter()

    this.dataService = new ComplexEntityDataService(this.rhetos, DocumentProcessing.DocumentComplexComplexInfo, confirmation, dynamicDialog, message, error);
    this.permissionManager.loadUserData().subscribe(v => {
      this.hasEditPermission = this.permissionManager.hasPermission('DocumentProcessing.DocumentComplexSave.Execute');
    })

    this.dataService.onAfterLoadItem = (item: DocumentProcessing.DocumentComplex, formState) => {

      if (!this.entity || !this.entity.formlyForm)
        return { item: item, formState: formState };

      if (item.ContentControlInfos !== null && item.ContentControlInfos !== undefined) {
        const builder = new FloydFormlyConfigurationBuilder<any>();
        for (const c of item.ContentControlInfos) {
          if (!c.IsMapped) {
            if (c.IsLongString)
              builder.longString(c.ID, c.Title ?? '', conf => conf.defaultValue(c.Value).rows(6))
            else
              builder.shortString(c.ID, c.Title ?? '', conf => conf.defaultValue(c.Value))
          }
        }
        const conf = builder.getConfiguration();
        for (var field of conf.fields) {
          if (!this.entity.formlyForm.fields.some(v => v.key == field.key))
            this.entity.formlyForm.fields = [...this.entity.formlyForm.fields, field]
        }
        this.entity.formlyForm.refresh();
      }

      var hasEditPermision = this.permissionManager.hasPermission('DocumentProcessing.DocumentComplexSave.Execute');// && this.userContext.currentUser?.PrincipalID == item.CreatedByID;

      return { item: item, formState: hasEditPermision ? FormState.Edit : FormState.ReadOnly };
    }

    this.dataService.onBeforeSubmitChanges = (item: any, formState) => {

      if (!this.entity || !this.entity.formlyForm)
        return { item: item, formState: formState };

      if (item.ContentControlInfos as DocumentProcessing.DocumentContentControlInfosComplex[]) {
        for (const c of item.ContentControlInfos) {
          var value = item[c.ID] as string;
          if (value)
            c.Value = value.trim();
        }
      } else
        item.ContentControlInfos = [];

      return { item: item, formState: formState };
    }
    this.dataService.onAfterSubmitChanges = (item: any, formState) => {

      window.location.reload()

      return { item: item, formState: formState };
    }
  }


  ngOnInit(): void {
    this.tableConfiguration = this.getTableConfiguration();
    this.formConfiguration = () => this.getFormConfiguration();
    this.searchFormConfiguration = () => this.getSearchFormConfiguration();
    this.deleteAction = ($event: any, data?: any) => {
      if (this.entity.dataService && !this.entity.dataService.currentItem?.['ID']) return;

      this.confirmation.confirm({
        header: 'Trajno brisanje dokumenta',
        message: 'Jeste li sigurni da želite trajno obrisati zapis?\n Time će se trajno obrisati svi podaci o dokumentu uključujući i njegove sadržaje!',
        acceptLabel: 'Obriši',
        acceptButtonStyleClass: 'p-button-danger',
        rejectLabel: 'Odustani',
        accept: () => {
          this.rhetos.forEntity(DocumentProcessing.DocumentInfo).delete(this.entity.dataService!.currentItem!['ID']).pipe(take(1)).subscribe(() => {
            this.message.add({ summary: 'Uspješno obrisano!', severity: 'success' })
            this.entity.sidebarVisible = false;
            this.entity.tableComponent.clearSelection()
            this.entity.tableComponent.floydTable.loadCurrentPage()
          }, err => this.error.showError(err))
        }
      })
    }
    this.deleteDisabled = (data: any) => {
      return false; //return this.entity.userContext.currentUser?.PrincipalID !== data.CreatedByID;
    }
    this.extraEntityActions = [
      {
        label: 'Pregled verzija sadržaja',
        icon: PrimeIcons.HISTORY,
        showLabel: true,
        disabled: (data?: any) => data.DocumentContentID == undefined,
        action: ($event, data) => {
          if (!data.DocumentContentID)
            this.message.add({ summary: 'Ovaj dokument nema učitan sadržaj.', severity: 'info' })
          else {
            this.contentDataSource.filter([{ property: 'DocumentID', operation: 'Equals', value: data.ID }]);
            this.dynamicDialogRef = this.dynamicDialog.open(TableComponent, {
              header: 'Pregled verzija sadržaja',
              data: {
                configuration: this.getContentTableConfiguration(),
                onInit: (context: TableComponent) => context.createActionVisible = false
              }
            });
            this.dynamicDialogRef.onClose.pipe(take(1)).subscribe((value) => {
              window.location.reload()
            })
          }
        }
      },
      {
        label: 'Kreiraj iz predloška i preuzmi',
        icon: PrimeIcons.DOWNLOAD,
        showLabel: true,
        action: ($event, data) => {
          this.documentService.generateDocumentContent(data.ID!)
            .pipe(take(1))
            .subscribe(value => {
              saveAs(value.blob, value.fileName);
            }, err => this.error.showError(err))
        },
      },
      {
        label: 'Preuzmi sadržaj',
        icon: PrimeIcons.DOWNLOAD,
        disabled: (data?: any) => data.DocumentContentID == undefined,
        showLabel: true,
        action: ($event, data) => {
          this.documentService.downloadDocumentContent(data.DocumentContentID)
            .pipe(take(1))
            .subscribe(value => {
              if (data.DocumentContentExtension == '.pdf')
                this.dynamicDialog.open(PdfViewerComponent, {
                  ...DocumentPreviewPresets,
                  data: {
                    src: value.blob,
                    fileName: value.fileName,
                    fileExtension: this.entity!.dataService!.currentItem!['DocumentContentExtension']
                  }
                })
              else
                saveAs(value.blob, value.fileName);

            }, err => this.error.showError(err))
        },
      },
      {
        label: 'Učitaj sadržaj',
        icon: 'pi pi-upload',
        disabled: (data) => !this.hasEditPermission,
        showLabel: true,
        action: ($event, data) => {
          this.dynamicDialogRef = this.dynamicDialog.open(FileUploadComponent, {
            header: 'Učitavanje sadržaja',
            data: {
              multiple: false,
              accept: '.doc, .docx, .pdf,image/*',
              onUploaded: (event: FileUploadEvent, context: FileUploadComponent) => {
                var file = event.files[0];
                if (file)
                  this.documentService.uploadDocument(file, data.ID)
                    .subscribe(v => {
                      this.dynamicDialogRef?.close();
                      this.entity.tableComponent.floydTable.loadCurrentPage()
                      this.entity.loadItem(data.ID)
                    }, err => this.error.showError(err))
              }
            }
          });
        },
      }];
  }

  getContentTableConfiguration(): TableConfigurationParams<DocumentProcessing.DocumentContentBrowse> {
    const builder = new TableConfigurationBuilder<DocumentProcessing.DocumentContentBrowse>(this.permissionManager);
    builder
      .id('document-content-table')
      .dataSource(this.contentDataSource)
      .addComponentColumn('Sadržaj', DownloadColumnComponent,
        (instance: DownloadColumnComponent, data: DocumentProcessing.DocumentContentBrowse) => {
          if (!data.ID) return;
          instance.documentContentId = data.ID;
          instance.documentExtension = data.FileExtension;
        })
      .addColumn('CreatedByFullName', 'Kreirao')
      .addColumn('CreatedDateString', 'Datum kreiranja')
      .ifHasPermission('DocumentProcessing.DocumentContent.Remove', c => c
        .addAction('Obriši sadržaj', PrimeIcons.TRASH, ($event: any, row: DocumentProcessing.DocumentContentBrowse) => {
          this.confirmation.confirm({
            header: 'Trajno brisanje sadržaja',
            message: 'Jeste li sigurni da želite trajno obrisati sadržaj?',
            acceptLabel: 'Obriši',
            acceptButtonStyleClass: 'p-button-danger',
            rejectLabel: 'Odustani',
            accept: () => {
              this.rhetos.forEntity(DocumentProcessing.DocumentContentInfo).delete(row.ID).pipe(take(1)).subscribe(() => {
                if (this.dynamicDialogRef) {
                  (this.dynamicDialog.dialogComponentRefMap.get(this.dynamicDialogRef)?.instance.componentRef?.instance as TableComponent)?.floydTable.loadCurrentPage();
                }
                this.message.add({ summary: 'Uspješno obrisano!', severity: 'success' })
                this.entity.loadItem(row.ID)
                this.entity.tableComponent.floydTable.loadCurrentPage()

              }, err => this.error.showError(err))
            }
          })
        }, c => c.type('danger'))
      )

    return builder.getConfiguration();
  }

  getTableConfiguration(): TableConfigurationParams<DocumentProcessing.DocumentBrowse> {

    const builder = new TableConfigurationBuilder<DocumentProcessing.DocumentBrowse>();
    builder
      .id('document-table')
      .dataSource(this.dataSource)
      .selectionType('single')
      .addComponentColumn('Sadržaj', DownloadColumnComponent,
        (instance: DownloadColumnComponent, data: DocumentProcessing.DocumentBrowse) => {
          if (!data.DocumentContentID) return;
          instance.documentContentId = data.DocumentContentID;
          instance.documentExtension = data.FileExtension;
        })
      .addColumn('DocumentTemplateType', 'Vrsta')
      .addColumn('StudentFullNameAndGrade', 'Učenik')
      .addColumn('ProfessorFullName', 'Učitelj')
      .addColumn('SubjectTitle', 'Predmet')
      .addColumn('CreatedDateString', 'Datum kreiranja')
    //.addColumn('SkolskaGodina', 'Školska godina')
    return builder.getConfiguration();
  }

  getFormConfiguration(): FloydFormlyConfigurationParams {
    var studentChanged = false;
    const builder = new FloydFormlyConfigurationBuilder<any>();
    builder
      .autoComplete('DocumentTemplateID', 'Predložak', c => c
        .required()
        .showDropdown()
        .dataSource(() =>
          this.lookupDataSource
            .forQueryable(DocumentProcessing.DocumentTemplateBrowseInfo)
            .initialFilter([{ property: 'Active', operation: 'Equals', value: true }, { property: 'DocumentTemplateContentID', operation: 'NotEquals', value: undefined }])
            .valueField('ID')
            .displayField('DocumentType')
            .autocompleteSearchFn((query, value) => query.where('DocumentType', 'Contains', value))
            .dataSource())
        .onChange((field: FormlyFieldConfig) => {
          if (FormState.New == this.entity.formlyForm?.formState) {
            if (field.props)
              field.props.disabled = false;
          }
          if (FormState.Edit == this.entity.formlyForm?.formState) {
            if (field.props)
              field.props.disabled = true;
          }
        })
      )
      .autoComplete('CreatedByID', 'Kreirao', c => c
        .required()
        .disable(true)
        .dataSource(() =>
          this.lookupDataSource
            .forQueryable(Models.ProfessorExtendedInfo)
            .valueField('ID')
            .displayField('FullName')
            .autocompleteSearchFn((query, value) => query.where('FullName', 'Contains', value))
            .dataSource())
        .addAction('Pregled učitelja', PrimeIcons.LINK, ($event: any, data?: any) => {
          if (this.entity.dataService?.currentItem) {
            const url = this.router.serializeUrl(
              this.router.createUrlTree(['/ucitelji'], { queryParams: { id: this.entity.dataService.currentItem['CreatedByID'] } })
            );
            window.open(url, '_blank');
          }
        }, c => c.showLabel(false)
        )
        .hideExpression((model: any, formState: any, field?: FormlyFieldConfig) => formState == FormState.New)
      )
      .autoComplete('StudentID', 'Učenik', c => c
        .required()
        .dataSource(() =>
          this.lookupDataSource
            .forQueryable(Models.StudentBrowseInfo)
            .initialFilter([{ property: 'Active', operation: 'Equals', value: true }])
            .valueField('ID')
            .displayField('FullNameAndGrade')
            .autocompleteSearchFn((query, value) => query.where('FullNameAndGrade', 'Contains', value))
            .dataSource())
        .onChange((field: FormlyFieldConfig) => {
          if (FormState.New == this.entity.formlyForm?.formState) {
            if (field.props)
              field.props.disabled = false;
          }
          if (FormState.Edit == this.entity.formlyForm?.formState && this.entity.dataService?.currentItem) {
            if (this.entity.dataService.currentItem['StudentID'] != this.entity.dataService.originalItem!['StudentID'])
              studentChanged = true;
            else studentChanged = false;
          }
        })
        .addAction('Pregled učenika', PrimeIcons.LINK, ($event: any, data?: any) => {
          if (this.entity.dataService?.currentItem) {
            const url = this.router.serializeUrl(
              this.router.createUrlTree(['/ucenici'], { queryParams: { id: this.entity.dataService.currentItem['StudentID'] } })
            );
            window.open(url, '_blank');
          }
        }, c => c
          .showLabel(false)
          .visible((row: any) => this.dataService.formState !== FormState.New && !studentChanged)
        )
      )
      .autoComplete('SubjectID', 'Predmet', c => c
        .hideExpression((model: DocumentProcessing.DocumentComplex, formState: any, field?: FormlyFieldConfig) =>
          model.DocumentTemplateID == '8c8f1986-31f9-49ab-b8a8-46e44099ef31' // izjava za roditelje 
          || model.StudentID == undefined
        )
        .showDropdown()
        .dataSource(() =>
          this.lookupDataSource
            .forQueryable(Models.SubjectInfo)
            .initialFilter([{ property: 'Active', operation: 'Equals', value: true }])
            .valueField('ID')
            .displayField('Title')
            .autocompleteSearchFn((query, value) => query
              .where('Title', 'Contains', value)
              .filterBy(Models.CurrentProfessorIsTeachingSubjectInfo)
              .filterBy(Models.StudentIsEnrolledInSubjectInfo, { StudentID: this.entity.formlyForm?.model.StudentID }))
            .dataSource())
      )
    return builder.getConfiguration();
  }

  getSearchFormConfiguration(): FloydFormlyConfigurationParams {
    const builder = new FloydFormlyConfigurationBuilder<any>();
    builder
      .multiSelectAutoComplete('StudentID', 'Učenik', c => c
        .dataSource(() =>
          this.lookupDataSource
            .forQueryable<Models.StudentBrowse>(Models.StudentBrowseInfo)
            .valueField('ID')
            .displayField('FullNameAndGrade')
            .autocompleteSearchFn((query, value) => query.where('FullNameAndGrade', 'Contains', value))
            .dataSource())
      )
      .multiSelectAutoComplete('CreatedByID', 'Kreirao', c => c
        .dataSource(() =>
          this.lookupDataSource
            .forQueryable(Models.ProfessorExtendedInfo)
            .valueField('ID')
            .displayField('FullName')
            .autocompleteSearchFn((query, value) => query.where('FullName', 'Contains', value))
            .dataSource())
      )
      .multiSelectDropdown('SubjectID', 'Predmet', c => c
        .dataSource(() =>
          this.lookupDataSource
            .forQueryable<Models.Subject>(Models.SubjectInfo)
            .valueField('ID')
            .displayField('Title')
            .autocompleteSearchFn((query, value) => query.where('Title', 'Contains', value))
            .dataSource())
      )
      .multiSelectDropdown('DocumentTemplateID', 'Vrsta', c => c
        .dataSource(() =>
          this.lookupDataSource
            .forQueryable<DocumentProcessing.DocumentTemplateBrowse>(DocumentProcessing.DocumentTemplateBrowseInfo)
            .valueField('ID')
            .displayField('DocumentType')
            .autocompleteSearchFn((query, value) => query.where('DocumentType', 'Contains', value))
            .dataSource())
      )

    return builder.getConfiguration();
  }
}
