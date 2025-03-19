import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { map, Observable, Subject, tap } from 'rxjs';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { RhetosRest } from '@ngx-floyd/rhetos';
import { executeAsync } from '../extension.methods';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class DocumentsService implements OnDestroy {
  private destroy$$ = new Subject<void>();
  readonly destroy$ = this.destroy$$.asObservable();
  ref?: DynamicDialogRef;

  constructor(private http: HttpClient, private rhetos: RhetosRest, protected message: MessageService) { }


  uploadDocument(file: File, documentId: string) {
    const formData = new FormData();
    formData.append('file', file);

    const url = this.rhetos.rhetosConfig.url + `/rest/DocumentProcessing/UploadDocument?documentId=${documentId}&fileName=${encodeURIComponent(file.name)}`;

    return this.http.post(url, formData, {
      withCredentials: true, reportProgress: true, observe: 'events'
    }).pipe(tap(evt => {

      if (evt.type == HttpEventType.Response) {
        executeAsync(() => this.message.add({ severity: 'info', summary: `Datoteka ${file.name} je uspješno prenesena.` }))
      }
    }))
  }

  uploadDocumentTemplate(file: File, documentTemplateId: string) {
    const formData = new FormData();
    formData.append('file', file);

    const url = this.rhetos.rhetosConfig.url + `/rest/DocumentProcessing/UploadDocumentTemplate?documentTemplateId=${documentTemplateId}&fileName=${encodeURIComponent(file.name)}`;

    return this.http.post(url, formData, {
      withCredentials: true, reportProgress: true, observe: 'events'
    }).pipe(tap(evt => {

      if (evt.type == HttpEventType.Response) {
        executeAsync(() =>
          this.message.add({ severity: 'info', summary: `Datoteka ${file.name} je uspješno prenesena.` }))

      }
    }))
  }



  downloadDocumentContent(documentContentId: string): Observable<{
    blob: Blob,
    fileName: string
  }> {

    var fileName = '';
    const url = this.rhetos.rhetosConfig.url + `/rest/DocumentProcessing/DownloadDocumentContent?documentContentId=${documentContentId}`;

    return this.http.get(url, {
      withCredentials: true, responseType: 'blob', observe: 'response'
    }).pipe(map((response: HttpResponse<Blob>) => {

      const disposition = response.headers.get('Content-Disposition');
      if (disposition) {
        const utf8FileNameRegex = /filename\*=UTF-8''([^;\n]*)/;
        const matches = utf8FileNameRegex.exec(disposition);
        if (matches)
          fileName = decodeURIComponent(matches[1])
      }

      return {
        blob: response.body!,
        fileName: fileName
      }
    }))
  }

  downloadDocumentTemplateContent(documentTemplateContentId: string): Observable<{
    blob: Blob,
    fileName: string
  }> {

    var fileName = '';
    const url = this.rhetos.rhetosConfig.url + `/rest/DocumentProcessing/DownloadDocumentTemplateContent?documentTemplateContentId=${documentTemplateContentId}`;

    return this.http.get(url, {
      withCredentials: true, responseType: 'blob', observe: 'response'
    }).pipe(map((response: HttpResponse<Blob>) => {

      const disposition = response.headers.get('Content-Disposition');
      if (disposition) {
        const utf8FileNameRegex = /filename\*=UTF-8''([^;\n]*)/;
        const matches = utf8FileNameRegex.exec(disposition);
        if (matches)
          fileName = decodeURIComponent(matches[1])
      }

      return {
        blob: response.body!,
        fileName: fileName
      }
    }))
  }

  generateDocumentContent(documentId: string): Observable<{
    blob: Blob,
    fileName: string
  }> {

    var fileName = '';
    const url = this.rhetos.rhetosConfig.url + `/rest/DocumentProcessing/GenerateDocument?documentId=${documentId}`;

    return this.http.get(url, {
      withCredentials: true, responseType: 'blob', observe: 'response'
    }).pipe(map((response: HttpResponse<Blob>) => {

      const disposition = response.headers.get('Content-Disposition');
      if (disposition) {
        const utf8FileNameRegex = /filename\*=UTF-8''([^;\n]*)/;
        const matches = utf8FileNameRegex.exec(disposition);
        if (matches)
          fileName = decodeURIComponent(matches[1])
      }

      return {
        blob: response.body!,
        fileName: fileName
      }
    }))
  }

  ngOnDestroy(): void {
    this.destroy$$.next();
    this.destroy$$.complete();
  }
}
