import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadColumnComponent } from './download-column.component';

describe('DownloadColumnComponent', () => {
  let component: DownloadColumnComponent;
  let fixture: ComponentFixture<DownloadColumnComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DownloadColumnComponent]
    });
    fixture = TestBed.createComponent(DownloadColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
