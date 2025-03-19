import { AfterViewInit, Directive } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormState } from '@ngx-floyd/forms-formly';
import { FilterOperation, RhetosQueryableDataSource, RhetosQueryParams } from '@ngx-floyd/rhetos';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable, forkJoin, map, of, take } from 'rxjs';
import { executeAsync, getLookupItem, getLookupItems, toDateString } from '../extension.methods';
import { LookupDataSource } from '@ngx-floyd/core';
import { AppliedFilter, TableComponent } from '../components/shared/table/table.component';

@Directive({
  selector: '[appFilterableRoute]'
})
export class FilterableRouteDirective implements AfterViewInit {

  constructor(
    private tableComponent: TableComponent,
    private route: ActivatedRoute,
    private router: Router) { }

  ngAfterViewInit(): void {
    if (this.tableComponent.searchFormConfiguration) {

      if (!this.tableComponent?.onSearchFormSubmit)
        this.tableComponent.onSearchFormSubmit = (model: any, formState: FormState) => {
          this.updateAppliedSearch();
          const lastQueryParams = (this.tableComponent.configuration.dataSource as any)['lastQueryParams'] as RhetosQueryParams<any>;
          lastQueryParams.genericFilters = this.searchModelToGenericFilters();
          this.router.navigate([], {
            queryParams: { filter: JSON.stringify(lastQueryParams) },
            queryParamsHandling: 'merge'
          });
          this.tableComponent.dynamicDialogRef?.close()
          return { model: model, formState: formState }
        };

      this.tableComponent.filterRemoved.subscribe(value => {
        this.removeFilter(value);
      });
    }

    this.route.queryParams.subscribe(params => {

      if (params['filter'] && this.tableComponent.searchFormConfiguration) {
        try {
          const parsedParams: RhetosQueryParams = JSON.parse(params['filter']);
          if (parsedParams)
            this.tableComponent.dataSourceQueryParams = parsedParams;

          this.tableComponent.searchFormModel = this.genericFiltersToSearchModel(this.tableComponent.dataSourceQueryParams.genericFilters);

          executeAsync(() => this.updateAppliedSearch());

          (this.tableComponent.configuration.dataSource as RhetosQueryableDataSource<any>).filter(parsedParams.genericFilters, parsedParams.predefinedFilters);
          this.tableComponent?.floydTable.loadCurrentPage();

        } catch (error) {
          console.error('Invalid query params formlyFormat', error);
        }
      }
    });
  }

  cancelFiltering() {
    this.tableComponent.searchFormModel = this.genericFiltersToSearchModel(((this.tableComponent.configuration.dataSource as any)['lastQueryParams'] as RhetosQueryParams<any>).genericFilters);
  }

  retrieveFilters(fields: FormlyFieldConfig[]): Observable<AppliedFilter[]> {
    const infos = this.getSearchInfos(fields);
    return forkJoin(infos).pipe(map((value) => value.filter(x => x !== undefined) as unknown as AppliedFilter[]))
  }

  getSearchInfos(fields: FormlyFieldConfig[]): Observable<AppliedFilter | undefined>[] {
    let infos = fields.filter(field => !field.fieldGroup).map(field => this.getSearchInfo(this.tableComponent.searchFormModel, field));
    const children = fields.filter(x => x.fieldGroup)
    for (const child of children)
      infos = [...infos, ...this.getSearchInfos(child.fieldGroup ?? [])]
    return infos;
  }

  getSearchInfo(model: any, field: FormlyFieldConfig): Observable<AppliedFilter | undefined> {
    const value = model[field.key as string];
    if (value === undefined) return of(undefined)

    return this.getSearchStringValue(value, field).pipe(map(stringValue => {
      if (!stringValue) return undefined;
      const valuesArray = (stringValue as string).split(',');

      return {
        label: field.props?.label,
        key: field.key as string,
        value: valuesArray.length > 3
          ? `${valuesArray.slice(0, 3).join(', ')}...`
          : stringValue
      } as AppliedFilter
    }))
  }

  getSearchStringValue(value: any, field: FormlyFieldConfig) {
    const dataSource: LookupDataSource = field.props?.['dataSource'];
    switch (field.type) {
      case 'Date': return of(toDateString(value))
      //case 'DateTime': f.value = toDateTimeString(value)
      case 'BoolDropdown':
      case 'BoolSwitch':
      case 'BoolSelectButton': return of(value ? 'Da' : 'Ne')
      case 'Dropdown':
      case 'DropdownWithEchoFields':
      case 'AutoComplete': {
        return getLookupItem(dataSource, value, (item: any, value: any) => item[dataSource.valueField] === value)?.pipe(map((data: any) => data ? data[dataSource.displayField] : undefined));
      }
      case 'MultiSelectDropdown':
      case 'MultiSelectAutoComplete':
        return getLookupItems(dataSource, value, (item: any, value: any) => item[dataSource.valueField] === value, true)?.pipe(map((data: any) => data.map((d: any) => d[dataSource.displayField]).join(',')));
    }
    return of(value as string)
  }

  genericFiltersToSearchModel(genericFilters: {
    property: string;
    operation: FilterOperation<any, string>;
    value: any;
  }[] | undefined) {
    if (!genericFilters) return {};
    var model: any = {};
    for (var f of genericFilters) {
      if (f.operation == 'Equals' || f.operation == 'In')
        model[f.property] = f.value;
    }
    return model;
  }

  searchModelToGenericFilters() {
    var genericFilters: {
      property: string,
      operation: FilterOperation<any, string>,
      value: any
    }[] = [];

    for (const key of Object.keys(this.tableComponent.searchFormModel)) {
      var value = this.tableComponent.searchFormModel[key];

      if (Array.isArray(value)) {
        if (value.length > 0)
          genericFilters.push({ property: key, operation: 'In', value: value });
      }
      else if (value !== undefined)
        genericFilters.push({ property: key, operation: 'Equals', value: value });
    }
    return genericFilters;
  }

  removeFilter(item: AppliedFilter) {
    const model = this.tableComponent.searchFormModel;
    model[item.key] = undefined;
    this.tableComponent.searchFormModel = model;
    const lastQueryParams = (this.tableComponent.configuration.dataSource as any)['lastQueryParams'] as RhetosQueryParams<any>;
    lastQueryParams.genericFilters = this.searchModelToGenericFilters();
    if (lastQueryParams.genericFilters && lastQueryParams.genericFilters.length > 0)
      this.router.navigate([], {
        queryParams: { filter: JSON.stringify(lastQueryParams) },
        queryParamsHandling: 'merge'
      })
    else
      this.router.navigate([], {
        queryParams: {}
      })
    this.tableComponent.floydTable.loadCurrentPage()
  }

  updateAppliedSearch() {

    if (this.tableComponent.formlySearchForm)
      this.retrieveFilters(this.tableComponent.formlySearchForm.fields).pipe(take(1)).subscribe(applied => {
        this.tableComponent.appliedSearches = applied;
      })
    else if (this.tableComponent.searchFormConfiguration)
      this.retrieveFilters(this.tableComponent.searchFormConfiguration().fields).pipe(take(1)).subscribe(applied => {
        this.tableComponent.appliedSearches = applied;
      })
  }
}
