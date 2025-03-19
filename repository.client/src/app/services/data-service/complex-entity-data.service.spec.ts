import { TestBed } from '@angular/core/testing';

import { ComplexEntityDataService } from './complex-entity-data.service';

describe('ComplexEntityDataService', () => {
  let service: ComplexEntityDataService<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComplexEntityDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
