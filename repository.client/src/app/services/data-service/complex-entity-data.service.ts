import { Inject, Injectable, InjectionToken, Provider, Type } from '@angular/core';
import { FormState } from '@ngx-floyd/forms-formly';
import { ComplexInfo, Entity, ComplexService, RhetosRest } from '@ngx-floyd/rhetos';
import { Observable, switchMap, of } from 'rxjs';
import { DataService } from './data.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ErrorFormatterService } from '../error-formatter.service';

export function provideComplexEntityDataService(complexInfo: ComplexInfo<any>): (Provider | Type<any>) {
  return [{ provide: DataService, useExisting: ComplexEntityDataService }, { provide: COMPLEX_INFO, useValue: complexInfo }]
}

export const COMPLEX_INFO = new InjectionToken<ComplexInfo<any>>('COMPLEX_INFO')

@Injectable()
export class ComplexEntityDataService<T extends Entity> extends DataService<T> {
  protected service: ComplexService<T>;

  constructor(protected rhetos: RhetosRest,
    @Inject(COMPLEX_INFO) public info: ComplexInfo<T>,
    protected override confirmation: ConfirmationService,
    protected override dynamicDialog: DialogService,
    protected override message: MessageService,
    protected override error: ErrorFormatterService
  ) {
    super(confirmation, dynamicDialog, message, error);
    this.service = this.rhetos.forComplex(this.info);
  }

  protected getItem(itemId: string): Observable<T> {
    return this.service.get(itemId);
  }

  protected saveItem(item: T, formState: FormState): Observable<{ item: T, formState: FormState }> {
    return this.service.save(item)
      .pipe(switchMap(i => of({ item: i, formState })));
  }
}