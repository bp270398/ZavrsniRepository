import { Inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getRhetosErrorMessage, isRhetosError, isUserError } from '@ngx-floyd/core';
import { FLOYD_UI_CONFIG } from '@ngx-floyd/core-ui';
import { MessageService } from 'primeng/api';
import { auditTime, Subject } from 'rxjs';

export interface RhetosErrorMessage {
  SystemMessage?: string;
  UserMessage?: string;
}

export interface RhetosError {
  error: RhetosErrorMessage;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorFormatterService {

  private readonly showError$$ = new Subject<string>();
  private readonly DEFAULT = 'Greška.';

  private readonly ErrorMessages = [
    {
      original: 'User is not authenticated.',
      translated: 'Korisnik nije prijavljen.',
    },
    {
      original: 'It is not allowed to enter a duplicate record.',
      translated: 'Nije dozvoljeno dodati dupli zapis.',
    },
    {
      original: 'It is not allowed to delete a record that is referenced by other records.',
      translated: 'Nije dozvoljeno obrisati zapis koji je referenca drugim zapisima.',
    },
    {
      original: '',
      translated: '',
    },
  ];

  constructor(
    private messageService: MessageService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    @Inject(FLOYD_UI_CONFIG) private config: FloydUiConfig
  ) {
    this.showError$$.pipe(auditTime(250)).subscribe((x) => this.show(x));
  }

  getErrorMessage(error: Error) {

    const isRhetosErr = isRhetosError(error);
    const message = isUserError(error)
      ? getRhetosErrorMessage(error)
      : isRhetosErr
        ? this.DEFAULT
        : error.message;
    const translated = this.ErrorMessages.find(
      (x) => x.original === message
    )?.translated;

    const accountNotRegisteredRegex = /Your account '(.+?)' is not registered in the system\. Please contact the system administrator\./;
    const match = message.match(accountNotRegisteredRegex);
    if (match) {
      const username = match[1];
      return `Korisnički račun '${username}' nije registriran u sustavu. Molimo kontaktirajte administratora sustava.`;
    }

    const unauthorizedRegex = /You are not authorized for action '(.+?)' on resource '(.+?)', user '(.+?)'\./;
    const unauthorizedMatch = message.match(unauthorizedRegex);
    if (unauthorizedMatch) {
      const action = unauthorizedMatch[1];
      const resource = unauthorizedMatch[2];
      const username = unauthorizedMatch[3];

      return `Nemate dozvolu za akciju '${action}' nad resursom '${resource}', korisnik '${username}'.`;
    }

    const missingPropertyRegex = /It is not allowed to enter (.+?) because the required property (.+?) is not set\./;
    const missingPropertyMatch = message.match(missingPropertyRegex);
    if (missingPropertyMatch) {
      const entity = missingPropertyMatch[1];
      const property = missingPropertyMatch[2];

      return `Nije dozvoljeno unijeti '${entity}' jer atribut '${property}', nije zadan.`;
    }

    return translated ?? message;
  }

  showError(error: Error) {
    var errorMessage = this.getErrorMessage(error)

    console.log(error)
    if ((error as any)['statusText'] == 'Unknown Error')
      this.router.navigate(['greska']);

    const url = (this.activatedRoute.snapshot as any)['_routerState'].url as string;

    if (!url.startsWith('/postavljanje-lozinke') || !errorMessage.includes(`Cannot read properties of null (reading 'ContentControlInfos')`)) {

      this.showError$$.next(errorMessage);

      if (errorMessage == 'Korisnik nije prijavljen.'
        || errorMessage.endsWith('nije registriran u sustavu. Molimo kontaktirajte administratora sustava.')
      ) {
        this.router.navigate(['prijava-u-sustav']);
      }
    }
  }

  private show(error: string) {
    this.messageService.add({
      summary: 'Greška',
      detail: error,
      severity: 'error',
      sticky: true,
    });
  }
}
