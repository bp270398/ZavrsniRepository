import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { PERMISSION_MANAGER, PermissionManager } from '@ngx-floyd/core';
import { MenuItem, PrimeIcons, PrimeNGConfig, Translation } from 'primeng/api';
import { PRIME_NG_TRANSLATION } from './app.module';
import { ToolbarConfigurationParams } from '@ngx-floyd/toolbar';
import { USER_CONTEXT, UserContextProvider } from './services/user-context.provider';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Title } from '@angular/platform-browser';
import { executeAsync } from './extension.methods';
import { LocalStorage, UserStorageService } from './services/user-storage.provider';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy$$ = new Subject<void>();
  readonly destroy$ = this.destroy$$.asObservable();

  avatarLabel$$ = new BehaviorSubject<string>('');
  avatarLabel$: Observable<string> = this.avatarLabel$$.asObservable();

  title = '';
  menuItems: MenuItem[] = [];
  userMenuItems: MenuItem[] = [];
  toolbarConfiguration!: ToolbarConfigurationParams;
  avatarLabel = '?';

  constructor(private primeng: PrimeNGConfig,
    @Inject(PERMISSION_MANAGER) private permissionManager: PermissionManager,
    @Inject(PRIME_NG_TRANSLATION) private translation: Translation,
    @Inject(USER_CONTEXT) public userContext: UserContextProvider,
    private authService: AuthService,
    private titleService: Title,
    private userStorage: UserStorageService,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef
  ) {
    this.permissionManager.loadUserData();
    this.userContext.loadUserData();
    this.userContext.userContextLoaded$.pipe(takeUntil(this.destroy$)).subscribe((v) => {

      var user = this.userContext.currentUser;

      const url = (this.route.snapshot as any)['_routerState'].url as string;

      if (
        !user?.PrincipalID &&
        !url.startsWith('/postavljanje-lozinke') &&
        !url.startsWith('/prijava-u-sustav') &&
        !url.startsWith('/zaboravljena-lozinka')
      )
        this.authService.redirectToLogin();

      debugger;
      this.avatarLabel = user?.PrincipalID ? `${user.FirstName?.[0]}${user.LastName?.[0]}` : '?';
    });

  }

  ngOnInit() {
    this.primeng.ripple = true;
    this.primeng.setTranslation(this.translation);
    this.setMenubarItems();
    this.setUserMenubarItems();
  }

  ngOnDestroy(): void {
    this.destroy$$.next();
    this.destroy$$.complete()
  }

  public onRouterOutletActivate(event: any) {
    executeAsync(() => this.title = this.titleService.getTitle())
    // TODO delete if slow
    // if (
    //   !window.location.href.includes('greska') &&
    //   !window.location.href.includes('prijava-u-sustav') &&
    //   !window.location.href.includes('zaboravljena-lozink') &&
    //   !window.location.href.includes('postavljanje-lozinke')
    // )
    //   this.userStorage.set('lastVisitedUrl', window.location.href)
  }

  setMenubarItems() {
    this.menuItems = [
      {
        icon: PrimeIcons.BARS,
        id: 'topbar-menu-btn',
        items:
          [
            { label: 'Učenici', url: 'ucenici', target: '_self' },
            { label: 'Dokumenti', url: 'dokumenti', target: '_self' },
            { label: 'Predlošci', url: 'predlosci', target: '_self' },
            { label: 'Učitelji', url: 'ucitelji', target: '_self' },
            { label: 'Orijentacijska lista teškoća', url: 'orijentacijska-lista-teskoca', target: '_self' },
            { label: 'Predmeti', url: 'predmeti', target: '_self' },
            { label: 'Vrste primjerenog oblika školovanja', url: 'vrste-primjerenog-oblika-skolovanja', target: '_self' },
            { label: 'Lokacije primjerenog oblika školovanja', url: 'lokacije-primjerenog-oblika-skolovanja', target: '_self' }
          ]
      }
    ];
  }

  setUserMenubarItems() {
    this.userMenuItems = [
      {
        label: 'Odjava', command: ($event) => {
          this.authService.logout().pipe(takeUntil(this.destroy$)).subscribe(v => {
            this.avatarLabel = '?';
            // todo add message
            this.authService.redirectToLogin()
            window.location.reload();
          });
        }
      },
    ];
  }

  refreshAvatar() {
    var user = this.userContext.currentUser;
    this.avatarLabel = user?.PrincipalID ? `${user.FirstName?.[0]}${user.LastName?.[0]}` : '?';

  }
}
