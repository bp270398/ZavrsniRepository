import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserStorageService } from '../../../services/user-storage.provider';

@Component({
  selector: 'app-error',
  template: `
  <span style="width:100%;height:40vh;">
  <div class="card flex justify-content-center" style="margin:10vw;">
    <p-card [header]="header" [style]="{ width: '80vw' }">
        <p style="font-size:larger;"> {{message}} </p>
        <ng-template pTemplate="footer">
          <div class="flex w-100  mt-1">
            <p class="flex-start mt-1"> 
              Povratak na početnu stranicu za {{countdown}} s. 
            </p>
            <div class="flex-end mt-1">
              <p-button 
              label="Natrag" 
              class="w-full" 
              severity="secondary"
              styleClass="w-full" 
              (onClick)="tryAgain()"/>
            </div>
          </div>
        </ng-template>
    </p-card>
</div>
  </span>
  `,
})
export class ErrorComponent implements OnInit {
  @Input() header: string = 'Došlo je do neočekivane pogreške'
  @Input() message: string = 'Molimo Vas da pokušate ponovo za nekoliko minuta ili kontaktirajte administratora sustava.'

  @Input() withCountDown = true;
  @Input() redirectUrl = '/';;

  countdown: number = 30;

  constructor(private router: Router, private userStorage: UserStorageService) { }

  ngOnInit(): void {
    if (this.withCountDown) {
      const countdownInterval = setInterval(() => {
        this.countdown--;

        if (this.countdown === 0) {
          clearInterval(countdownInterval);
          this.router.navigateByUrl(this.redirectUrl);
        }
      }, 1000);
    }
  }

  tryAgain() {
    const url = this.userStorage.get('lastVisitedUrl')
    if (url)
      window.open(url, "_self")
    else
      this.router.navigateByUrl(this.redirectUrl);
  }
}
