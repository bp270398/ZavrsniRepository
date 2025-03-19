import { Component, Optional, ViewChild } from '@angular/core';
import { NgxExtendedPdfViewerComponent, NgxExtendedPdfViewerService } from 'ngx-extended-pdf-viewer';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-pdf-viewer',
  template: `<div *ngIf="src">
  <ngx-extended-pdf-viewer 
     [src]="src"
     [showHandToolButton]="true"
     [showOpenFileButton]="false"
     [showDrawEditor]="false"
     [showStampEditor]="false"
     [showTextEditor]="false"
     [showSecondaryToolbarButton]="false"
     [filenameForDownload]="fileName"
     [useBrowserLocale]="true" 
     [language]="'hr'"
     [textLayer]="true"
     [height]="'auto'">
  </ngx-extended-pdf-viewer>
  </div>
 `,
})
export class PdfViewerComponent {

  src!: Blob | string;
  base64?: string;
  fileExtension?: string;
  fileName?: string = Date.now().toLocaleString('hr') + this.fileExtension ? this.fileExtension : '.pdf';

  @ViewChild(NgxExtendedPdfViewerComponent, { static: false }) pdfViewer!: NgxExtendedPdfViewerComponent;

  constructor(
    private pdfViewerService: NgxExtendedPdfViewerService,
    private ref: DynamicDialogRef,
    @Optional() private dialogConfig: DynamicDialogConfig
  ) {
    if (dialogConfig) {

      const { base64, src, fileName } = dialogConfig.data || {};

      if (base64) this.base64 = base64;
      if (src) this.src = src;
      if (fileName) this.fileName = fileName;
    }
  }
}
