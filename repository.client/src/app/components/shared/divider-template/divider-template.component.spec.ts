import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DividerTemplateComponent } from './divider-template.component';

describe('DividerTemplateComponent', () => {
  let component: DividerTemplateComponent;
  let fixture: ComponentFixture<DividerTemplateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DividerTemplateComponent]
    });
    fixture = TestBed.createComponent(DividerTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
