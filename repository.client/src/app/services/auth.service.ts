import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RhetosRest } from '@ngx-floyd/rhetos';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private rhetos: RhetosRest, private router: Router) { }

  redirectToLogin() {
    this.router.navigate(['prijava-u-sustav']);
  }



  login(data: { userName: string, password: string, persistCookie: boolean }): Observable<any> {
    return this.http
      .post(
        this.rhetos.rhetosConfig.url + '/Resources/AspNetFormsAuth/Authentication/Login',
        data,
        { withCredentials: true }
      );
  }

  logout(): Observable<any> {
    return this.http
      .post(
        this.rhetos.rhetosConfig.url + '/Resources/AspNetFormsAuth/Authentication/Logout',
        { withCredentials: true }
      );
  }

  sendResetPasswordEmail(email: string): Observable<any> {
    return this.http
      .post(
        this.rhetos.rhetosConfig.url + `/rest/Auth/SendResetPasswordEmail?Email=${email}`,
        { withCredentials: true }
      );
  }

  resetPassword(data: { token: string, password: string }): Observable<any> {
    return this.http
      .post(
        this.rhetos.rhetosConfig.url + `/rest/Auth/ResetPassword?Token=${data.token}&Password=${data.password}`,
        { withCredentials: true }
      );
  }

  verifyToken(token: string): Observable<any> {
    return this.http
      .get(
        this.rhetos.rhetosConfig.url + `/rest/Auth/VerifyToken?Token=${token}`,
        { withCredentials: true }
      );
  }

}
