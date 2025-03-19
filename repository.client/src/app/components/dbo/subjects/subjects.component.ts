import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FloydFormlyConfigurationBuilder, FloydFormlyConfigurationParams, FormState } from '@ngx-floyd/forms-formly';
import { RhetosLookupDataSource, RhetosQueryableDataSource, RhetosRest } from '@ngx-floyd/rhetos';
import { TableConfigurationBuilder, TableConfigurationParams } from '@ngx-floyd/table';
import { Models } from '../../../../main';
import { EntityComponent } from '../../shared/entity/entity.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ErrorFormatterService } from '../../../services/error-formatter.service';
import { EntityDataService } from '../../../services/data-service/entity-data.service';
import { PERMISSION_MANAGER, PermissionManager } from '@ngx-floyd/core';

@Component({
  selector: 'app-subjects',
  template: `<app-entity
    [tableConfiguration]="tableConfiguration"
    [formConfiguration]="formConfiguration"
    [dataService]="dataService"
    [selectedTitleFn]="selectedTitleFn"
    [createPermission]="'Models.Subject.New'"
    [deletePermission]="'Models.Subject.Remove'"
    [deleteAction]="deleteAction"  
 ></app-entity>`,
})
export class SubjectsComponent implements OnInit {

  @Input() tableConfiguration!: TableConfigurationParams<Models.SubjectBrowse>;

  dataSource: RhetosQueryableDataSource<Models.SubjectBrowse>;
  dataService: EntityDataService<Models.Subject>;
  formConfiguration!: () => FloydFormlyConfigurationParams;
  selectedTitleFn = (entity: any) => entity.Title;
  deleteAction!: ($event: any, data?: any) => void;

  @ViewChild(EntityComponent) entity!: EntityComponent;

  constructor(protected rhetos: RhetosRest,
    protected lookupDataSource: RhetosLookupDataSource,
    protected confirmation: ConfirmationService,
    protected dynamicDialog: DialogService,
    protected message: MessageService,
    protected error: ErrorFormatterService,
    @Inject(PERMISSION_MANAGER) protected permissionManager: PermissionManager
  ) {
    this.dataSource = new RhetosQueryableDataSource<Models.SubjectBrowse>(Models.SubjectBrowseInfo, this.rhetos);
    this.dataSource.sort('Active', 'desc')

    this.dataService = new EntityDataService(this.rhetos, Models.SubjectInfo, confirmation, dynamicDialog, message, error);
    this.dataService.onAfterLoadItem = (item: any, formState) => {
      return { item: item, formState: this.permissionManager.hasPermission('Models.Subject.Edit') ? FormState.Edit : FormState.ReadOnly };
    }
  }

  ngOnInit(): void {
    this.tableConfiguration = this.getTableConfiguration();
    this.formConfiguration = () => this.getFormConfiguration();
    this.deleteAction = ($event: any, data?: any) => {
      if (this.entity.dataService && !this.entity.dataService.currentItem?.['ID']) return;

      this.confirmation.confirm({
        header: 'Trajno brisanje sadržaja',
        message: 'Jeste li sigurni da želite trajno obrisati zapis?',
        acceptLabel: 'Obriši',
        rejectLabel: 'Odustani',
        acceptButtonStyleClass: 'p-button-danger',
        accept: () => {
          this.rhetos.forEntity(Models.SubjectInfo).delete(this.entity.dataService!.currentItem!['ID']).subscribe(() => {
            this.message.add({ summary: 'Uspješno obrisano!', severity: 'success' })
            this.entity.tableComponent.clearSelection()
            this.entity.tableComponent.floydTable.loadCurrentPage()
          }, err => this.error.showError(err))
        }
      })
    }
  }

  getTableConfiguration(): TableConfigurationParams<Models.SubjectBrowse> {

    const builder = new TableConfigurationBuilder<Models.SubjectBrowse>();
    builder
      .id('subjects-table')
      .selectionType('single')
      .dataSource(this.dataSource)
      .rowStyleClass((row: Models.SubjectBrowse) => row.Active ? '' : 'deactivated')
      .addColumn('Title', 'Naziv')
      .addColumn('Professors', 'Učitelji')

    return builder.getConfiguration();
  }

  getFormConfiguration(): FloydFormlyConfigurationParams {

    const builder = new FloydFormlyConfigurationBuilder<Models.Subject>();
    builder
      .shortString('Title', 'Naziv', c => c.required())
      .boolSwitch('Active', 'U upotrebi', c => c.defaultValue(true))

    return builder.getConfiguration();
  }

}
