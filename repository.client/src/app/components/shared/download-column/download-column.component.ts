import { Component, Input, OnInit } from '@angular/core';
import { PrimeIcons } from 'primeng/api';
import { Observable, take, tap } from 'rxjs';
import { DocumentPreviewPresets } from '../../../dialogServicePresets';
import saveAs from 'file-saver';
import { DialogService } from 'primeng/dynamicdialog';
import { PdfViewerComponent } from '../pdf-viewer/pdf-viewer.component';
import { ErrorFormatterService } from '../../../services/error-formatter.service';
import { DocumentsService } from '../../../services/documents.service';
import { ButtonType } from '@ngx-floyd/core-ui';

@Component({
  selector: 'app-download-column',
  template: `
  <span (mousedown)="onClick($event)" (click)="dummyClick($event)">
      <p-button
        type="button"
        (click)="dummyClick($event)"
        [rounded]="true"
        [icon]="iconClass"
        [severity]="severity"
        [text]="true">
    </p-button>
  </span>`,
})
export class DownloadColumnComponent implements OnInit {

  @Input() iconClass = '';
  @Input() severity: ButtonType = 'primary'
  @Input() documentContentId!: string;
  @Input() isDocumentTemplate = false;
  @Input() documentExtension?: string;

  constructor(protected dynamicDialog: DialogService, protected error: ErrorFormatterService, private documentService: DocumentsService) { }

  ngOnInit(): void {
    this.setIcon();
  }

  onClick($event: MouseEvent) {
    if (!this.documentContentId) return;
    if ($event.button !== 0) return;
    $event.stopImmediatePropagation();

    if (!this.isDocumentTemplate)
      this.documentService.downloadDocumentContent(this.documentContentId)
        .pipe(take(1))
        .subscribe(value => {
          if (this.documentExtension == '.pdf') {
            this.dynamicDialog.open(PdfViewerComponent, {
              ...DocumentPreviewPresets,
              data: {
                src: value.blob,
                fileName: value.fileName,
                fileExtension: this.documentExtension
              }
            })
          }
          else
            saveAs(value.blob, value.fileName);
        }, err => this.error.showError(err));
    else
      this.documentService.downloadDocumentTemplateContent(this.documentContentId)
        .pipe(take(1))
        .subscribe(value => {
          if (this.documentExtension == '.pdf') {
            this.dynamicDialog.open(PdfViewerComponent, {
              ...DocumentPreviewPresets,
              data: {
                src: value.blob,
                fileName: value.fileName,
                fileExtension: this.documentExtension
              }
            })
          }
          else
            saveAs(value.blob, value.fileName);
        }, err => this.error.showError(err));
  }

  dummyClick($event: MouseEvent) {
    $event.stopImmediatePropagation();
  }

  setIcon() {
    if (this.documentExtension)
      switch (this.documentExtension) {
        case '.pdf': {
          this.iconClass = PrimeIcons.FILE_PDF;
          this.severity = 'danger';
          break;
        }
        case '.doc': {
          this.iconClass = PrimeIcons.FILE_WORD;
          this.severity = 'primary';
          break;
        }
        case '.docx': {
          this.iconClass = PrimeIcons.FILE_WORD;
          this.severity = 'primary';
          break;
        }
        case '.png': {
          this.iconClass = PrimeIcons.IMAGE;
          this.severity = 'warning';
          break;
        }
      }
  }
}
