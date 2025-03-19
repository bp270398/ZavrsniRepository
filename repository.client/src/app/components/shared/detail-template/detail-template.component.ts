import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormState } from '@ngx-floyd/forms-formly';
import { FieldArrayType } from '@ngx-formly/core';
import { PrimeIcons } from 'primeng/api';
import { Observable, take } from 'rxjs';

@Component({
  selector: 'app-detail-template',
  templateUrl: './detail-template.component.html',
  styleUrls: ['./detail-template.component.css']
})
export class DetailTemplateComponent extends FieldArrayType {
  @Input() removeIcon: string = PrimeIcons.PLUS;
  @Input() addIcon: string = PrimeIcons.TIMES;

  readonly readonlyState = FormState.ReadOnly;

  constructor(private cdRef: ChangeDetectorRef) {
    super()
  }

  removeItem(index: number) {

    const remove = () => {
      this.remove(index);
      this.cdRef.detectChanges();
    }
    const onRemoveItem = this.props['onRemoveItem'] as ((model: any[], index: number) => Observable<boolean>);
    if (onRemoveItem)
      onRemoveItem(this.model, index).pipe(take(1)).subscribe(v => {
        if (v) remove;
      })
    else remove()
  }
}


/*
  Usage example:

   .detailForm<Common.PrincipalHasRole>('PrincipalHasRoles', c => c
                  .detailTemplate('Detail')
                  .fields(f => f
                    .autoComplete('RoleID', 'Uloga', c => c
                      .disable(true)
                      .dataSource(() =>
                        this.lookupDataSource
                          .forQueryable(Common.RoleInfo)
                          .valueField('ID')
                          .displayField('Name')
                          .autocompleteSearchFn((query, value) => query.where('Name', 'Contains', value))
                          .dataSource())
                    )
                  )
                )

*/