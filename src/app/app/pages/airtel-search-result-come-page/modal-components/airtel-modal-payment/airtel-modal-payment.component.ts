import { Component, OnInit, Input, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';

import { ApiFlightService } from 'src/app/api/flight/api-flight.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { ConfigInfo } from '@/app/common-source/models/common/modal.model';

import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';
import { AirtelModalPaymentDetailComponent } from 'src/app/common-source/modal-components/airtel-modal-payment-detail/airtel-modal-payment-detail.component';

@Component({
    selector: 'app-airtel-modal-payment',
    templateUrl: './airtel-modal-payment.component.html',
    styleUrls: ['./airtel-modal-payment.component.scss']
})
export class AirtelModalPaymentComponent extends BaseChildComponent implements OnInit, OnDestroy {
    @Input() promotionRq: any;

    bsModalDetailRef: BsModalRef;
    isClose: any = false;

    resultList: any;
    vm: any = {
        cardType: [
            {
                code: 'KB',
                name: '국민 티타늄 Miz&Mr'
            },
            {
                code: 'SS',
                name: '삼성 유니온페이'
            },
            {
                code: 'HD',
                name: '국민 티타늄 Miz&Mr'
            },

        ]
    };

    cabinClassTxt: any;
    list: any;
    flightListRs$: Observable<any>;

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        public bsModalRef: BsModalRef,
        private bsModalSvc: BsModalService,
        private apiflightSvc: ApiFlightService,
        private alertService: ApiAlertService
    ) {
        super(platformId);
    }
    ngOnInit(): void {
        super.ngOnInit();
        console.info('[ngOnInit | 결제 수단 선택]');

        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('overflow-none');

        this.init();
        this.storeInit();
        this.flightSearch(this.promotionRq);
    }

    ngOnDestroy() {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
    }
    init() {
        // const sessionVm: any = JSON.parse(sessionStorage.getItem(FlightStore.STORE_FLIGHT_COMMON));
        // this.cabinClassTxt = sessionVm.flightSessionStorages.entities["flight-main-vmInfo"].option.travelerStore.cabinClassTxt;

    }
    storeInit() {
        // this.flightListRq$ = this.store.select(
        //   flightSearhchResultSelector.getSelectId(FlightStore.STORE_FLIGHT_LIST_RQ)
        // );
    }

    async flightSearch($resolveData) {
        // ---------[api 호출 | 프로모션]
        await this.apiflightSvc.POST_FLIGHT_PROMOTION($resolveData)
            .toPromise()
            .then((res: any) => {
                if (res.succeedYn) {
                    console.info('[ 프로모션 > res.result]', res['result']);
                    this.resultList = _.cloneDeep(res);
                } else {
                    this.alertService.showApiAlert(res.errorMessage);
                }
            })
            .catch((err) => {
                this.alertService.showApiAlert(err.error.message);
            });
        console.info('[3. API 호출 끝]');
    }


    onPayDetail() {
        this.bsModalDetailRef = this.bsModalSvc.show(AirtelModalPaymentDetailComponent, { ...ConfigInfo });
    }

    onReserve() {
        this.isClose = true;
        this.modalClose();
    }
    modalClose() {
        this.bsModalRef.hide();
    }
}
