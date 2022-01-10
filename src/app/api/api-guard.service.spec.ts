import { TestBed } from '@angular/core/testing';

import { ApiGuardService } from './api-guard.service';

describe('ApiGuardService', () => {
  let service: ApiGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
