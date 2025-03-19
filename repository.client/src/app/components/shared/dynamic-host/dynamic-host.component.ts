import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

@Directive({
  selector: '[host]',
  standalone: true,
})
export class DynamicHostDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
@Component({
  selector: 'app-dynamic-host',
  template: '<ng-template host></ng-template>',
  standalone: true,
  imports: [DynamicHostDirective],
})
export class DynamicHostComponent implements OnChanges {
  @Input() component: any;
  @Input() inputs: { [key: string]: any } = {};
  componentRef?: ComponentRef<any>;

  @ViewChild(DynamicHostDirective, { static: true })
  host!: DynamicHostDirective;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['component'] && this.component) {
      const viewContainerRef = this.host.viewContainerRef;
      viewContainerRef.clear();

      const componentFactory =
        this.componentFactoryResolver.resolveComponentFactory(this.component);
      this.componentRef = viewContainerRef.createComponent(
        componentFactory
      ) as ComponentRef<typeof this.component>;

      if (this.inputs && this.componentRef) {
        Object.keys(this.inputs).forEach((inputName) => {
          this.componentRef!.instance[inputName] = this.inputs[inputName];
        });
      }
    }
  }

  public getComponentRef() {
    return this.componentRef;
  }

}
