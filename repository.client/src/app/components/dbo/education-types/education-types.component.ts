import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FloydFormlyConfigurationParams, FloydFormlyConfigurationBuilder, FormState } from '@ngx-floyd/forms-formly';
import { RhetosQueryableDataSource, RhetosRest, RhetosLookupDataSource } from '@ngx-floyd/rhetos';
import { TableConfigurationParams, TableConfigurationBuilder } from '@ngx-floyd/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Models } from '../../../../main';
import { EntityDataService } from '../../../services/data-service/entity-data.service';
import { ErrorFormatterService } from '../../../services/error-formatter.service';
import { EntityComponent } from '../../shared/entity/entity.component';

@Component({
  selector: 'app-education-types',
  template: `<app-entity
    [tableConfiguration]="tableConfiguration"
    [formConfiguration]="formConfiguration"
    [dataService]="dataService"
    [selectedTitleFn]="selectedTitleFn"
    [createPermission]="'Models.EducationType.New'"
    [deletePermission]="'Models.EducationType.Remove'"
    [deleteAction]="deleteAction"
  ></app-entity>`,
})
export class EducationTypesComponent implements OnInit {

  @Input() tableConfiguration!: TableConfigurationParams<Models.EducationType>;

  dataSource: RhetosQueryableDataSource<Models.EducationType>;
  dataService: EntityDataService<Models.EducationType>;
  formConfiguration!: () => FloydFormlyConfigurationParams;
  selectedTitleFn = (entity: any) => entity.Type;
  deleteAction!: ($event: any, data?: any) => void;

  @ViewChild(EntityComponent) entity!: EntityComponent;

  constructor(protected rhetos: RhetosRest,
    protected lookupDataSource: RhetosLookupDataSource,
    protected confirmation: ConfirmationService,
    protected dynamicDialog: DialogService,
    protected message: MessageService,
    protected error: ErrorFormatterService
  ) {
    this.dataSource = new RhetosQueryableDataSource<Models.EducationType>(Models.EducationTypeInfo, this.rhetos);
    this.dataSource.sort('Active', 'desc')

    this.dataService = new EntityDataService(this.rhetos, Models.EducationTypeInfo, confirmation, dynamicDialog, message, error);

    this.dataService.onAfterLoadItem = (item: any, formState) => {
      return { item: item, formState: this.entity.permissionManager.hasPermission('Models.EducationType.Edit') ? FormState.Edit : FormState.ReadOnly };
    }
  }

  ngOnInit(): void {
    this.tableConfiguration = this.getTableConfiguration();
    this.formConfiguration = () => this.getFormConfiguration();
    this.deleteAction = ($event: any, data?: any) => {
      if (this.entity.dataService && !this.entity.dataService.currentItem?.['ID']) return;

      this.confirmation.confirm({
        header: 'Trajno brisanje vrste primjerenog oblika školovanja',
        message: 'Jeste li sigurni da želite trajno obrisati zapis?',
        acceptLabel: 'Obriši',
        acceptButtonStyleClass: 'p-button-danger',
        rejectLabel: 'Odustani',
        accept: () => {
          this.rhetos.forEntity(Models.EducationTypeInfo).delete(this.entity.dataService!.currentItem!['ID']).subscribe(() => {
            this.message.add({ summary: 'Uspješno obrisano!', severity: 'success' })
            this.entity.sidebarVisible = false;
            this.entity.tableComponent.clearSelection()
            this.entity.tableComponent.floydTable.loadCurrentPage()
          }, err => this.error.showError(err))
        }
      })
    }
  }

  getTableConfiguration(): TableConfigurationParams<Models.EducationType> {

    const builder = new TableConfigurationBuilder<Models.EducationType>();
    builder
      .id('education-types-table')
      .selectionType('single')
      .dataSource(this.dataSource)
      .rowStyleClass((row: Models.EducationType) => row.Active ? '' : 'deactivated')
      .addColumn('Type', 'Naziv')

    return builder.getConfiguration();
  }

  getFormConfiguration(): FloydFormlyConfigurationParams {

    const builder = new FloydFormlyConfigurationBuilder<Models.EducationType>();
    builder
      .longString('Type', 'Naziv', c => c.required())
      .boolSwitch('Active', 'U upotrebi', c => c.defaultValue(true))

    return builder.getConfiguration();
  }

}
