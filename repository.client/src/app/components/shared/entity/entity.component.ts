import { AfterViewInit, Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UiAction } from '@ngx-floyd/core-ui';
import { FloydFormlyConfigurationParams, FormState } from '@ngx-floyd/forms-formly';
import { DataService } from '../../../services/data-service/data.service';
import { FormlyFormComponent } from '../formly-form/formly-form.component';
import { FormlyFormOptions } from '@ngx-formly/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TableConfigurationParams } from '@ngx-floyd/table';
import { PERMISSION_MANAGER, PermissionManager } from '@ngx-floyd/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Menu } from 'primeng/menu';
import { ErrorFormatterService } from '../../../services/error-formatter.service';
import { take } from 'rxjs';
import { Sidebar } from 'primeng/sidebar';
import { USER_CONTEXT, UserContextProvider } from '../../../services/user-context.provider';
import { FilterableRouteDirective } from '../../../services/filterable-route.directive';
import { TableComponent } from '../table/table.component';
import { executeAsync } from '../../../extension.methods';

@Component({
  selector: 'app-entity',
  templateUrl: './entity.component.html',
  styleUrls: ['./entity.component.css']
})
export class EntityComponent implements OnInit, AfterViewInit {

  @Input() tableHeader?: string;
  @Input() tableConfiguration!: TableConfigurationParams<any>;
  @Input() tableScrollHeight: string = '80vh';
  @Input() removeRowClickEvent: boolean = false;
  @Input() dataService?: DataService<any>;
  @Input() selectedTitleFn?: (entity: any) => string;
  @Input() formConfiguration?: () => FloydFormlyConfigurationParams;
  @Input() formScrollable = false;
  @Input() formHeight = 'fit-content';
  @Input() createPermission?: string;
  @Input() deletePermission?: string;
  @Input() deleteDisabled?: (data?: any) => boolean = (data?: any) => false;
  @Input() deleteAction?: ($event: any, data?: any) => void;
  hasCreatePermission = false;
  hasDeletePermission = false;
  @Input() searchFormConfiguration?: () => FloydFormlyConfigurationParams;
  @Input() onSearchFormSubmit?: (model: any, formState: FormState) => { model: any, formState: FormState };

  dynamicDialogRef?: DynamicDialogRef;

  @Input() createAction?: UiAction;
  @Input() headerActions: UiAction[] = [];
  @Input() entityActions?: UiAction[];
  @Input() extraEntityActions?: UiAction[];
  @Output() tableSelectionChanged = new EventEmitter<any>();
  @Output() singleSelectionChanged = new EventEmitter<any>();

  @ViewChild('extraActionsMenu') extraActionsMenuComponent?: Menu;
  @ViewChild(TableComponent) tableComponent!: TableComponent;
  @ViewChild(FormlyFormComponent) formlyForm?: FormlyFormComponent;
  @ViewChild(Sidebar) sidebar?: Sidebar;

  @ViewChild(FilterableRouteDirective) filterableRouteDirective?: FilterableRouteDirective;

  _id?: string;
  sidebarTitle: string = 'Pregled';
  headerActionsVisible = true;
  entityActionsVisible = true;
  sidebarVisible: boolean = false;
  sidebarFullscreen: boolean = false;
  options: FormlyFormOptions = {
    formState: {
      awesomeIsForced: false,
    },
  };

  protected readonly formStateNew = FormState.New;
  protected readonly formStateReadonly = FormState.ReadOnly;

  constructor(private route: ActivatedRoute,
    private router: Router,
    protected dynamicDialog: DialogService,
    protected error: ErrorFormatterService,
    @Inject(PERMISSION_MANAGER) public permissionManager: PermissionManager,
    @Inject(USER_CONTEXT) public userContext: UserContextProvider,
  ) {
    this.permissionManager.loadUserData().subscribe(() => {
      if (this.deletePermission)
        this.hasDeletePermission = this.permissionManager.hasPermission(this.deletePermission)
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        const selectedId = params['id'];
        if (selectedId)
          this.loadItem(selectedId)
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataService?.submitted.subscribe(v => {
      this.sidebarTitle = this.selectedTitleFn ? this.selectedTitleFn(v.item) : 'Pregled';
      this.tableComponent?.floydTable.loadCurrentPage();
      this.loadItem(v.item['ID'])
    })
  }

  onRowClick($event: any) {
    var itemId = $event.row.ID;
    this.updateRouteParams({ id: itemId })
  }

  onTableSelectionChanged($event: any) {
    this.tableSelectionChanged.emit($event);
  }

  addNew() {
    this.updateRouteParams({})
    this.loadItem()
  }

  onSidebarHide() {
    this._id = undefined;
    this.updateRouteParams({});
    this.tableComponent.clearSelection()
  }

  updateRouteParams(params: {}): void {
    this.route.params.subscribe((routeParams) => {
      const updatedParams = { ...routeParams, ...params };
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: updatedParams,
      });
    });
  }

  loadItem(id?: string) {
    if (id) this._id = id;
    if (this._id)
      this.dataService?.loadItem(this._id).pipe(take(1))
        .subscribe(v => {
          if (!v.item) {
            this.sidebarVisible = false; // TODO alert not found
          }
          this.sidebarTitle = this.selectedTitleFn ? this.selectedTitleFn(v.item) : 'Pregled';
          this.formlyForm?.updateModel(v.item, v.formState)
          executeAsync(() => this.tableComponent.changeSelection(this.tableComponent.configuration.dataSource?.currentData().filter(d => d.ID == this._id)[0])
          )
        }, err => this.error.showError(err));
    else {
      this.dataService?.newItem();
      this.sidebarTitle = 'Novi zapis';
    }
    this.sidebarVisible = true;
  }
}


