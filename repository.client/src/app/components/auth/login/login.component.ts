import { AfterViewInit, Component, OnDestroy, OnInit, Optional } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FloydFormlyConfigurationBuilder, FloydFormlyConfigurationParams } from '@ngx-floyd/forms-formly';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { UserContextProvider } from '../../../services/user-context.provider';
import { ErrorFormatterService } from '../../../services/error-formatter.service';
import { AuthService } from '../../../services/auth.service';
import { Subject, take, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-login',
  template: `
  <span style="width:100vw;height:40vh;">
  <div class="card flex" style="align-items:center;justify-content:center;margin: 4rem auto;">
    <p-card header="Prijavite se za nastavak" [style]="{ width: 'auto' }">
        <div style="display:flex;flex-direction:column;justify-content:center; align-items:center; margin: 1em auto;"> 
      <form [formGroup]="form" (ngSubmit)="submit()" style="margin: auto;">
        <formly-form
          [model]="model"
          [fields]="fields"
          [options]="options"
          [form]="form">
        </formly-form>
        <p-button 
          label="Zaboravili ste lozinku?" 
          [link]="true"
          (onClick)="redirectToSendResetPasswordEmailComponent()"
          size="small" />
        <div>
        </div>
        <div class="flex-end w-100 mt-1">
                <button
                  pButton
                  pripple
                  type="submit"
                  class="p-element p-ripple p-button-raised p-button-text p-component"
                  [disabled]="!(form.valid && form.dirty)">
                  Prijava
                </button>
            </div>
      </form>
  </div>
    </p-card>
</div>
  </span>
  `,
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {

  dynamicDialogRef?: DynamicDialogRef;
  model?: any = {
    userName: '',
    password: '',
    persistCookie: true,
  };
  form = new FormGroup({});
  options: FormlyFormOptions = {

  };
  fields: FormlyFieldConfig[] = [];
  private destroy$$ = new Subject<void>();
  readonly destroy$ = this.destroy$$.asObservable();

  formConfiguration!: () => FloydFormlyConfigurationParams;

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private errorService: ErrorFormatterService,
    private userContext: UserContextProvider,
    @Optional() dialogConfig: DynamicDialogConfig) {
    if (dialogConfig && dialogConfig.data.ref) {
      this.dynamicDialogRef = dialogConfig.data.ref;
    }
    this.userContext.loadUserData().pipe(take(1))
      .subscribe((v) => {
        var user = this.userContext.currentUser;
        if (user && user.PrincipalID)
          this.router.navigate(['./'])
      });
  }

  ngOnInit(): void {
    this.formConfiguration = () => this.getFormConfiguration();
  }

  ngAfterViewInit(): void {
    const configuration = this.formConfiguration();
    this.form = configuration.form;
    this.fields = configuration.fields;
  }

  ngOnDestroy(): void {
    this.destroy$$.next();
    this.destroy$$.complete();
  }

  getFormConfiguration(): FloydFormlyConfigurationParams {
    const builder = new FloydFormlyConfigurationBuilder<{ userName: string, password: string }>();
    builder
      .shortString('userName', 'Korisničko ime', c => c.required())
      .shortString('password', 'Lozinka', c => c
        .required()
        .expressionProperty('props.type', () => 'password')
      )

    return builder.getConfiguration()
  }

  submit() {
    if (this.form.valid) {

      this.authService.login({ userName: this.model.userName, password: this.model.password, persistCookie: true })
        .subscribe(
          (result) => {
            if (result == true) {
              this.messageService.clear();
              this.messageService.add({ severity: 'success', summary: 'Uspješno ste se prijavili!' })
              this.dynamicDialogRef?.close();
              this.userContext.loadUserData()
              this.router.navigate(['./'])
            }
            else
              this.messageService.add({ severity: 'danger', summary: 'Podaci nisu ispravni ili vam je uskraćen pristup sustavu. Pokušajte ponovo ili kontaktirajte administratora.', sticky: true })
          },
          (err) => this.errorService.showError(err)
        );
    }
  }

  redirectToSendResetPasswordEmailComponent() {
    this.router.navigate(['zaboravljena-lozinka']);
  }
}
