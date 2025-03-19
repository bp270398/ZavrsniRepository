import { AfterViewInit, ChangeDetectorRef, Component, Optional } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FloydFormlyConfigurationBuilder } from '@ngx-floyd/forms-formly';
import { MessageService } from 'primeng/api';
import { ErrorFormatterService } from '../../../services/error-formatter.service';
import { take } from 'rxjs';
import { executeAsync } from '../../../extension.methods';

@Component({
  selector: 'app-reset-password',
  template: `
  <div style="display:flex;flex-direction:column;justify-content:center; align-items:center;margin: auto 1em;"> 
  <h2>Kreirajte novu lozinku</h2>
  <form [formGroup]="form" (ngSubmit)="submit()" style="margin: auto;">
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
        Spremi
      </button>
    </div>
    <br />
  </form>
 
  </div>
  `,
})
export class ResetPasswordComponent implements AfterViewInit {

  token!: string;

  form: FormGroup = new FormGroup({});
  fields: FormlyFieldConfig[] = [];
  model = {
    Password: '',
    PasswordConfirmation: ''
  };
  options: FormlyFormOptions = {
    formState: {
      awesomeIsForced: false,
    },
  };
  dynamicDialogRef?: DynamicDialogRef;

  constructor(private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    public cdRef: ChangeDetectorRef,
    private message: MessageService,
    private error: ErrorFormatterService,
    @Optional() private dialogConfig: DynamicDialogConfig
  ) {

    this.token = this.route.snapshot.queryParams['id'];
    if (!this.token)
      this.message.add({ severity: 'danger', summary: 'Greška', detail: 'Nevažeća poveznica.' })
    else {
      this.authService.verifyToken(this.token).pipe(take(1)).subscribe((value) => {
        // TODO improve UI/UX
        if (!(value as Date) || (value as Date) < new Date())
          this.message.add({ severity: 'danger', detail: 'Ova poveznica je istekla. Zatražite novu poveznicu.', summary: 'Greška', closable: false, sticky: true })
      })
    }

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
      .shortString('Password', 'Lozinka', c => c
        .required()
        .expressionProperty('props.type', () => 'password')
      )
      .shortString('PasswordConfirmation', 'Potvrda lozinke', c => c
        .required()
        .expressionProperty('props.type', () => 'password')
      )

    return builder.getConfiguration();
  };

  submit() {
    if (this.validate()) {
      this.authService.resetPassword({ token: this.token, password: this.model.Password })
        .subscribe(
          () => {
            executeAsync(() => this.message.add({ severity: 'success', summary: `Uspješno ste postavili lozinku.` }))
            this.router.navigate(['prijava-u-sustav']);
          },
          (err) => this.error.showError(err)
        );
    }
  }

  validate() {
    this.form.markAllAsTouched();
    this.cdRef.detectChanges();

    if (this.model.Password !== this.model.PasswordConfirmation) {
      this.message.add({ severity: 'danger', summary: 'Vrijednosti u poljima Lozinka i Potvrda lozinke moraju se poklapati!' })
      return false;
    }

    return this.form.valid;
  }
}
