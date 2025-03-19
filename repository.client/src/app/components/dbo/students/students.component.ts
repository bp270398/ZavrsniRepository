import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { TableConfigurationBuilder, TableConfigurationParams } from '@ngx-floyd/table';
import { DocumentProcessing, Models } from '../../../../main';
import { GenericFilter, RhetosLookupDataSource, RhetosQueryableDataSource, RhetosQueryParams, RhetosRest } from '@ngx-floyd/rhetos';
import { Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { FloydFormlyConfigurationBuilder, FloydFormlyConfigurationParams, FormState } from '@ngx-floyd/forms-formly';
import { ComplexEntityDataService } from '../../../services/data-service/complex-entity-data.service';
import { PERMISSION_MANAGER, PermissionManager, StaticLookupDataSource } from '@ngx-floyd/core';
import { mapToMultiselect, mapFromMultiselect } from '../../../extension.methods';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ErrorFormatterService } from '../../../services/error-formatter.service';
import { EntityComponent } from '../../shared/entity/entity.component';
import { UiAction } from '@ngx-floyd/core-ui';

interface StudentComplexExtended extends Models.StudentComplex {
  subjectIds: string[];
  disabilitySubtypeIds: string[];
}

@Component({
  selector: 'app-students',
  template: `<app-entity
    [tableConfiguration]="tableConfiguration"
    [formConfiguration]="formConfiguration"
    [searchFormConfiguration]="searchFormConfiguration"
    [dataService]="dataService"
    [selectedTitleFn]="selectedTitleFn"
    [entityActions]="entityActions"
    [createPermission]="'Models.StudentComplexSave.Execute'"
    [deletePermission]="'Models.Student.Remove'"
    [deleteAction]="deleteAction"  
  ></app-entity>`,
})
export class StudentsComponent implements OnInit {

  @Input() tableConfiguration!: TableConfigurationParams<Models.StudentBrowse>;

  dataSource: RhetosQueryableDataSource<Models.StudentBrowse>;
  dataService: ComplexEntityDataService<Models.StudentComplex>;
  formConfiguration!: () => FloydFormlyConfigurationParams;
  searchFormConfiguration!: () => FloydFormlyConfigurationParams;
  selectedTitleFn = (entity: any) => entity.FirstName + ' ' + entity.LastName;
  onSearchFormSubmit?: (model: any, formState: FormState) => { model: any, formState: FormState };
  deleteAction!: ($event: any, data?: any) => void;
  entityActions: UiAction[] = [];

  @ViewChild(EntityComponent) entity!: EntityComponent;

  constructor(protected rhetos: RhetosRest,
    private router: Router,
    protected lookupDataSource: RhetosLookupDataSource,
    protected confirmation: ConfirmationService,
    protected dynamicDialog: DialogService,
    protected message: MessageService,
    protected error: ErrorFormatterService,
    @Inject(PERMISSION_MANAGER) protected permissionManager: PermissionManager
  ) {
    this.dataSource = new RhetosQueryableDataSource<Models.StudentBrowse>(Models.StudentBrowseInfo, this.rhetos);
    this.dataSource.sort('Active', 'desc')

    this.dataService = new ComplexEntityDataService(this.rhetos, Models.StudentComplexComplexInfo, confirmation, dynamicDialog, message, error);

    this.dataService.onAfterLoadItem = (item: Models.StudentComplex, formState) => {
      var i = (item as StudentComplexExtended);
      i.subjectIds = mapToMultiselect(item.Subjects ?? [], 'SubjectID');
      i.disabilitySubtypeIds = mapToMultiselect(item.DisabilitySubtypes ?? [], 'DisabilitySubtypeID');

      return { item: i, formState: this.permissionManager.hasPermission('Models.StudentComplexSave.Execute') ? FormState.Edit : FormState.ReadOnly };
    }

    this.dataService.onBeforeSubmitChanges = (item: StudentComplexExtended, formState) => {
      item.Subjects = mapFromMultiselect(item.Subjects ?? [], 'SubjectID', item.subjectIds);
      item.DisabilitySubtypes = mapFromMultiselect(item.DisabilitySubtypes ?? [], 'DisabilitySubtypeID', item.disabilitySubtypeIds);

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
        header: 'Trajno brisanje učenika',
        message: 'Jeste li sigurni da želite trajno obrisati zapis?\n Time će se trajno obrisati svi podaci o učeniku uključujući i njegove dokumente!',
        acceptLabel: 'Obriši',
        acceptButtonStyleClass: 'p-button-danger',
        rejectLabel: 'Odustani',
        accept: () => {
          this.rhetos.forEntity(Models.StudentInfo).delete(this.entity.dataService!.currentItem!['ID']).subscribe(() => {
            this.message.add({ summary: 'Uspješno obrisano!', severity: 'success' })
            this.entity.sidebarVisible = false;
            this.entity.tableComponent.clearSelection()
            this.entity.tableComponent.floydTable.loadCurrentPage()
          }, err => this.error.showError(err))
        }
      })
    }
    this.entityActions = [...this.entityActions,
    {
      label: 'Dokumenti',
      action: ($event, data) => {

        const params: RhetosQueryParams<DocumentProcessing.DocumentBrowse> = {
          skip: 0,
          top: 10,
          sort: [],
          predefinedFilters: [],
          genericFilters: [{ property: 'StudentID', operation: 'In', value: [this.dataService.currentItem?.ID as string] } as GenericFilter<DocumentProcessing.DocumentBrowse>]
        };

        this.router.navigate(['dokumenti'], {
          queryParams: { filter: JSON.stringify(params) },
        })
      },

    } as UiAction]
  }

  getTableConfiguration(): TableConfigurationParams<Models.StudentBrowse> {

    const builder = new TableConfigurationBuilder<Models.StudentBrowse>();
    builder
      .id('student-table')
      .selectionType('single')
      .dataSource(this.dataSource)
      .rowStyleClass((row: Models.StudentBrowse) => row.Active ? '' : 'deactivated')
      .addColumn('FirstName', 'Ime')
      .addColumn('LastName', 'Prezime')
      .addColumn('FullGrade', 'Razred')
      // TODO .addColumn('DateOfBirth', 'Datum rođenja', c => c.format((data: Date) => toDateString(data)))
      .addColumn('EducationType', 'Vrsta primjene školovanja')
      .addColumn('EducationLocation', 'Lokacija primjene školovanja')
      .addColumn('Oib', 'OIB')
    return builder.getConfiguration();
  }

  getFormConfiguration(): FloydFormlyConfigurationParams {
    const builder = new FloydFormlyConfigurationBuilder<StudentComplexExtended>();
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
      .date('DateOfBirth', 'Datum rođenja', c => c
        .required()
        .max(new Date())
      )
      .shortString('Oib', 'OIB', c => c
        .required()
        // TODO fix .pattern('/^\d{11}$/', 'Unesite validan OIB')
      )
      .fieldGroup(fg => fg
        .fieldGroupClassName('flex m-0')
        .fields(f => f
          .integer('Grade', 'Razred', c => c
            .required()
            .className('w-100 mie-1')
            .wrappers([])
            .min(1)
            .max(8))
          .dropDown('GradeDivision', 'Razredni odjel', c => c
            .required()
            .className('w-100')
            .wrappers([])
            .dataSource(() => new StaticLookupDataSource({ items: [{ i: 'a' }, { i: 'b' }, { i: 'c' }, { i: 'd' }, { i: 'e' },], displayField: 'i', valueField: 'i' })))
        )
      )
      .dropDown('EducationTypeID', 'Vrsta primjerenog oblika školovanja', c => c
        .required()
        .dataSource(() =>
          this.lookupDataSource
            .forQueryable<Models.EducationType>(Models.EducationTypeInfo)
            .initialFilter([{ property: 'Active', operation: 'Equals', value: true }])
            .valueField('ID')
            .displayField('Type')
            .autocompleteSearchFn((query, value) => query.where('Type', 'Contains', value))
            .dataSource()))
      .dropDown('EducationLocationID', 'Lokacija školovanja', c => c
        .required()
        .dataSource(() =>
          this.lookupDataSource
            .forQueryable<Models.EducationLocation>(Models.EducationLocationInfo)
            .initialFilter([{ property: 'Active', operation: 'Equals', value: true }])
            .valueField('ID')
            .displayField('Location')
            .autocompleteSearchFn((query, value) => query.where('Location', 'Contains', value))
            .dataSource()))
      .multiSelectAutoComplete('subjectIds', 'Predmeti', c => c
        .dataSource(() =>
          this.lookupDataSource
            .forQueryable<Models.Subject>(Models.SubjectInfo)
            .initialFilter([{ property: 'Active', operation: 'Equals', value: true }])
            .valueField('ID')
            .displayField('Title')
            .autocompleteSearchFn((query, value) => query.where('Title', 'Contains', value))
            .dataSource()))
      .multiSelectAutoComplete('disabilitySubtypeIds', 'Teškoće', c => c
        .dataSource(() =>
          this.lookupDataSource
            .forQueryable<Models.DisabilitySubtypeLookup>(Models.DisabilitySubtypeLookupInfo)
            .initialFilter([{ property: 'Active', operation: 'Equals', value: true }, { property: 'DisabilityTypeActive', operation: 'Equals', value: true }])
            .valueField('ID')
            .displayField('Subtype')
            .autocompleteSearchFn((query, value) => query.where('Subtype', 'Contains', value))
            .dataSource()))
      .boolSwitch('Active', 'U upotrebi', c => c.defaultValue(true))

    return builder.getConfiguration();
  }

  getSearchFormConfiguration(): FloydFormlyConfigurationParams {

    const builder = new FloydFormlyConfigurationBuilder<any>();
    builder
      .shortString('FirstName', 'Ime', c => c
        .onChange((field) => {
          if (!field.formControl || !field.formControl.value) return;
          field.formControl.setValue(field.formControl.value[0].toUpperCase() + field.formControl.value.substr(1));
        }))
      .shortString('LastName', 'Prezime', c => c
        .onChange((field) => {
          if (!field.formControl || !field.formControl.value) return;
          field.formControl.setValue(field.formControl.value[0].toUpperCase() + field.formControl.value.substr(1));
        }))
      .shortString('Oib', 'OIB', c => c
        // TODO fix .pattern('/^\d{11}$/', 'Unesite validan OIB')
      )
      .multiSelectDropdown('FullGrade', 'Razred', c => c
        .dataSource(() => {
          const grades = Array.from({ length: 8 }, (_, i) => i + 1);
          const divisions = ['a', 'b', 'c', 'd', 'e'];
          const items = grades.flatMap(grade =>
            divisions.map(division => ({ FullGrade: `${grade}.${division}` }))
          );
          return new StaticLookupDataSource({
            items: items,
            displayField: 'FullGrade',
            valueField: 'FullGrade'
          });
        }))
      .multiSelectDropdown('EducationTypeID', 'Vrste primjerenog oblika školovanja', c => c
        .dataSource(() =>
          this.lookupDataSource
            .forQueryable<Models.EducationType>(Models.EducationTypeInfo)
            .initialFilter([{ property: 'Active', operation: 'Equals', value: true }])
            .valueField('ID')
            .displayField('Type')
            .autocompleteSearchFn((query, value) => query.where('Type', 'Contains', value))
            .dataSource())
      )
      .multiSelectDropdown('EducationLocationID', 'Lokacije primjerenog oblika školovanja', c => c
        .dataSource(() =>
          this.lookupDataSource
            .forQueryable<Models.EducationLocation>(Models.EducationLocationInfo)
            .initialFilter([{ property: 'Active', operation: 'Equals', value: true }])
            .valueField('ID')
            .displayField('Location')
            .autocompleteSearchFn((query, value) => query.where('Location', 'Contains', value))
            .dataSource())
      )

    return builder.getConfiguration();
  }
}
