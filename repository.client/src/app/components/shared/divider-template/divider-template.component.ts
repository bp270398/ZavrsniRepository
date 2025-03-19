import { Component } from '@angular/core';
import { FloydFieldType } from '@ngx-floyd/forms-formly';

@Component({
  selector: 'app-divider-template',
  template: `<p-divider align="left" type="solid">
  <b>{{props['label']}}</b>
</p-divider>`
})
export class DividerTemplateComponent extends FloydFieldType {

}
