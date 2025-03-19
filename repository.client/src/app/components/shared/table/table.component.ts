import { AfterViewInit, Component, ContentChildren, EventEmitter, Inject, Input, OnInit, Optional, Output, QueryList, ViewChild } from '@angular/core';
import { FloydTableComponent, TableConfigurationParams } from '@ngx-floyd/table';
import { PrimeTemplate } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UiAction } from '@ngx-floyd/core-ui';
import { RhetosQueryParams } from '@ngx-floyd/rhetos';
import { FloydFormlyConfigurationParams, FormState } from '@ngx-floyd/forms-formly';
import { FormlyFormComponent } from '../formly-form/formly-form.component';
import { PERMISSION_MANAGER, PermissionManager } from '@ngx-floyd/core';
import { Sidebar } from 'primeng/sidebar';

export interface AppliedFilter {
  key: string;
  label: string;
  value: string;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
})
export class TableComponent implements OnInit, AfterViewInit {

  @Input() configuration!: TableConfigurationParams<any>;
  @Input() scrollHeight: string = '80vh';
  @Input() createActionVisible: boolean = true;
  @Input() removeRowClickEvent: boolean = false;
  @Input() createAction?: UiAction;
  @Input() searchFormConfiguration?: () => FloydFormlyConfigurationParams;
  @Input() onSearchFormSubmit?: (model: any, formState: FormState) => { model: any, formState: FormState };
  @Input() onInit?: (context: TableComponent) => void;
  @Input() afterViewInit?: (context: TableComponent) => void;

  @Input() createPermission?: string;

  dataSourceQueryParams: RhetosQueryParams<any> = {};
  appliedSearches: AppliedFilter[] = [];
  searchFormModel: any = {};
  hasCreatePermission = false;
  dynamicDialogRef?: DynamicDialogRef;

  @Output() addNewClicked = new EventEmitter<any>();
  @Output() filterRemoved = new EventEmitter<any>();
  @Output() tableSelectionChanged = new EventEmitter<any>();
  @Output() singleSelectionChanged = new EventEmitter<any>();

  @ViewChild(FloydTableComponent) floydTable!: FloydTableComponent;
  @ViewChild(FormlyFormComponent) formlySearchForm?: FormlyFormComponent;
  @ViewChild('searchSidebar') searchSidebar?: Sidebar;

  @ContentChildren(PrimeTemplate) templates!: QueryList<any>;

  constructor(
    @Optional() private dialogConfig: DynamicDialogConfig,
    private dynamicDialog: DialogService,
    @Inject(PERMISSION_MANAGER) public permissionManager: PermissionManager,
  ) {
    if (dialogConfig) {
      const { configuration, scrollHeight, removeRowClickEvent, createActionVisible, onInit, afterViewInit } = dialogConfig.data || {};
      if (configuration) this.configuration = configuration;
      if (scrollHeight) this.scrollHeight = scrollHeight;
      if (removeRowClickEvent) this.removeRowClickEvent = removeRowClickEvent;
      if (createActionVisible) this.createActionVisible = createActionVisible;
      if (onInit) this.onInit = onInit;
      if (afterViewInit) this.afterViewInit = afterViewInit;

    }
    this.permissionManager.loadUserData().subscribe(() => {
      if (this.createPermission)
        this.hasCreatePermission = this.permissionManager.hasPermission(this.createPermission)
    });
  }

  ngOnInit(): void {
    if (this.onInit) this.onInit(this)
  }

  ngAfterViewInit(): void {
    if (this.afterViewInit) this.afterViewInit(this)
  }

  onTableSelectionChanged($event: any) {
    this.tableSelectionChanged.emit($event);
  }

  onRowClick($event: any) {
    this.singleSelectionChanged.emit($event);
  }

  onAddNew() {
    this.addNewClicked.emit()
  }

  removeFilter(item: AppliedFilter) {
    this.filterRemoved.emit(item)
  }

  openSearchForm() {
    this.dynamicDialogRef = this.dynamicDialog.open(FormlyFormComponent, {
      header: 'Filtriranje rezultata',
      height: 'auto',
      width: '32em',
      data: {
        configuration: this.searchFormConfiguration,
        submitBtnText: 'Filtriraj',
        model: this.searchFormModel,
        onBeforeSubmit: this.onSearchFormSubmit,
        skipSubmit: true
      }
    });
  }

  clearSelection() {
    if (this.floydTable)
      this.floydTable.selection = this.changeSelection(Array.isArray(this.floydTable?.selection) ? [] : undefined)
  }

  changeSelection(selection: any) {
    if (this.floydTable) {
      this.floydTable.selection = selection;
      this.floydTable.cdRef.detectChanges();
    }
  }
}
