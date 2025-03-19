import { Inject, Injectable, InjectionToken, Provider, Type } from '@angular/core';
import { Entity, EntityService, RhetosRest, StructureInfo } from '@ngx-floyd/rhetos';
import { DataService } from './data.service';
import { Observable, of, switchMap } from 'rxjs';
import { FormState } from '@ngx-floyd/forms-formly';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ErrorFormatterService } from '../error-formatter.service';

export function provideEntityDataService(complexInfo: StructureInfo<any>): (Provider | Type<any>) {
  return [{ provide: DataService, useExisting: EntityDataService }, { provide: STRUCTURE_INFO, useValue: complexInfo }]
}

export const STRUCTURE_INFO = new InjectionToken<StructureInfo<any>>('STRUCTURE_INFO')

@Injectable()
export class EntityDataService<T extends Entity> extends DataService<T> {
  protected service: EntityService<T>;

  constructor(protected rhetos: RhetosRest,
    @Inject(STRUCTURE_INFO) public info: StructureInfo<T>,
    protected override confirmation: ConfirmationService,
    protected override dynamicDialog: DialogService,
    protected override message: MessageService,
    protected override error: ErrorFormatterService
  ) {
    super(confirmation, dynamicDialog, message, error);
    this.service = this.rhetos.forEntity(this.info);
  }

  protected getItem(itemId: string): Observable<T> {
    return this.service.single(itemId);
  }

  protected saveItem(item: T, formState: FormState): Observable<{ item: T, formState: FormState }> {
    const observable = formState === FormState.New ?
      this.service.insert(item).pipe(switchMap(v => this.service.single(v.ID))) :
      this.service.update(item).pipe(switchMap(() => this.service.single(item.ID)));
    return observable.pipe(switchMap(i => of({ item: i, formState })));
  }
}
