/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MajorDestinationService } from './major-destination.service';

describe('Service: MajorDestination', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [MajorDestinationService]
        });
    });

    it('should ...', inject([MajorDestinationService], (service: MajorDestinationService) => {
        expect(service).toBeTruthy();
    }));
});
