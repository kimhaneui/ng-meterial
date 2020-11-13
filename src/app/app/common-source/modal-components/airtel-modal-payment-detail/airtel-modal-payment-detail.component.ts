import { Component, OnInit, PLATFORM_ID, Inject, OnDestroy } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal';

import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-airtel-modal-payment-detail',
    templateUrl: './airtel-modal-payment-detail.component.html',
    styleUrls: ['./airtel-modal-payment-detail.component.scss']
})
export class AirtelModalPaymentDetailComponent extends BaseChildComponent implements OnInit, OnDestroy {
    list: any;

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        public bsModalRef: BsModalRef
    ) {
        super(platformId);
    }
    ngOnInit(): void {
        super.ngOnInit();
        console.info('[ngOnInit | 결제 상세]');
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('overflow-none');
    }

    ngOnDestroy() {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
    }

    modalClose() {
        this.bsModalRef.hide();
    }
}
