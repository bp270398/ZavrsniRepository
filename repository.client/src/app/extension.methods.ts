import { QueryList, TemplateRef } from '@angular/core';
import { LookupDataSource, newGuid } from '@ngx-floyd/core';
import { Entity } from '@ngx-floyd/rhetos';
import { PrimeTemplate } from 'primeng/api';
import { map, Observable, of, skip, take } from 'rxjs';

export function executeAsync(fn: () => void, timeout?: number) {
  setTimeout(() => {
    fn();
  }, timeout ?? 10);
}

export function toDateString(date?: Date) {
  return date ? date.toLocaleDateString('hr-HR').split(' ').join('') : '';
}

export function toTimeString(date?: Date) {
  return date ? date.toLocaleTimeString('hr-HR', { hour: '2-digit', minute: '2-digit' }).split(' ').join('') : '';
}

export function toDateTimeString(date?: Date) {
  return date ? (date.toLocaleDateString('hr-HR') + ' ' + toTimeString(date)).split(' ').join('') : '';

}

export function mapToMultiselect<T extends Entity>(items: T[] | undefined, prop: keyof T): string[] {
  if (!items) return [];
  return items.map(x => x[prop] as string);
}
export const defaultFindFn = (item: any, value: any) => item.ID == value;

export function getLookupItem(dataSource: LookupDataSource, value: any, findFn?: (item: any, value: any) => boolean): Observable<any> {
  if (!value || !dataSource) return of(undefined);

  const fn = findFn ?? defaultFindFn;

  const selectedItem = dataSource.currentData().find(x => fn(x, value));
  if (selectedItem) return of(selectedItem);

  return dataSource.data$.pipe(skip(1), take(1), map((data: any[]) => data.find(x => fn(x, value))))
}

export function getLookupItems(dataSource: LookupDataSource, values: any[], findFn?: (item: any, value: any) => boolean, loadData?: boolean): Observable<any[]> {
  if (!values || !dataSource) return of([])

  const fn = findFn ?? defaultFindFn;
  const filterFn = (item: any) => {
    for (const v of values)
      if (fn(item, v)) return true;
    return false;
  }
  if (loadData) {
    const items = dataSource.loadIds(...values).pipe(map(data => {
      if (data.length > 0) {
        var v = data.filter((x: any) => filterFn(x) ?? false);
        return v;
      } else
        return [];
    }));
    return items;
  } else {
    const items = dataSource.currentData().filter((x: any) => filterFn(x))
    if (items.length) return of(items)
  }

  return dataSource.data$.pipe(skip(1), take(1), map((data: any[]) => data.filter((x: any) => filterFn(x))))
}


export function mapFromMultiselect<T extends Entity>(items: T[] | undefined, prop: keyof T, value: string[]): T[] {
  if (!items) return [];
  let data = [...items ?? []];
  data = data.filter(v => items.find(x => x[prop] === v) !== undefined);

  const newItems: T[] = value?.filter(v => data.find(i => i[prop] === v) === undefined)
    .map(v => {
      let item: T = { ID: newGuid() } as T;
      item[prop] = v as any;
      return item;
    });
  return [...data, ...newItems ?? []];
}

export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(',')[1];
      resolve(base64);
    };
    reader.readAsDataURL(blob);
  });
}


export function getContentTemplate(templateName: string, templates: QueryList<PrimeTemplate>): TemplateRef<any> {
  const t = templates.toArray().find((t) => t.name?.toLowerCase() == templateName.toLowerCase())
  if (!t) throw new Error(`Template '${templateName}' not found.`)
  return t?.template;
}
export function hasContentTemplate(templateName: string, templates: QueryList<PrimeTemplate>): boolean {
  var t = templates.toArray()
  return templates.toArray().find((t) => t.name?.toLowerCase() == templateName.toLowerCase()) !== undefined
}