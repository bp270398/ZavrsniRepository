import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FloydFormlyConfigurationParams, FormState, FloydFormlyConfigurationBuilder } from '@ngx-floyd/forms-formly';
import { RhetosQueryableDataSource, RhetosRest, RhetosLookupDataSource } from '@ngx-floyd/rhetos';
import { TableConfigurationParams, TableConfigurationBuilder } from '@ngx-floyd/table';
import { ConfirmationService, MessageService, PrimeIcons } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DocumentProcessing } from '../../../../main';
import { EntityDataService } from '../../../services/data-service/entity-data.service';
import { ErrorFormatterService } from '../../../services/error-formatter.service';
import { EntityComponent } from '../../shared/entity/entity.component';
import { DocumentsService } from '../../../services/documents.service';
import { take } from 'rxjs';
import { saveAs } from 'file-saver';
import { UiAction } from '@ngx-floyd/core-ui';
import { FileUploadEvent } from 'primeng/fileupload';
import { FileUploadComponent } from '../../shared/file-upload/file-upload.component';
import { PERMISSION_MANAGER, PermissionManager } from '@ngx-floyd/core';
import { DownloadColumnComponent } from '../../shared/download-column/download-column.component';
import { TableComponent } from '../../shared/table/table.component';

@Component({
  selector: 'app-document-templates',
  template: `<app-entity
    [tableConfiguration]="tableConfiguration"
    [formConfiguration]="formConfiguration"
    [dataService]="dataService"
    [selectedTitleFn]="selectedTitleFn"
    [extraEntityActions]="extraEntityActions"
    [entityActions]="entityActions"
    [createPermission]="'DocumentProcessing.DocumentTemplate.New'"
    [deletePermission]="'DocumentProcessing.DocumentTemplate.Remove'"
    [deleteAction]="deleteAction"  
  ></app-entity>`,
})
export class DocumentTemplatesComponent implements OnInit {

  @Input() tableConfiguration!: TableConfigurationParams<DocumentProcessing.DocumentTemplateBrowse>;
  dataSource: RhetosQueryableDataSource<DocumentProcessing.DocumentTemplateBrowse>;
  contentDataSource: RhetosQueryableDataSource<DocumentProcessing.DocumentTemplateContentBrowse>;
  dataService: EntityDataService<DocumentProcessing.DocumentTemplate>;
  formConfiguration!: () => FloydFormlyConfigurationParams;
  searchFormConfiguration!: () => FloydFormlyConfigurationParams;
  selectedTitleFn = (entity: any) => entity.DocumentType;
  onSearchFormSubmit?: (model: any, formState: FormState) => { model: any, formState: FormState };

  entityActions: UiAction[] = [];
  deleteAction!: ($event: any, data?: any) => void;
  extraEntityActions: UiAction[] = [];
  private dynamicDialogRef?: DynamicDialogRef;

  @ViewChild(EntityComponent) entity!: EntityComponent;

  constructor(protected rhetos: RhetosRest,
    private router: Router,
    protected lookupDataSource: RhetosLookupDataSource,
    protected confirmation: ConfirmationService,
    protected dynamicDialog: DialogService,
    protected message: MessageService,
    protected error: ErrorFormatterService,
    private documentService: DocumentsService,
    @Inject(PERMISSION_MANAGER) protected permissionManager: PermissionManager
  ) {
    this.dataSource = new RhetosQueryableDataSource<DocumentProcessing.DocumentTemplateBrowse>(DocumentProcessing.DocumentTemplateBrowseInfo, this.rhetos);
    this.dataSource.sort('CreatedDate', 'desc')

    this.contentDataSource = new RhetosQueryableDataSource<DocumentProcessing.DocumentTemplateContentBrowse>(DocumentProcessing.DocumentTemplateContentBrowseInfo, this.rhetos);
    this.contentDataSource.sort('CreatedDate', 'desc')
    this.contentDataSource.filter()

    this.dataService = new EntityDataService(this.rhetos, DocumentProcessing.DocumentTemplateInfo, confirmation, dynamicDialog, message, error);

    this.dataService.onAfterLoadItem = (item: any, formState) => {
      return { item: item, formState: this.permissionManager.hasPermission('DocumentProcessing.DocumentTemplate.Edit') ? FormState.Edit : FormState.ReadOnly };
    }
  }


  ngOnInit(): void {
    this.tableConfiguration = this.getTableConfiguration();
    this.formConfiguration = () => this.getFormConfiguration();
    this.deleteAction = ($event: any, data?: any) => {
      if (this.entity.dataService && !this.entity.dataService.currentItem?.['ID']) return;

      this.confirmation.confirm({
        header: 'Trajno brisanje predloška',
        message: 'Jeste li sigurni da želite trajno obrisati zapis?\n Time će se trajno obrisati svi podaci o predlošku uključujući i njegove sadržaje!',
        acceptLabel: 'Obriši',
        acceptButtonStyleClass: 'p-button-danger',
        rejectLabel: 'Odustani',
        accept: () => {
          this.rhetos.forEntity(DocumentProcessing.DocumentTemplateInfo).delete(this.entity.dataService!.currentItem!['ID']).pipe(take(1)).subscribe(() => {
            this.message.add({ summary: 'Uspješno obrisano!', severity: 'success' })
            this.entity.sidebarVisible = false;
            this.entity.tableComponent.clearSelection()
            this.entity.tableComponent.floydTable.loadCurrentPage()
          }, err => this.error.showError(err))
        }
      })
    }
    this.extraEntityActions = [{
      label: 'Pregled verzija sadržaja',
      icon: PrimeIcons.HISTORY,
      visible: (data?: any) => data.DocumentContentID !== undefined,
      showLabel: true,
      action: ($event, data) => {
        this.contentDataSource.filter([{ property: 'DocumentTemplateID', operation: 'Equals', value: data.ID }]);
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
      },
    },
    {
      label: 'Preuzmi sadržaj',
      icon: PrimeIcons.DOWNLOAD,
      visible: (data?: any) => data.DocumentContentID !== undefined,
      showLabel: true,
      action: ($event, data) => {
        if (!this.dataService.currentItem) return;
        this.documentService.downloadDocumentTemplateContent(this.entity.tableComponent.floydTable.selection.DocumentTemplateContentID)
          .pipe(take(1))
          .subscribe(value => {
            saveAs(value.blob, value.fileName);
          })
      },
    },
    {
      label: 'Učitaj sadržaj',
      icon: 'pi pi-upload',
      showLabel: true,
      action: ($event, data) => {
        this.dynamicDialogRef = this.dynamicDialog.open(FileUploadComponent, {
          header: 'Učitavanje sadržaja',
          data: {
            multiple: false,
            accept: '.doc, .docx',
            onUploaded: (event: FileUploadEvent, context: FileUploadComponent) => {
              var file = event.files[0];
              if (file && this.dataService.currentItem?.ID)
                this.documentService.uploadDocumentTemplate(file, this.dataService.currentItem?.ID)
                  .subscribe(v => {
                    this.dynamicDialogRef?.close();
                    this.entity.tableComponent.floydTable.loadCurrentPage()
                    // TODO test
                    //executeAsync(() => window.location.reload(), 1000)
                  })
            }
          }
        });
      },
    }];
  }

  getTableConfiguration(): TableConfigurationParams<DocumentProcessing.DocumentTemplateBrowse> {
    const builder = new TableConfigurationBuilder<DocumentProcessing.DocumentTemplateBrowse>();
    builder
      .id('document-templates-table')
      .selectionType('single')
      .dataSource(this.dataSource)
      .rowStyleClass((row: DocumentProcessing.DocumentTemplateBrowse) => row.Active ? '' : 'deactivated')
      .addComponentColumn('Sadržaj', DownloadColumnComponent,
        (instance: DownloadColumnComponent, data: DocumentProcessing.DocumentTemplateBrowse) => {
          if (!data.DocumentTemplateContentID) return;
          instance.isDocumentTemplate = true;
          instance.documentContentId = data.DocumentTemplateContentID;
          instance.documentExtension = data.FileExtension;
        })
      .addColumn('DocumentType', 'Naziv')
      .addColumn('ProfessorFullName', 'Kreirao')
      .addColumn('CreatedDateString', 'Datum kreiranja')

    return builder.getConfiguration();
  }

  getFormConfiguration(): FloydFormlyConfigurationParams {
    const builder = new FloydFormlyConfigurationBuilder<DocumentProcessing.DocumentTemplate>();
    builder
      .shortString('DocumentType', 'Naziv', c => c.required())
      .boolSwitch('Active', 'U upotrebi', c => c.defaultValue(true))
    return builder.getConfiguration();
  }

  getContentTableConfiguration(): TableConfigurationParams<DocumentProcessing.DocumentTemplateContentBrowse> {
    const builder = new TableConfigurationBuilder<DocumentProcessing.DocumentTemplateContentBrowse>();
    builder
      .id('document-content-table')
      .dataSource(this.contentDataSource)
      .addComponentColumn('Sadržaj', DownloadColumnComponent,
        (instance: DownloadColumnComponent, data: DocumentProcessing.DocumentTemplateContentBrowse) => {
          if (!data.ID) return;
          instance.isDocumentTemplate = true;
          instance.documentContentId = data.ID;
          instance.documentExtension = data.FileExtension;
        })
      .addColumn('CreatedByFullName', 'Kreirao')
      .addColumn('CreatedDateString', 'Datum kreiranja')
      .addAction('Obriši sadržaj', PrimeIcons.TRASH, ($event: any, row: DocumentProcessing.DocumentContentBrowse) => {
        this.confirmation.confirm({
          header: 'Trajno brisanje sadržaja',
          message: 'Jeste li sigurni da želite trajno obrisati sadržaj?',
          acceptButtonStyleClass: 'p-button-danger',
          acceptLabel: 'Obriši',
          rejectLabel: 'Odustani',
          accept: () => {
            this.rhetos.forEntity(DocumentProcessing.DocumentTemplateContentInfo).delete(row.ID).subscribe(() => {
              if (this.dynamicDialogRef) {
                // TODO success message
                (this.dynamicDialog.dialogComponentRefMap.get(this.dynamicDialogRef)?.instance.componentRef?.instance as TableComponent)?.floydTable.loadCurrentPage();
                this.entity.tableComponent.floydTable.loadCurrentPage()

              }
              this.entity.loadItem(row.ID)
            }, err => this.error.showError(err))
          }
        })
      }, c => c.type('danger'))

    return builder.getConfiguration();
  }


}
