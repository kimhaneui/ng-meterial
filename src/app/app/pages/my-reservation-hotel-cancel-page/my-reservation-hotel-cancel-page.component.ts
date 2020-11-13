import { Component, OnInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

import * as moment from 'moment';

import { SeoCanonicalService } from 'src/app/common-source/services/seo-canonical/seo-canonical.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { environment } from '@/environments/environment';

import { HeaderTypes } from '../../common-source/enums/header-types.enum';

import { BasePageComponent } from '../base-page/base-page.component';
import { CommonModalAlertComponent } from '@/app/common-source/modal-components/common-modal-alert/common-modal-alert.component';

@Component({
    selector: 'app-my-reservation-hotel-cancel-page',
    templateUrl: './my-reservation-hotel-cancel-page.component.html',
    styleUrls: ['./my-reservation-hotel-cancel-page.component.scss']
}

) export class MyReservationHotelCancelPageComponent extends BasePageComponent implements OnInit,
    OnDestroy {
    element: any;
    $element: any;
    tabNo: any;
    headerType: any;
    resolveData: any;
    headerConfig: any;
    hotelDetail: any;
    selectedAll: any;
    rxAlive: boolean = true;

    travelers: Array<any>;
    apihotelSvc: any;

    private subscriptionList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translateService: TranslateService,
        private location: Location,
        private bsModalService: BsModalService,
        private router: Router,
        private route: ActivatedRoute,
        private alertService: ApiAlertService
    ) {
        super(
            platformId,
            titleService,
            metaTagService,
            seoCanonicalService,
            translateService
        );
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.headerInit();
        // this.travelers = [
        //     { name: 'Prashobh', sex: 'M', selected: false },
        //     { name: 'Abraham', sex: 'M', selected: false },
        //     { name: 'Anil', sex: 'F', selected: false },
        //     { name: 'Sam', sex: 'M', selected: false },
        //     { name: 'Natasha', sex: 'F', selected: false },
        //     { name: 'Marry', sex: 'F', selected: false },
        //     { name: 'Zian', sex: 'F', selected: false },
        //     { name: 'karan', sex: 'F', selected: false },
        // ];
    }

    ngOnDestroy() {
        this.rxAlive = false;
        this.closeAllModals();
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription) => {
                item.unsubscribe();
            }
        );
    }

    private closeAllModals() {
        for (let i = 1; i <= this.bsModalService.getModalsCount(); ++i) {
            this.bsModalService.hide(i);
        }
    }

    aaa() {
        const futureMonth = moment().add(3, 'months');
        const pastMonth = moment().subtract(3, 'months');
        console.log('futureMonth >>>', futureMonth.format('YYYY-MM-DD'));
        console.log('pastMonth >>>', pastMonth.format('YYYY.MM.DD (ddd)'));
    }

    hisBack() {
        history.back();
    }

    headerInit() {
        this.headerType = HeaderTypes.SUB_PAGE;

        this.headerConfig = {
            title: '예약취소',
            key: null
        };
    }

    // 전체선택 클릭
    allCheck() {
        for (let i = 0; i < this.travelers.length; i++) {
            this.travelers[i].selected = this.selectedAll;
        }
    }

    onCheck() {
        this.selectedAll = this.travelers.every(item => {
            return item.selected == true;
        });
    }

    onBackClick(event: any): void {
        event && event.preventDefault();

        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
        this.location.back();
    }


    callReservation(seltab) {
        const path = '/mypage-reservation-list/' + seltab;

        const extras = {
            relativeTo: this.route
        };
        console.log('path >>>>>', path);

        this.router.navigate([path], extras);
    }

    openHotelCancel() {
        const rqInfo = {

            'stationTypeCode': environment.STATION_CODE,
            'currency': 'KRW',
            'language': 'KO',
            'condition': {
                'bookingItemCodes': [this.resolveData.bookingItemCode],
                'smsSendYn': false
            }
        };

        const initialState = {

            titleTxt: '호텔예약 취소',
            alertHtml: `$ {
                this.hotelDetail.summary.bookingName
            }

            $ {
                this.hotelDetail.summary.travelFromDate
            }

            ($ {
                    moment(this.hotelDetail.summary.travelFromDate).format('ddd')
                }

            ) - $ {
                this.hotelDetail.summary.travelToDate
            }

            ($ {
                    moment(this.hotelDetail.summary.travelToDate).format('ddd')
                }

            ) <br/>예약번호 : YB$ {
                this.hotelDetail.summary.bookingCode
            }

            `,
            cancelObj: {
                fun: () => { }
            }
            ,
            okObj: {
                fun: () => {
                    this.hotelResvCancel(rqInfo);
                }
            }
        };

        this.bsModalService.show(CommonModalAlertComponent, { initialState, ...ConfigInfo });
        // this.flightResvCancel(rqInfo);
        // const path = '/my-reservation-flight-detail/' + qs.stringify(rqInfo);
        // this.router.navigate([path], {relativeTo : this.route});
    }

    hotelResvCancel($request) {
        // ---------[api 호출 | 예약취소]
        this.subscriptionList = [
            this.apihotelSvc.POST_HOTEL_CANCEL($request)
                .subscribe(
                    (res: any) => {
                        if (res.succeedYn) {
                            console.info('[ 예약취소 > res.result]', res.result);
                        } else {
                            this.alertService.showApiAlert(res.errorMessage);
                        }
                    },
                    (err) => {
                        this.alertService.showApiAlert(err.error.message);
                    }
                )
        ];
        console.info('[3. API 호출 끝]');
    }
}