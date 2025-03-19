import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { RhetosLookupDataSource, RhetosRest } from '@ngx-floyd/rhetos';
import { Models } from '../../../../main';
import { Tree } from 'primeng/tree';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import { map } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { FloydFormlyConfigurationBuilder, FloydFormlyConfigurationParams, FormState } from '@ngx-floyd/forms-formly';
import { FormlyFormComponent } from '../../shared/formly-form/formly-form.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EntityDataService } from '../../../services/data-service/entity-data.service';
import { ErrorFormatterService } from '../../../services/error-formatter.service';
import { PERMISSION_MANAGER, PermissionManager } from '@ngx-floyd/core';

@Component({
  selector: 'app-disability-types-subtypes',
  templateUrl: './disability-types-subtypes.component.html',
})
export class DisabilityTypesSubtypesComponent implements OnInit {

  @ViewChild(Tree) tree!: Tree;

  treeData: any[] = [];
  form: FormGroup = new FormGroup({});
  fields: FormlyFieldConfig[] = [];
  options: FormlyFormOptions = {
    formState: {
      awesomeIsForced: false,
    },
  };
  selectionMode?: 'single' | 'multiple' | 'checkbox' | null | undefined = null;
  hasDisabilityTypeEditPermission: boolean = false;
  hasDisabilityTypeNewPermission: boolean = false;
  hasDisabilitySubtypeEditPermission: boolean = false;
  hasDisabilitySubtypeNewPermission: boolean = false;

  disabilityTypeDataService: EntityDataService<Models.DisabilityType>;
  disabilitySubtypeDataService: EntityDataService<Models.DisabilitySubtype>;
  disabilityTypeFormConfiguration?: () => FloydFormlyConfigurationParams;
  disabilitySubtypeFormConfiguration?: () => FloydFormlyConfigurationParams;

  dynamicDialogRef?: DynamicDialogRef;

  constructor(private rhetos: RhetosRest,
    protected lookupDataSource: RhetosLookupDataSource,
    protected confirmation: ConfirmationService,
    protected dynamicDialog: DialogService,
    protected message: MessageService,
    protected error: ErrorFormatterService,
    @Inject(PERMISSION_MANAGER) protected permissionManager: PermissionManager,
    private cdRef: ChangeDetectorRef) {

    this.disabilityTypeDataService = new EntityDataService(this.rhetos, Models.DisabilityTypeInfo, confirmation, dynamicDialog, message, error);
    this.disabilitySubtypeDataService = new EntityDataService(this.rhetos, Models.DisabilitySubtypeInfo, confirmation, dynamicDialog, message, error);

    const onAfterSubmitChanges = (item: any, formState: FormState) => {

      this.dynamicDialogRef?.close();
      this.loadTreeData();
      return { item: item, formState: formState }
    };

    this.disabilityTypeDataService.onAfterSubmitChanges = onAfterSubmitChanges;
    this.disabilitySubtypeDataService.onAfterSubmitChanges = onAfterSubmitChanges;

    this.permissionManager.loadUserData().subscribe(() => {
      this.cdRef.detectChanges();
      this.hasDisabilityTypeNewPermission = this.permissionManager.hasPermission('Models.DisabilityType.New')
      this.hasDisabilityTypeEditPermission = this.permissionManager.hasPermission('Models.DisabilityType.Edit')
      this.hasDisabilitySubtypeNewPermission = this.permissionManager.hasPermission('Models.DisabilitySubtype.New')
      this.hasDisabilitySubtypeEditPermission = this.permissionManager.hasPermission('Models.DisabilitySubtype.Edit')
    });


  }

  get formlyFormComponentInstance() {
    return this.dynamicDialogRef ? (this.dynamicDialog.dialogComponentRefMap.get(this.dynamicDialogRef)?.instance.componentRef?.instance as FormlyFormComponent) : undefined;
  }

  ngOnInit(): void {
    this.loadTreeData();
    this.disabilityTypeFormConfiguration = () => this.getDisabilityTypeFormConfiguration();
    this.disabilitySubtypeFormConfiguration = () => this.getDisabilitySubtypeFormConfiguration();

  }

  loadTreeData() {
    this.rhetos.forQueryable(Models.DisabilityTypeSubtypeTreeDataInfo).records().pipe(
      map((value: Models.DisabilityTypeSubtypeTreeData[]) => {
        var nodes: TreeNode[] = [];
        for (var vrsta of value.filter(i => i.Tip === 'Vrsta')) {
          nodes.push({
            label: vrsta.Naziv,
            data: vrsta,
            expanded: vrsta.Active,
            children: value
              .filter(i => i.Tip === 'Podvrsta' && i.ParentID == vrsta.ID)
              .sort((x: Models.DisabilityTypeSubtypeTreeData, y: Models.DisabilityTypeSubtypeTreeData) => { return (x.Active === y.Active) ? 0 : x.Active ? -1 : 1; })
              .map(podvrsta => ({
                label: podvrsta.Naziv,
                data: podvrsta,
              } as TreeNode)),
          })
        }
        nodes.sort((x: TreeNode, y: TreeNode) => { return (x.data.Active === y.data.Active) ? 0 : x.data.Active ? -1 : 1; })
        return nodes;
      }))
      .subscribe(
        data => this.treeData = data,
        err => this.error.showError(err)
      );
  }

  getDisabilityTypeFormConfiguration() {
    const builder = new FloydFormlyConfigurationBuilder<Models.DisabilityType>();
    builder
      .shortString('Type', 'Vrsta', c => c.required())
      .boolSwitch('Active', 'U upotrebi', c => c.defaultValue(true))
    return builder.getConfiguration();
  }

  getDisabilitySubtypeFormConfiguration() {
    const builder = new FloydFormlyConfigurationBuilder<Models.DisabilitySubtype>();
    builder
      .longString('Subtype', 'Podvrsta', c => c.required())
      .dropDown('DisabilityTypeID', 'Vrsta', c => c
        .disable(true)
        .dataSource(() =>
          this.lookupDataSource
            .forQueryable(Models.DisabilityTypeInfo)
            .valueField('ID')
            .displayField('Type')
            .autocompleteSearchFn((query, value) => query.where('Type', 'Contains', value))
            .dataSource()))
      .boolSwitch('Active', 'U upotrebi', c => c.defaultValue(true))
    return builder.getConfiguration();
  }

  addType() {
    this.disabilityTypeDataService.newItem();
    this.dynamicDialogRef = this.dynamicDialog.open(FormlyFormComponent, {
      header: 'Nova vrsta',
      data: {
        configuration: this.disabilityTypeFormConfiguration,
        dataService: this.disabilityTypeDataService,
        model: {} as Models.DisabilityType,
        scrollable: false
      }
    });
  }

  addSubtype($event: any) {

    this.disabilitySubtypeDataService.newItem();

    const openPodvrstaForm = (model: any) => {
      this.dynamicDialogRef = this.dynamicDialog.open(FormlyFormComponent, {
        header: 'Nova podvrste',
        data: {
          configuration: this.disabilitySubtypeFormConfiguration,
          dataService: this.disabilitySubtypeDataService,
          scrollable: false,
          model: model
        }
      });
    }

    if ($event.data.Tip === 'Vrsta') {
      openPodvrstaForm({
        DisabilityTypeID: $event.data.ID
      } as Models.DisabilitySubtype)
    }

    if ($event.data.Tip === 'Podvrsta') {
      openPodvrstaForm({

        ParentID: $event.data.ID
      } as Models.DisabilitySubtype)
    }

  }

  deactivate($event: any) {
    if ($event.data.Tip === 'Vrsta') {
      this.disabilityTypeDataService.deactivateItem($event.data.ID, { header: 'Jeste li sigurni da želite deaktivirati zapis? \nAko odabrana vrsta ima aktivne podvrste i one će biti deaktivirane!' })
    }
    if ($event.data.Tip === 'Podvrsta') {
      this.disabilitySubtypeDataService.deactivateItem($event.data.ID)
    }
  }

  reactivate($event: any) {
    if ($event.data.Tip === 'Vrsta') {
      this.disabilityTypeDataService.reactivateItem($event.data.ID)
    }
    if ($event.data.Tip === 'Podvrsta') {
      this.disabilitySubtypeDataService.reactivateItem($event.data.ID)
    }
  }

  delete($event: any) {
    if ($event.data.Tip === 'Vrsta') {
      this.disabilityTypeDataService.reactivateItem($event.data.ID)
    }
    if ($event.data.Tip === 'Podvrsta') {
      this.disabilitySubtypeDataService.reactivateItem($event.data.ID)
    }
  }

  edit($event: any) {

    const openVrstaEdit = () => {
      this.dynamicDialogRef = this.dynamicDialog.open(FormlyFormComponent, {
        header: 'Uređivanje vrste',
        data: {
          configuration: this.disabilityTypeFormConfiguration,
          dataService: this.disabilityTypeDataService,
          scrollable: false
        }
      });
    }
    const openPodvrstaEdit = () => {
      this.dynamicDialogRef = this.dynamicDialog.open(FormlyFormComponent, {
        header: 'Uređivanje podvrste',
        data: {
          configuration: this.disabilitySubtypeFormConfiguration,
          dataService: this.disabilitySubtypeDataService,
          scrollable: false
        }
      });
    }

    if ($event.data.Tip === 'Vrsta') {
      this.disabilityTypeDataService.loadItem($event.data.ID).subscribe({
        complete: () => openVrstaEdit()
      })
    }
    if ($event.data.Tip === 'Podvrsta') {
      this.disabilitySubtypeDataService.loadItem($event.data.ID).subscribe({
        complete: () => openPodvrstaEdit()
      })
    }
  }

}
