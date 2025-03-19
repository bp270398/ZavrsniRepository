import { HttpHeaders } from '@angular/common/http';
import { AfterViewInit, Component, Inject, Input, OnInit, Optional, ViewChild } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FileUpload, FileUploadEvent } from 'primeng/fileupload';

@Component({
  selector: 'app-file-upload',
  template: `
  <p-fileUpload
    name="demo[]"
    url="https://www.primefaces.org/cdn/api/upload.php"
    [multiple]="multiple"
    [accept]="accept"
    [maxFileSize]="maxFileSize"
    chooseLabel = 'Odaberi'
    uploadLabel = 'Spremi'
    cancelLabel = 'Natrag'
    invalidFileSizeMessageSummary = 'Nepodržana veličina datoteke,'
    invalidFileSizeMessageDetail = 'maksimalna veličina je {0}'
    invalidFileTypeMessageSummary = 'Nepodržana vrsta datoteke,'
    invalidFileTypeMessageDetail = 'dozvoljene su ekstenzije {0}.'
    mode="advanced">
      <ng-template pTemplate="content">
          <ul *ngIf="uploadedFiles.length">
              <li *ngFor="let file of uploadedFiles">{{file.name}} - {{file.size}} bytes</li>
          </ul>
      </ng-template>
    </p-fileUpload>

 `})
export class FileUploadComponent implements OnInit, AfterViewInit {
  headers = new HttpHeaders({ 'Content-Type': 'multipart/form-data' });
  uploadedFiles: any[] = [];
  dynamicDialogRef?: DynamicDialogRef;

  @Input() fields?: FormlyFieldConfig[] = [
    {
      key: 'file',
      type: 'file',
    }
  ];
  @Input() model?: any = {};

  @Input() multiple?: boolean = false;
  @Input() accept?: string = 'image/*,.pdf';
  @Input() maxFileSize?: number = 1000000;
  @Input() onUploaded!: (event: FileUploadEvent, context: FileUploadComponent) => void;

  @ViewChild(FileUpload) fileUpload!: FileUpload;

  constructor(
    @Optional() private dialogConfig: DynamicDialogConfig) {

    if (dialogConfig) {
      const { fields, model, multiple, accept, onUploaded } = dialogConfig.data || {};
      if (fields) this.fields = fields;
      if (model) this.model = model;
      if (multiple) this.multiple = multiple;
      if (accept) this.accept = accept;
      if (onUploaded) this.onUploaded = onUploaded;
    }
  }

  ngAfterViewInit(): void {

    this.fileUpload.onUpload.subscribe((v: FileUploadEvent) => {
      this.onUploaded(v, this);
    })
  }

  ngOnInit(): void {


  }

}
