import { TestBed } from '@angular/core/testing';

import { NotVerifyGuard } from './not-verify.guard';

describe('NotVerifyGuard', () => {
  let guard: NotVerifyGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(NotVerifyGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
