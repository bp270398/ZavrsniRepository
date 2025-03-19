import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Optional, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FloydFormlyConfigurationParams, FormState } from '@ngx-floyd/forms-formly';
import { FormlyFieldConfig, FormlyForm, FormlyFormOptions } from '@ngx-formly/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DataService } from '../../../services/data-service/data.service';
import { executeAsync } from '../../../extension.methods';

@Component({
  selector: 'app-formly-form',
  templateUrl: './formly-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormlyFormComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() form: FormGroup = new FormGroup({});
  @Input() fields: FormlyFieldConfig[] = [];
  @Input() model: any;
  @Input() skipSubmit = false;
  @Input() configuration!: () => FloydFormlyConfigurationParams;
  @Input() width: any;
  @Input() height = 'auto';
  @Input() submitBtnText = 'Spremi';
  @Input() cancelBtnText = 'Odustani';
  @Input() scrollable = true;
  @Input() submitBtnVisible = true;
  @Input() cancelBtnVisible = false;
  @Input() formState: FormState = FormState.New;
  @Input() dataService?: DataService<any>;
  @Output() onSubmitSuccess = new EventEmitter<string>();

  @Input() onBeforeShow?: (model: any, formState: FormState) => { model: any, formState: FormState };
  @Input() onBeforeSubmit?: (model: any, formState: FormState) => { model: any, formState: FormState };

  @Output() submitted = new EventEmitter<{ model: any, formState: FormState }>();
  @Output() canceled = new EventEmitter<any>();
  @Output() loaded = new EventEmitter<any>();

  @ViewChild(FormlyForm) formlyForm!: FormlyForm;
  @ViewChild('formForm') formElementRef!: ElementRef;

  @Input() options: FormlyFormOptions = {
    formState: {
      awesomeIsForced: false,
    },
  };
  dynamicDialogRef?: DynamicDialogRef;

  constructor(
    public cdRef: ChangeDetectorRef,
    @Optional() private dialogConfig: DynamicDialogConfig) {
    if (dialogConfig) {

      const { configuration, dataService, onSubmitSuccess, model, scrollable, width, onBeforeSubmit, submitBtnText, skipSubmit } = dialogConfig.data || {};
      if (configuration) this.configuration = configuration;
      if (dataService) this.dataService = dataService;
      if (onSubmitSuccess) this.onSubmitSuccess = onSubmitSuccess;
      if (model) this.model = model;
      if (scrollable) this.scrollable = scrollable;
      if (width) this.width = width;
      if (onBeforeSubmit) this.onBeforeSubmit = onBeforeSubmit;
      if (submitBtnText) this.submitBtnText = submitBtnText;
      if (skipSubmit) this.skipSubmit = skipSubmit;

      if (dialogConfig.data.formConfiguration)
        this.configuration = dialogConfig.data.formConfiguration;

      if (dialogConfig.data.ref)
        this.dynamicDialogRef = dialogConfig.data.ref;
    }
  }

  ngOnInit(): void {
    this.dataService?.loaded.subscribe(() => {
      this.refresh();
    })
  }

  updateModel(model?: any, formState?: FormState) {
    if (model) this.model = model;
    if (formState) this.formState = formState;
    if (this.dataService) {
      if (!this.model) {
        if (this.dataService.currentItem) {
          this.model = { ...this.dataService.currentItem };
          this.formState = this.dataService.formState;
        }
        else
          this.dataService.newItem();
      }
    }
    this.showItem(this.model, this.formState);
  }



  ngAfterViewInit(): void {

    if (this.dataService) {
      if (!this.model) {
        if (this.dataService.currentItem) {
          this.model = { ...this.dataService.currentItem };
          this.formState = this.dataService.formState;
        }
        else
          this.dataService.newItem();
      }
    }

    if (this.onBeforeShow) {
      var item = this.onBeforeShow(this.model, this.formState);
      this.model = item.model;
      this.formState = item.formState;
    }

    if (this.model) {
      this.showItem(this.model, this.formState)
    }

    const configuration = this.configuration();
    this.form = configuration.form;
    this.fields = configuration.fields;

    this.cdRef.detectChanges();

    this.refresh()
  }

  ngOnDestroy(): void {
    this.dynamicDialogRef?.close;
  }

  private showItem(model: any, formState: FormState) {
    this.options.formState = formState;
    this.formState = formState;

    this.model = model;
    this.cdRef.detectChanges();

    this.refresh()
  }

  refresh() {
    this.fields = [...this.fields];
    this.cdRef.detectChanges();
  }

  submit() {
    var item = this.model;

    if (this.onBeforeSubmit) {
      var _item = this.onBeforeSubmit(item, this.formState);
      item = _item.model;
      this.formState = _item.formState;
    }
    if (this.validate() && this.dataService && !this.skipSubmit) {
      this.dataService.submitChanges(item, this.formState);
      this.submitted.emit({ model: item, formState: this.formState });
      this.onSubmitSuccess.emit(item);
    }
  }

  validate() {
    this.form.markAllAsTouched();
    this.cdRef.detectChanges();
    return this.form.valid;
  }
}
