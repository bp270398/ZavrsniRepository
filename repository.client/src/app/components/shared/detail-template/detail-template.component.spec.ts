import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailTemplateComponent } from './detail-template.component';

describe('DetailTemplateComponent', () => {
  let component: DetailTemplateComponent;
  let fixture: ComponentFixture<DetailTemplateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailTemplateComponent]
    });
    fixture = TestBed.createComponent(DetailTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
