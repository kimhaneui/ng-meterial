/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RestCallService } from './rest-call.service';

describe('Service: RestCall', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RestCallService]
    });
  });

  it('should ...', inject([RestCallService], (service: RestCallService) => {
    expect(service).toBeTruthy();
  }));
});
