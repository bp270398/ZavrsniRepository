import { TestBed } from '@angular/core/testing';

import { EntityDataService } from './entity-data.service';

describe('EntityDataService', () => {
  let service: EntityDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntityDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
