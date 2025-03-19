import { EventEmitter } from '@angular/core';
import { deepMap, newGuid } from '@ngx-floyd/core';
import { FormState } from '@ngx-floyd/forms-formly';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { map, Observable, take, tap } from 'rxjs';
import { executeAsync } from '../../extension.methods';
import { ErrorFormatterService } from '../error-formatter.service';

export abstract class DataService<T = unknown> {

  submitChanges$?: Observable<{
    item: Partial<T>;
    formState: FormState;
  }>;

  public originalItem?: Partial<T>;
  public currentItem?: Partial<T>;
  public formState: FormState = FormState.Edit;

  private _saveSuccessMessage = { summary: 'Uspješno spremljeno!', severity: 'success' };

  constructor(
    protected confirmation: ConfirmationService,
    protected dynamicDialog: DialogService,
    protected message: MessageService,
    protected error: ErrorFormatterService,
  ) { }

  protected abstract getItem(itemId: string): Observable<T>;
  protected abstract saveItem(item: Partial<T>, formState: FormState): Observable<{ item: Partial<T>, formState: FormState }>;

  public onBeforeNewItem?: (item: any, formState: FormState) => { item: Partial<T>, formState: FormState }
  public onAfterLoadItem?: (item: any, formState: FormState) => { item: Partial<T>, formState: FormState }
  public onBeforeDeleteItem?: (item: any, formState: FormState) => { item: Partial<T>, formState: FormState }
  public onAfterDeleteItem?: (item: any, formState: FormState) => { item: Partial<T>, formState: FormState }
  public onBeforeSubmitChanges?: (item: any, formState: FormState) => { item: Partial<T>, formState: FormState }
  public onAfterSubmitChanges?: (item: Partial<T>, formState: FormState) => { item: Partial<T>, formState: FormState }
  public submitted = new EventEmitter<{ item: Partial<T>, formState: FormState }>();
  public loaded = new EventEmitter<{ item: Partial<T>, formState: FormState }>();

  loadItem(itemId: string): Observable<{ item: any, formState: FormState }> {
    return this.getItem(itemId)
      .pipe(map(i => {
        this.formState = FormState.Edit;
        if (this.onAfterLoadItem && i) {
          const r = this.onAfterLoadItem(i, this.formState);
          return { item: r.item, formState: r.formState };
        } else
          return { item: i, formState: this.formState };
      }))
      .pipe(
        take(1),
        tap(v => {
          this.originalItem = v.item;
          this.currentItem = deepMap(v.item, val => val);
          this.formState = v.formState ?? FormState.Edit;
        }))
  }

  newItem(item?: Partial<T>) {
    this.originalItem = undefined;
    this.currentItem = item ?? { ID: newGuid() } as T;
    this.formState = FormState.New;
    if (this.onBeforeNewItem) {
      var v = this.onBeforeNewItem(this.currentItem, this.formState);
      this.currentItem = v.item;
      this.formState = v.formState;
    }
    else {
      this.currentItem = { ID: newGuid() } as T;
    }
  }

  discardChanges(global: boolean = false): void {
    this.currentItem = this.originalItem;
  }

  unselectItem() {
    this.originalItem = undefined;
    this.currentItem = undefined;
  }

  submitChanges(item: Partial<T>, formState: FormState): void {
    if (this.onBeforeSubmitChanges) {
      let v = this.onBeforeSubmitChanges(item, formState);
      item = v.item;
      formState = v.formState
    }

    this.submitChanges$ = this.saveItem(item, formState)
      .pipe(
        take(1),
        tap((value: { item: Partial<T>; formState: FormState; }) => {
          this.originalItem = value.item;
          this.currentItem = value.item;
        }));

    this.submitChanges$.subscribe(
      {
        next: (v) => {
          this.submitted.emit({ item: v.item, formState: v.formState });
          if (this.onAfterSubmitChanges)
            executeAsync(() => this.onAfterSubmitChanges!(v.item, v.formState))

          var currentId = (this.currentItem as any)['ID'];
          if (currentId)
            this.loadItem(currentId);
        },
        complete: () => { this.message.add(this._saveSuccessMessage) },
        error: (e) => this.error.showError(e),
      }
    );
  }

  reactivateItem(itemOrId?: Partial<T>, confirmationConfig?: { header: string }) {
    if (!itemOrId && !this.currentItem)
      throw Error('ERROR: Parametri itemOrId i this.currentItem su svi undefined');

    const validateItem = (item: any) => {
      if (!('Active' in item)) throw Error('ERROR:Parametar item nema parametar Active');
      if ((item as any)['Active'] === true) throw Error('ERROR: Objekt je već aktivan');
    }

    const openConfirmation = (item: any) => {
      this.confirmation.confirm({
        header: 'Jeste li sigurni da želite aktivirati zapis?',
        message: 'To znači da će ga opet biti moguće koristiti u novim zapisima.',
        acceptLabel: 'Aktiviraj',
        rejectLabel: 'Odustani',
        defaultFocus: 'reject',
        accept: () => {
          (item as any)['Active'] = true;
          this.submitChanges(item, FormState.Edit);
        }
      });
    }

    if (itemOrId) {
      if ((itemOrId as any)['ID']) // proslijeđen je item
      {
        validateItem(itemOrId);
        openConfirmation(itemOrId);
      }
      else if (typeof (itemOrId) === 'string') // proslijeđen je id
        this.loadItem(itemOrId).pipe(take(1)).subscribe((value: { item: Partial<T>; formState: FormState; }) => {
          validateItem(value.item);
          openConfirmation(value.item);
        })
    }
    else if (this.currentItem) {
      validateItem(this.currentItem);
      openConfirmation(this.currentItem);
    }
  }

  deactivateItem(itemOrId?: Partial<T>, confirmationConfig?: { header: string }) {
    if (!itemOrId && !this.currentItem)
      throw Error('ERROR: Parametri itemOrId i this.currentItem su svi undefined');

    const validateItem = (item: any) => {
      if (!('Active' in item)) throw Error('ERROR:Parametar item nema parametar Active');
      if ((item as any)['Active'] === false) throw Error('ERROR: Objekt je već deaktiviran');
    }

    const openConfirmation = (item: any) => {
      this.confirmation.confirm({
        header: 'Jeste li sigurni da želite deaktivirati zapis?',
        message: 'To znači da ga više neće biti moguće koristiti u novim zapisima.',
        acceptLabel: 'Deaktiviraj',
        rejectLabel: 'Odustani',
        defaultFocus: 'reject',
        accept: () => {
          (item as any)['Active'] = false;
          this.submitChanges(item, FormState.Edit);
        }
      });
    }

    if (itemOrId) {
      if ((itemOrId as any)['ID']) // proslijeđen je item
      {
        validateItem(itemOrId);
        openConfirmation(itemOrId);
      }
      else if (typeof (itemOrId) === 'string') // proslijeđen je id
        this.loadItem(itemOrId).pipe(take(1)).subscribe((value: { item: Partial<T>; formState: FormState; }) => {
          validateItem(value.item);
          openConfirmation(value.item);
        })
    }
    else if (this.currentItem) {
      validateItem(this.currentItem);
      openConfirmation(this.currentItem);
    }

  }
}
