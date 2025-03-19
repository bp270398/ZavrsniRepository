import { Injectable, InjectionToken } from '@angular/core';
import { UserSpecificData } from '@ngx-floyd/core';
import { RhetosRest } from '@ngx-floyd/rhetos';
import { map, Observable, Subject, tap } from 'rxjs';
import { Common } from '../../main';
import { ErrorFormatterService } from './error-formatter.service';

export interface UserContext extends UserSpecificData {
  UserContext: Common.UserContext | undefined;
}

export const USER_CONTEXT = new InjectionToken<UserContext>('USER_CONTEXT');

@Injectable()
export class UserContextProvider implements UserContext {
  private _context?: Common.UserContext;
  private userContextLoaded$$ = new Subject<void>();
  readonly userContextLoaded$ = this.userContextLoaded$$.asObservable();

  constructor(private rhetos: RhetosRest, private error: ErrorFormatterService
  ) {
    this.loadUserData();
  }

  public get currentUser() {
    return this._context;
  }

  public get UserContext(): Common.UserContext | undefined {
    return this._context;
  }

  loadUserData(): Observable<void> {
    this._context = undefined;
    return this.rhetos
      .forFunction(Common.GetUserContextFunctionInfo)
      .execute({})
      .pipe(
        map((value) => {
          this._context = value;
          this.userContextLoaded$$.next();
        }),
        tap(() => { }, err => this.error.showError(err))
      );
  }
}
