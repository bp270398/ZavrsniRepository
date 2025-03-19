import { ChangeDetectorRef, Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FloydFormlyConfigurationParams, FloydFormlyConfigurationBuilder, FormState } from '@ngx-floyd/forms-formly';
import { RhetosQueryableDataSource, RhetosRest, RhetosLookupDataSource, RhetosQueryParams, GenericFilter } from '@ngx-floyd/rhetos';
import { TableConfigurationBuilder, TableConfigurationParams } from '@ngx-floyd/table';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Common, DocumentProcessing, Models } from '../../../../main';
import { ErrorFormatterService } from '../../../services/error-formatter.service';
import { EntityComponent } from '../../shared/entity/entity.component';
import { ComplexEntityDataService } from '../../../services/data-service/complex-entity-data.service';
import { mapFromMultiselect, mapToMultiselect } from '../../../extension.methods';
import { UiAction } from '@ngx-floyd/core-ui';
import { AuthService } from '../../../services/auth.service';
import { PERMISSION_MANAGER, PermissionManager } from '@ngx-floyd/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { FormlyFieldConfig } from '@ngx-formly/core';

export interface ProfessorComplexExtended extends Models.ProfessorComplex {
  subjectIds: string[];
  roleIds: string[];
  sendPasswordResetEmail: boolean;
}

@Component({
  selector: 'app-professors',
  template: `<app-entity
    [tableConfiguration]="tableConfiguration"
    [formConfiguration]="formConfiguration"
    [dataService]="dataService"
    [selectedTitleFn]="selectedTitleFn"
    [entityActions]="entityActions"
    [extraEntityActions]="extraEntityActions"
    [createPermission]="'Models.ProfessorComplexSave.Execute'"
    [deletePermission]="'Models.Professor.Remove'"
    [deleteAction]="deleteAction"  
  ></app-entity>`,
})
export class ProfessorsComponent implements OnInit {
  @Input() tableConfiguration!: TableConfigurationParams<Models.ProfessorBrowse>;

  dataSource: RhetosQueryableDataSource<Models.ProfessorBrowse>;
  dataService: ComplexEntityDataService<Models.ProfessorComplex>;
  formConfiguration!: () => FloydFormlyConfigurationParams;
  selectedTitleFn = (entity: Models.ProfessorComplex) => entity.FirstName + ' ' + entity.LastName;

  entityActions: UiAction[] = []
  deleteAction!: ($event: any, data?: any) => void;
  extraEntityActions: UiAction[] = [];

  hasPermission = false;

  @ViewChild(EntityComponent) entity!: EntityComponent;

  constructor(protected rhetos: RhetosRest,
    protected lookupDataSource: RhetosLookupDataSource,
    protected confirmation: ConfirmationService,
    protected dynamicDialog: DialogService,
    protected message: MessageService,
    protected error: ErrorFormatterService,
    private authService: AuthService,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    @Inject(PERMISSION_MANAGER) public permissionManager: PermissionManager
  ) {
    this.dataSource = new RhetosQueryableDataSource<Models.ProfessorBrowse>(Models.ProfessorBrowseInfo, this.rhetos);
    this.dataSource.sort('Active', 'desc')

    this.dataService = new ComplexEntityDataService(this.rhetos, Models.ProfessorComplexComplexInfo, confirmation, dynamicDialog, message, error);

    this.dataService.onAfterLoadItem = (item: Models.ProfessorComplex, formState) => {
      var i = (item as ProfessorComplexExtended);
      i.subjectIds = mapToMultiselect(item.Subjects, 'SubjectID');
      i.roleIds = mapToMultiselect(item.PrincipalHasRoles, 'RoleID');

      return { item: i, formState: this.permissionManager.hasPermission('Models.ProfessorComplexSave.Execute') ? FormState.Edit : FormState.ReadOnly };
    }

    this.dataService.onBeforeSubmitChanges = (item: ProfessorComplexExtended, formState) => {

      item.Subjects = mapFromMultiselect(item.Subjects ?? [], 'SubjectID', item.subjectIds ?? []);
      item.PrincipalHasRoles = mapFromMultiselect(item.PrincipalHasRoles ?? [], 'RoleID', item.roleIds ?? []);
      if (item.sendPasswordResetEmail == true) {
        var email = this.dataService.originalItem?.Principal?.Email;
        if (email)
          this.authService.sendResetPasswordEmail(email)
            .subscribe(
              (result) => {
                this.message.add({ severity: 'success', summary: `Poslana je poveznica za postavljanje lozinke na adresu ${this.dataService.originalItem?.Principal?.Email}` })
              },
              (err) => this.error.showError(err)
            );
      }
      return { item: item, formState: formState }
    }

    this.permissionManager.loadUserData().subscribe(() => {

      this.cdRef.detectChanges();
      if (this.permissionManager.hasPermission('Models.ProfessorComplexSave.Execute') && this.permissionManager.hasPermission('Common.Role.Read'))
        this.extraEntityActions = [{
          label: 'Pošalji poveznicu za postavljanje lozinke',
          visible: (data?: any) => this.hasPermission && data.Principal && data.Principal.Email !== undefined,
          showLabel: true,
          icon: '',
          action: ($event, data) => {
            this.message.add({ severity: 'danger', summary: `Email je obavezan podatak za izvršavanje ove akcije.` })
            var email = this.dataService.originalItem?.Principal?.Email;
            if (email)
              this.authService.sendResetPasswordEmail(email)
                .subscribe(
                  (result) => {
                    this.message.add({ severity: 'success', summary: `Poslana je poveznica za postavljanje lozinke na adresu ${this.dataService.originalItem?.Principal?.Email}` })
                  },
                  (err) => this.error.showError(err)
                );
          },
        }];


      if (this.permissionManager.hasPermission('Models.ProfessorComplexSave.Execute'))
        this.formConfiguration = () => this.getFormConfiguration();
    });
  }


  ngOnInit(): void {
    this.tableConfiguration = this.getTableConfiguration();
    this.formConfiguration = () => this.getFormConfiguration();
    this.deleteAction = ($event: any, data?: any) => {
      if (this.entity.dataService && !this.entity.dataService.currentItem?.['ID']) return;

      this.confirmation.confirm({
        header: 'Trajno brisanje učitelja',
        message: 'Jeste li sigurni da želite trajno obrisati zapis?\n Time će se trajno obrisati svi podaci o učitelju uključujući i korisničke postavke!',
        acceptLabel: 'Obriši',
        acceptButtonStyleClass: 'p-button-danger',
        rejectLabel: 'Odustani',
        accept: () => {
          this.rhetos.forEntity(Models.ProfessorInfo).delete(this.entity.dataService!.currentItem!['ID']).subscribe(() => {
            this.message.add({ summary: 'Uspješno obrisano!', severity: 'success' })
            this.entity.sidebarVisible = false;
            this.entity.tableComponent.clearSelection()
            this.entity.tableComponent.floydTable.loadCurrentPage()
          }, err => this.error.showError(err))
        }
      })
    }
    this.entityActions = [...this.entityActions, {
      label: 'Dokumenti',
      action: ($event, data) => {
        const params: RhetosQueryParams<DocumentProcessing.DocumentBrowse> = {
          skip: 0,
          top: 10,
          sort: [],
          predefinedFilters: [],
          genericFilters: [{ property: 'CreatedByID', operation: 'In', value: [this.dataService.currentItem?.ID as string] } as GenericFilter<DocumentProcessing.DocumentBrowse>]
        };
        this.router.navigate(['dokumenti'], {
          queryParams: { filter: JSON.stringify(params) },
        })
      },

    } as UiAction];
  }

  getTableConfiguration(): TableConfigurationParams<Models.ProfessorBrowse> {

    const builder = new TableConfigurationBuilder<Models.ProfessorBrowse>(this.permissionManager);
    builder
      .id('professors-table')
      .selectionType('single')
      .dataSource(this.dataSource)
      .rowStyleClass((row: Models.ProfessorBrowse) => row.Active ? '' : 'deactivated')
      .addColumn('FullName', 'Ime i prezime')
      .addColumn('Subjects', 'Predmeti')
      .ifHasPermission('Models.ProfessorComplexSave.Execute', c => c
        .addColumn('Roles', 'Korisničke uloge')
      )

    return builder.getConfiguration();
  }

  getFormConfiguration(): FloydFormlyConfigurationParams {

    const builder = new FloydFormlyConfigurationBuilder<ProfessorComplexExtended>();
    builder
      .shortString('FirstName', 'Ime', c => c
        .required()
        .onChange((field) => {
          if (!field.formControl || !field.formControl.value) return;
          field.formControl.setValue(field.formControl.value[0].toUpperCase() + field.formControl.value.substr(1));
        }))
      .shortString('LastName', 'Prezime', c => c
        .required()
        .onChange((field) => {
          if (!field.formControl || !field.formControl.value) return;
          field.formControl.setValue(field.formControl.value[0].toUpperCase() + field.formControl.value.substr(1));
        }))
      .boolSwitch('Active', 'U upotrebi', c => c.defaultValue(true))

      .multiSelectDropdown('subjectIds', 'Predmeti', c => c
        .dataSource(() =>
          this.lookupDataSource
            .forQueryable(Models.SubjectInfo)
            .initialFilter([{ property: 'Active', operation: 'Equals', value: true }])
            .valueField('ID')
            .displayField('Title')
            .autocompleteSearchFn((query, value) => query.where('Title', 'Contains', value))
            .dataSource()))
      .fieldGroup(c => c
        .hideExpression((model, formState) => formState == FormState.New || !this.permissionManager.hasPermission('Common.Role.Read'))
        .fields(f => f
          .addField('ID', 'Korisničke postavke', 'Divider')
          .extensionForm<Common.Principal>('Principal', c => c
            .fields(f => f
              .shortString('Email', 'Email', c => c
                .pattern('^[^@]+@[^@]+\.[^@]+$', 'Unesite validan email'))
              .shortString('Name', 'Korisničko ime', c => c
                .required())
            )
          )
          .multiSelectDropdown('roleIds', 'Korisničke uloge', c => c
            .dataSource(() =>
              this.lookupDataSource
                .forQueryable(Common.RoleInfo)
                .valueField('ID')
                .displayField('Name')
                .autocompleteSearchFn((query, value) => query.where('Name', 'Contains', value))
                .initialFilter([{ property: 'IsCustomRole', operation: 'Equals', value: true }])
                .dataSource()))
          .boolSwitch('HasAccess', 'Ima pristup sustavu', c => c
            .onChange((field: FormlyFieldConfig) => {
              if (!field || !field.formControl) return;
              if (field.formControl.value == true && !this.dataService.currentItem?.Principal?.Email) {
                this.message.add({ severity: 'error', summary: 'Email je obavezan podatak za omogućavanje pristupa sustavu.' })
                field.formControl.setValue(false);
              }
            })
          )
          .boolSwitch('sendPasswordResetEmail', 'Pošalji poveznicu za postavljanje lozinke', c => c
            .defaultValue(true)
            .hideExpression((model: ProfessorComplexExtended, formState: any, field?: FormlyFieldConfig) => {

              return model.IsConfirmed == true || model.HasAccess == false;
            })
          )
        ))
    return builder.getConfiguration();
  }

}


