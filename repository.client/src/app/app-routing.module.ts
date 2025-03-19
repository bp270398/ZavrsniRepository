import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentsComponent } from './components/dbo/students/students.component';
import { ProfessorsComponent } from './components/dbo/professors/professors.component';
import { SubjectsComponent } from './components/dbo/subjects/subjects.component';
import { EducationTypesComponent } from './components/dbo/education-types/education-types.component';
import { EducationLocationsComponent } from './components/dbo/education-locations/education-locations.component';
import { DocumentsComponent } from './components/dbo/documents/documents.component';
import { DisabilityTypesSubtypesComponent } from './components/dbo/disability-types-subtypes/disability-types-subtypes.component';
import { DocumentTemplatesComponent } from './components/dbo/document-templates/document-templates.component';
import { LoginComponent } from './components/auth/login/login.component';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';
import { ErrorComponent } from './components/shared/error/error.component';

const routes: Routes = [
  { path: '', redirectTo: '/ucenici', pathMatch: 'full' },
  { path: 'dokumenti', component: DocumentsComponent, title: 'Dokumenti' },
  { path: 'predlosci', component: DocumentTemplatesComponent, title: 'Predlošci' },
  { path: 'predmeti', component: SubjectsComponent, title: 'Predmeti' },
  { path: 'ucenici', component: StudentsComponent, title: 'Učenici' },
  { path: 'ucitelji', component: ProfessorsComponent, title: 'Učitelji' },
  { path: 'vrste-primjerenog-oblika-skolovanja', component: EducationTypesComponent, title: 'Vrste primjerenog oblika školovanja' },
  { path: 'lokacije-primjerenog-oblika-skolovanja', component: EducationLocationsComponent, title: 'Lokacije primjerenog oblika školovanja' },
  { path: 'orijentacijska-lista-teskoca', component: DisabilityTypesSubtypesComponent, title: 'Orijentacijska lista teškoća' },
  { path: 'prijava-u-sustav', component: LoginComponent, title: 'Prijava u sustav' },
  { path: 'zaboravljena-lozinka', component: ForgotPasswordComponent, title: 'Zaboravljena lozinka' },
  { path: 'postavljanje-lozinke', component: ResetPasswordComponent, title: 'Postavljanje lozinke' },
  { path: 'greska', component: ErrorComponent, title: 'Greška' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
