import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';

import { BaseChildComponent } from '../../../base-page/components/base-child/base-child.component';

import { ConfigInfo } from '@/app/common-source/models/common/modal.model';

import { RentModalDemandsComponent } from '../../modal-components/rent-modal-demands/rent-modal-demands.component';
import { RentModalAmericaComponent } from '../../modal-components/rent-modal-america/rent-modal-america.component';
import { RentModalCanadaComponent } from '../../modal-components/rent-modal-canada/rent-modal-canada.component';
import { RentModalEuropeComponent } from '../../modal-components/rent-modal-europe/rent-modal-europe.component';

@Component({
    selector: 'app-rent-guide-btn',
    templateUrl: './rent-guide-btn.component.html',
    styleUrls: ['./rent-guide-btn.component.scss']
})
export class RentGuideBtnComponent extends BaseChildComponent implements OnInit {

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        private bsModalService: BsModalService,
    ) {
        super(platformId);
    }

    ngOnInit(): void {
    }

    demandClick() {
        const initialState = {

        };

        this.bsModalService.show(RentModalDemandsComponent, { initialState, ...ConfigInfo });
    }
    americaClick() {
        const initialState = {

        };

        this.bsModalService.show(RentModalAmericaComponent, { initialState, ...ConfigInfo });
    }
    canadaClick() {
        const initialState = {

        };

        this.bsModalService.show(RentModalCanadaComponent, { initialState, ...ConfigInfo });
    }
    europeClick() {
        const initialState = {};

        this.bsModalService.show(RentModalEuropeComponent, { initialState, ...ConfigInfo });
    }

}
