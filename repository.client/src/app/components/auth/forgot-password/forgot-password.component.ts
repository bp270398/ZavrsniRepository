import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, Optional, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FloydFormlyConfigurationBuilder } from '@ngx-floyd/forms-formly';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { AuthService } from '../../../services/auth.service';
import { ErrorFormatterService } from '../../../services/error-formatter.service';

@Component({
  selector: 'app-forgot-password',
  template: `
  <div style="display:flex;flex-direction:column;justify-content:center; align-items:center;margin: auto 1em;"> 
  <h2>Unesite svoju email adresu kako bismo Vam poslali poveznicu za ponovno postavljanje lozinke</h2>

  <form [formGroup]="form" (ngSubmit)="submit()">
    <formly-form
      [model]="model"
      [fields]="fields"
      [options]="options"
      [form]="form">
    </formly-form>
    <div>
      <button
        pButton
        pripple
        type="submit"
        class="p-element p-ripple p-button-raised p-button-text p-button-sm p-component"
        [disabled]="!(form.valid && form.dirty)"
      >
        Pošalji
      </button>
    </div>
  </form>
 
  </div>
  `,
})
export class ForgotPasswordComponent {

  form: FormGroup = new FormGroup({});
  fields: FormlyFieldConfig[] = [];
  model = {
    Email: ''
  };
  options: FormlyFormOptions = {
    formState: {
      awesomeIsForced: false,
    },
  };
  dynamicDialogRef?: DynamicDialogRef;
  @Output() submitted = new EventEmitter<any>();

  constructor(private authService: AuthService,
    public cdRef: ChangeDetectorRef,
    private router: Router,
    private messageService: MessageService,
    private errorService: ErrorFormatterService,
    @Optional() private dialogConfig: DynamicDialogConfig
  ) {
    if (dialogConfig) {
      if (dialogConfig.data.formConfiguration)
        this.formConfiguration = dialogConfig.data.formConfiguration;

      if (dialogConfig.data.ref)
        this.dynamicDialogRef = dialogConfig.data.ref;
    }

  }

  ngAfterViewInit(): void {
    const configuration = this.formConfiguration();
    this.form = configuration.form;
    this.fields = configuration.fields;
  }

  formConfiguration = () => {
    const builder = new FloydFormlyConfigurationBuilder<any>();
    builder
      .shortString('Email', 'Email', c => c
        .required()
        .pattern('^[^@]+@[^@]+\.[^@]+$', 'Unesite validan email'))

    return builder.getConfiguration();
  };

  submit() {
    if (this.validate()) {
      debugger;
      this.authService.sendResetPasswordEmail(this.model.Email)
        .subscribe(
          (result) => {
            this.messageService.add({ severity: 'success', summary: `Poveznicu za ponovno postavljanje lozinke pronaći ćete u svom poštanskom pretincu (${this.model.Email})` })
            this.router.navigate(['prijava-u-sustav']);
          },
          (err) => this.errorService.showError(err)
        );
    }
  }

  validate() {
    this.form.markAllAsTouched();
    this.cdRef.detectChanges();
    return this.form.valid;
  }

}
