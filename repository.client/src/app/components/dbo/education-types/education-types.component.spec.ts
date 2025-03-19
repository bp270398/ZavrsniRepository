import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationTypesComponent } from './education-types.component';

describe('EducationTypesComponent', () => {
  let component: EducationTypesComponent;
  let fixture: ComponentFixture<EducationTypesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EducationTypesComponent]
    });
    fixture = TestBed.createComponent(EducationTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
