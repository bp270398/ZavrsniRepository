import { HttpClientModule } from '@angular/common/http';
import { InjectionToken, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RhetosModule } from '@ngx-floyd/rhetos';
import { ErrorVisualizer, FloydCoreUiModule } from '@ngx-floyd/core-ui';
import { MessageService, ConfirmationService, Translation } from 'primeng/api';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FloydTableModule } from '@ngx-floyd/table';
import { FloydFormsModule } from '@ngx-floyd/forms';
import { FloydFormsFormlyModule } from '@ngx-floyd/forms-formly';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { EntityComponent } from './components/shared/entity/entity.component';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { AvatarModule } from 'primeng/avatar';
import { SidebarModule } from 'primeng/sidebar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { StudentsComponent } from './components/dbo/students/students.component';
import { ProfessorsComponent } from './components/dbo/professors/professors.component';
import { EducationTypesComponent } from './components/dbo/education-types/education-types.component';
import { EducationLocationsComponent } from './components/dbo/education-locations/education-locations.component';
import { DocumentsComponent } from './components/dbo/documents/documents.component';
import { ErrorFormatterService } from './services/error-formatter.service';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { FileUploadModule } from 'primeng/fileupload';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { ChipModule } from 'primeng/chip';
import { TabViewModule } from 'primeng/tabview';
import { UserStorageService } from './services/user-storage.provider';
import { USER_CONTEXT, UserContextProvider } from './services/user-context.provider';
import { AuthService } from './services/auth.service';
import { FormlyFormComponent } from './components/shared/formly-form/formly-form.component';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { FormlyModule } from '@ngx-formly/core';
import { DynamicHostComponent } from './components/shared/dynamic-host/dynamic-host.component';
import { PdfViewerComponent } from './components/shared/pdf-viewer/pdf-viewer.component';
import { DocumentTemplatesComponent } from './components/dbo/document-templates/document-templates.component';
import { SubjectsComponent } from './components/dbo/subjects/subjects.component';
import { MenuModule } from 'primeng/menu';
import { DisabilityTypesSubtypesComponent } from './components/dbo/disability-types-subtypes/disability-types-subtypes.component';
import { TreeModule } from 'primeng/tree';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';
import { LoginComponent } from './components/auth/login/login.component';

import { FileUploadComponent } from './components/shared/file-upload/file-upload.component';
import { DownloadColumnComponent } from './components/shared/download-column/download-column.component';
import { TableComponent } from './components/shared/table/table.component';
import { DetailTemplateComponent } from './components/shared/detail-template/detail-template.component';
import { DividerModule } from 'primeng/divider';
import { DividerTemplateComponent } from './components/shared/divider-template/divider-template.component';
import { FloydToolbarModule } from '@ngx-floyd/toolbar';
import { ErrorComponent } from './components/shared/error/error.component';
import { CardModule } from 'primeng/card';
import { FilterableRouteDirective } from './services/filterable-route.directive';
import { CalendarModule } from 'primeng/calendar';
import { FormlyDatepickerModule } from '@ngx-formly/primeng/datepicker';
import { FormlyFieldDatepicker } from '@ngx-formly/primeng/datepicker/datepicker.type';
import { FormlyFormFieldModule } from '@ngx-formly/primeng/form-field';
import { FormlyPrimeNGModule } from '@ngx-formly/primeng';
import { DropdownModule } from 'primeng/dropdown';


export const PRIME_NG_TRANSLATION = new InjectionToken<Translation>('PRIME_NG_TRANSLATION');

@NgModule({
  declarations: [
    AppComponent,
    EntityComponent,
    FormlyFormComponent,
    StudentsComponent,
    ProfessorsComponent,
    EducationTypesComponent,
    EducationLocationsComponent,
    DocumentsComponent,
    DocumentTemplatesComponent,
    SubjectsComponent,
    PdfViewerComponent,
    DisabilityTypesSubtypesComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    LoginComponent,
    FileUploadComponent,
    DownloadColumnComponent,
    TableComponent,
    DetailTemplateComponent,
    DividerTemplateComponent,
    ErrorComponent,
    FilterableRouteDirective,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RhetosModule.withConfig(environment.rhetosConfig),
    FloydCoreUiModule.withConfig(environment.floydConfig),
    FloydTableModule,
    FloydToolbarModule,
    FloydFormsModule,
    FloydFormsFormlyModule,
    FormlyModule.forChild({
      types: [
        { name: 'Detail', component: DetailTemplateComponent },
        { name: 'Divider', component: DividerTemplateComponent },
      ]
    }),
    FormlyDatepickerModule,
    FormlyFormFieldModule,
    FormlyPrimeNGModule,
    NgxExtendedPdfViewerModule,
    FileUploadModule,
    TableModule,
    TabViewModule,
    ButtonModule,
    MenubarModule,
    MenuModule,
    AvatarModule,
    AvatarGroupModule,
    DynamicDialogModule,
    MessagesModule,
    ToastModule,
    ConfirmDialogModule,
    ScrollPanelModule,
    SidebarModule,
    TreeModule,
    ProgressSpinnerModule,
    ChipModule,
    OverlayPanelModule,
    CardModule,
    DividerModule,
    CalendarModule,
    DropdownModule,
    /* standalone */
    DynamicHostComponent
  ],
  providers: [
    MessageService,
    ConfirmationService,
    DialogService,
    ErrorFormatterService,
    UserContextProvider,
    UserStorageService,
    AuthService,
    { provide: ErrorVisualizer, useExisting: ErrorFormatterService },
    { provide: USER_CONTEXT, useClass: UserContextProvider },
    { provide: PRIME_NG_TRANSLATION, useValue: environment.primeNgTranslation },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
