import { TestBed } from '@angular/core/testing';

import { UserContextProvider } from './user-context.provider';

describe('UserContextProviderService', () => {
  let service: UserContextProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserContextProvider);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
