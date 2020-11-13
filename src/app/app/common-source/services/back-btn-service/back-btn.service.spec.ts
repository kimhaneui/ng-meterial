import { TestBed } from '@angular/core/testing';

import { BackBtnService } from './back-btn.service';

describe('BackBtnService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BackBtnService = TestBed.get(BackBtnService);
    expect(service).toBeTruthy();
  });
});
