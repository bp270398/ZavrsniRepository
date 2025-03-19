import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FloydFormlyConfigurationParams, FormState, FloydFormlyConfigurationBuilder } from '@ngx-floyd/forms-formly';
import { RhetosQueryableDataSource, RhetosRest, RhetosLookupDataSource } from '@ngx-floyd/rhetos';
import { TableConfigurationParams, TableConfigurationBuilder } from '@ngx-floyd/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Models } from '../../../../main';
import { EntityDataService } from '../../../services/data-service/entity-data.service';
import { ErrorFormatterService } from '../../../services/error-formatter.service';
import { EntityComponent } from '../../shared/entity/entity.component';
import { PERMISSION_MANAGER, PermissionManager } from '@ngx-floyd/core';
import { UiAction } from '@ngx-floyd/core-ui';

@Component({
  selector: 'app-education-locations',
  template: `<app-entity
    [tableConfiguration]="tableConfiguration"
    [formConfiguration]="formConfiguration"
    [dataService]="dataService"
    [selectedTitleFn]="selectedTitleFn"
    [createPermission]="'Models.EducationLocation.New'"
    [deletePermission]="'Models.EducationLocation.Remove'"
    [deleteAction]="deleteAction"
  ></app-entity>`,
})
export class EducationLocationsComponent implements OnInit {

  @Input() tableConfiguration!: TableConfigurationParams<Models.EducationLocation>;

  dataSource: RhetosQueryableDataSource<Models.EducationLocation>;
  dataService: EntityDataService<Models.EducationLocation>;
  formConfiguration!: () => FloydFormlyConfigurationParams;
  selectedTitleFn = (entity: any) => entity.Location;
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
    this.dataSource = new RhetosQueryableDataSource<Models.EducationLocation>(Models.EducationLocationInfo, this.rhetos);
    this.dataSource.sort('Active', 'desc')

    this.dataService = new EntityDataService(this.rhetos, Models.EducationLocationInfo, confirmation, dynamicDialog, message, error);

    this.dataService.onAfterLoadItem = (item: any, formState) => {

      return { item: item, formState: this.permissionManager.hasPermission('Models.EducationLocation.Edit') ? FormState.Edit : FormState.ReadOnly };
    }
  }


  ngOnInit(): void {
    this.tableConfiguration = this.getTableConfiguration();
    this.formConfiguration = () => this.getFormConfiguration();
    this.deleteAction = ($event: any, data?: any) => {
      if (this.entity.dataService && !this.entity.dataService.currentItem?.['ID']) return;

      this.confirmation.confirm({
        header: 'Trajno brisanje lokacije primjerenog oblika školovanja',
        message: 'Jeste li sigurni da želite trajno obrisati zapis?',
        acceptLabel: 'Obriši',
        acceptButtonStyleClass: 'p-button-danger',
        rejectLabel: 'Odustani',
        accept: () => {
          this.rhetos.forEntity(Models.EducationLocationInfo).delete(this.entity.dataService!.currentItem!['ID']).subscribe(() => {
            this.message.add({ summary: 'Uspješno obrisano!', severity: 'success' })
            this.entity.sidebarVisible = false;
            this.entity.tableComponent?.clearSelection()
            this.entity.tableComponent?.floydTable.loadCurrentPage()
          }, err => this.error.showError(err))
        }
      })
    }
  }

  getTableConfiguration(): TableConfigurationParams<Models.EducationLocation> {

    const builder = new TableConfigurationBuilder<Models.EducationLocation>();
    builder
      .id('education-locations-table')
      .selectionType('single')
      .dataSource(this.dataSource)
      .rowStyleClass((row: Models.EducationLocation) => row.Active ? '' : 'deactivated')
      .addColumn('Location', 'Naziv')

    return builder.getConfiguration();
  }

  getFormConfiguration(): FloydFormlyConfigurationParams {

    const builder = new FloydFormlyConfigurationBuilder<Models.EducationLocation>();
    builder
      .longString('Location', 'Naziv', c => c.required())
      .boolSwitch('Active', 'U upotrebi', c => c.defaultValue(true))

    return builder.getConfiguration();
  }

}
