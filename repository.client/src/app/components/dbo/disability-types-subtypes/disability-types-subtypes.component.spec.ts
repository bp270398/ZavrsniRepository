import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisabilityTypesSubtypesComponent } from './disability-types-subtypes.component';

describe('DisabilityTypesSubtypesComponent', () => {
  let component: DisabilityTypesSubtypesComponent;
  let fixture: ComponentFixture<DisabilityTypesSubtypesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DisabilityTypesSubtypesComponent]
    });
    fixture = TestBed.createComponent(DisabilityTypesSubtypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
