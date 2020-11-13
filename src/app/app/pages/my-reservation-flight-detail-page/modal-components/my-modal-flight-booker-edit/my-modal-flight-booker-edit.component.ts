import { Component, OnInit, Inject, PLATFORM_ID, OnDestroy, Input } from '@angular/core';


import { TranslateService } from '@ngx-translate/core';

import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';

import { ApiMypageService } from '@/app/api/mypage/api-mypage.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';
import { ApiBookingService } from 'src/app/api/booking/api-booking.service';


import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { HeaderTypes } from '@/app/common-source/enums/header-types.enum';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-my-modal-flight-booker-edit',
    templateUrl: './my-modal-flight-booker-edit.component.html',
    styleUrls: ['./my-modal-flight-booker-edit.component.scss']
})
export class MyModalFlightBookerEditComponent extends BaseChildComponent implements OnInit, OnDestroy {
    @Input() rq: any;

    resultList: any;
    loadingBool: Boolean = false;
    booker: any;
    flightDetail: any;
    subscriptionList: any;
    resolveData: any;
    headerType: any;
    headerConfig: any;

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        public titleService: Title,
        private router: Router,
        private route: ActivatedRoute,
        public translateService: TranslateService,
        public bsModalRef: BsModalRef,
        private apiBookingSvc: ApiBookingService,
        private apiMypageSvc: ApiMypageService,
        private alertService: ApiAlertService,
        public bsModalService: BsModalService,

    ) {
        super(
            platformId,

        );

        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.subscriptionList = [];

    }

    ngOnInit(): void {
        super.ngOnInit();
        console.info('[ngOnInit ]');
        this.subscriptionList.push(
            this.route.data
                .pipe(take(1))
                .subscribe(
                    (data: any) => {
                        this.resolveData = _.cloneDeep(data.resolveData);

                        const userNo = Number(_
                            .chain(this.resolveData)
                            .get('condition.userNo')
                            .value());
                        // .map((o) => {
                        //     return Number(o);
                        // });
                        console.info('Number(userNo)>>', userNo);
                        this.resolveData.condition.userNo = userNo;
                        console.info('[1. route 통해 데이터 전달 받기]', this.resolveData);
                        this.pageInit(this.resolveData);
                    }
                )
        );
        this.flightBookerEdit(this.rq);
    }



    ngOnDestroy() {

        this.modalClose();

    }

    headerInit() {
        this.headerType = HeaderTypes.SUB_PAGE;
        this.headerConfig = {
            title: '예약 변경',
            key: null,
        };
    }

    modalClose() {
        this.bsModalRef.hide();
    }


    async flightBookerEdit(resolveData) {
        // ---------[api 호출 | E-Ticket(항공) 조회]
        await this.apiMypageSvc.POST_BOOKING_FLIGHT_DETAIL(resolveData)
            .toPromise()
            .then((res: any) => {
                console.info('[API 호출]', res);

                if (res.succeedYn) {
                    this.flightDetail = res['result']['booker'];
                    this.loadingBool = true;
                    return res;
                } else {
                    this.alertService.showApiAlert(res.errorMessage);
                }
            })
            .catch((err) => {
                this.alertService.showApiAlert(err.error.message);
            });
        console.info('[3. API 호출 끝]');
    }
    async pageInit(resolveData) {
        const res = await this.flightBookerEdit(resolveData);

        this.booker = res['result']['booker'];                 // 예약자 정보

        console.info('booker >>>', this.booker);


    }
    onCloseClick() {
        this.modalClose();
    }
    onOkClick() {

    }



}