import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationLocationsComponent } from './education-locations.component';

describe('EducationLocationsComponent', () => {
  let component: EducationLocationsComponent;
  let fixture: ComponentFixture<EducationLocationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EducationLocationsComponent]
    });
    fixture = TestBed.createComponent(EducationLocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
