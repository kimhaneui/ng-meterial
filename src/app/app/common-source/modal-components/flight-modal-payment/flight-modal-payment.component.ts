import { Component, OnInit, Inject, PLATFORM_ID, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { distinct } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';

import * as flightSearchResultSelector from 'src/app/store/flight-common/flight-search-result/flight-search-result.selectors';
import * as commonUserInfoSelectors from 'src/app/store/common/common-user-info/common-user-info.selectors';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';

import { ApiFlightService } from '@/app/api/flight/api-flight.service';
import { WebShareService } from '../../services/web-share/web-share.service';
import { JwtService } from '@/app/common-source/services/jwt/jwt.service';
import { ApiAlertService } from '../../services/api-alert/api-alert.service';

import { environment } from '@/environments/environment';

import { ConfigInfo } from '../../models/common/modal.model'
    ;
import { FlightStore } from '../../enums/flight/flight-store.enum';
import { CommonStore } from '../../enums/common/common-store.enum';

import { BaseChildComponent } from '@/app/pages/base-page/components/base-child/base-child.component';
import { FlightModalPaymentDetailComponent } from '../flight-modal-payment-detail/flight-modal-payment-detail.component';
import { CommonModalAlertComponent } from '@/app/common-source/modal-components/common-modal-alert/common-modal-alert.component';

@Component({
    selector: 'app-flight-modal-payment',
    templateUrl: './flight-modal-payment.component.html',
    styleUrls: ['./flight-modal-payment.component.scss']
})
export class FlightModalPaymentComponent extends BaseChildComponent implements OnInit, OnDestroy {
    @Input() promotionRq: any;
    @Input() cabinClassTxt: any;
    @Input() rs: any;

    bsModalDetailRef: BsModalRef;
    isClose: any = false;
    rxAlive: boolean = true;
    userInfo: any;
    public viewModel: any;
    private dataModel: any;

    condition: any;
    stationTypeCode: any;
    currency: any;
    transactionSetId: any;
    tripTypeCode: any;
    airlineCode: any;
    adultCount: any;
    childCount: any;
    infantCount: any;
    response: any;
    request: any;
    cardList: Array<any>;

    private subscriptionList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        public bsModalRef: BsModalRef,
        public jwtService: JwtService,
        private bsModalSvc: BsModalService,
        private apiflightSvc: ApiFlightService,
        private apiFlightService: ApiFlightService,
        private webShareS: WebShareService,
        private bsModalService: BsModalService,
        private router: Router,
        private route: ActivatedRoute,
        private store: Store<any>,
        private alertService: ApiAlertService
    ) {
        super(platformId);

        this.subscriptionList = [];
        this.subscribeInit();
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.cardList = [];
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('overflow-none');
        console.log(this.promotionRq);
        this.flightSearch(this.promotionRq);
    }

    ngOnDestroy() {
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription): void => {
                item.unsubscribe();
            }
        );
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
    }

    private subscribeInit(): void {
        this.dataModel = {};
        this.subscriptionList = [
            this.store
                .pipe(
                    select(flightSearchResultSelector.getSelectId(FlightStore.STORE_FLIGHT_LIST_RQ)),
                    distinct((item: any) => item && item.id)
                )
                .subscribe(
                    (item: any) => {
                        if (item) {
                            this.dataModel.request = item;
                            console.log(this.dataModel, 'this.dataModel');
                        }
                    }
                ),
            this.store
                .pipe(
                    select(flightSearchResultSelector.getSelectId([FlightStore.STORE_FLIGHT_LIST_RS])),
                    distinct((item: any) => item && item.id)
                )
                .subscribe(
                    (item: any) => {
                        if (item) {
                            this.dataModel.response = item;
                            console.log(item, 'item');
                        }
                    }
                )
        ];
    }

    private flightSearch(resolveData) {
        // ---------[api 호출 | 프로모션]

        let domesticFlag = true;
        console.log(_.cloneDeep(this.dataModel.response));
        this.dataModel.response.option.result.selected.detail.itineraries.map(
            (itineraryItem: any) => {
                itineraryItem.segments.map(
                    (segItem: any) => {
                        if (domesticFlag && (!_.isEqual(segItem.destination.countryCode, 'KR') && !_.isEqual(segItem.origin.countryCode, 'KR'))) {
                            domesticFlag = false;
                        }
                    }
                );
            }
        );
        this.viewModel = { totalAmount: 0 };
        this.dataModel.response.option.result.selected.detail.price.fare.passengerFares.map(
            (fareItem: any) => {
                this.viewModel.totalAmount += ((fareItem.fareAmount + fareItem.tasfAmount + fareItem.taxAmount) * fareItem.paxCount);
            }
        );

        // 하나라도 국제선이 있을 경우 프로모션 표시
        if (domesticFlag) {
            this.dataModel.promotion = {
                result: {
                    fares: [
                        {
                            adultFareAmount: 0,
                            adultTasfAmount: 0,
                            adultTaxAmount: 0,
                            amountSum: this.viewModel.totalAmount,
                            designatedRouteYn: 0,
                            fareAmountSum: 0,
                            fareIndex: 0,
                            fuelSurchargeAmountSum: 0,
                            inPolicyYn: true,
                            onewayCombineYn: false,
                            passengerFares: [],
                            productAmountSum: 0,
                            promotionCardBrandCode: 'NOT',
                            promotionCardBrandName: '없음',
                            promotionCardCode: 'NOT',
                            promotionCardName: '없음',
                            promotionSeq: 0,
                            refundableYn: true,
                            tasfAmountSum: 0,
                            taxAmountSum: 0,
                        }
                    ],
                    lowestAmount: this.viewModel.totalAmount,
                }
            };
            this.setViewModel();
        } else {
            this.subscriptionList.push(
                this.apiflightSvc.POST_FLIGHT_PROMOTION(resolveData)
                    .subscribe(
                        (res: any) => {
                            if (res.succeedYn) {
                                this.dataModel.promotion = _.cloneDeep(res);
                                this.setViewModel();
                            } else {
                                this.alertService.showApiAlert(res.errorMessage);
                            }
                        },
                        (err: any) => {
                            this.alertService.showApiAlert(err.error.message);
                        }
                    )
            );
        }
    }

    private setViewModel() {
        this.cardList = this.dataModel.promotion.result.fares.map(
            (item: any, index: number): any => {
                item.lowestAmount = this.dataModel.promotion.result.lowestAmount;

                if (index === 0) {
                    item.checked = true;
                } else {
                    item.checked = false;
                }
                return item;
            }
        );
    }

    private modalClose(): void {
        this.bsModalRef.hide();
    }

    /**
     * onCloseModal
     */
    public onCloseModal(event: any) {
        event && event.preventDefault();

        this.modalClose();
    }

    /**
     * onCartClick
     */
    onCartClick() {
        const curUrl = this.route.snapshot['_routerState'].url;
        this.jwtService.loginGuardInit(curUrl).then(
            (e) => {
                console.info('[jwtService.loginGuardInit > ok]', e);
                this.commonUserInfoInit();
            },
            (err) => {
                console.info('[jwtService.loginGuardInit > err]', err);
            });

        // this.subscriptionList.push(
        //     this.apiFlightService.PUT_FLIGHT_BASKET(rq)
        //         .subscribe(
        //             (res: any): any => {
        //                 if (res.succeedYn) {
        //                     const initialState = {
        //                         titleTxt: ',
        //                         closeObj:
        //                     }
        //                     this.bsModalSvc.show(CommonModalAlertComponent, { initialState, ...ConfigInfo });

        //                     console.info('[예약리스트 > res]', res);
        //                     this.limitStart += this.pageCount;
        //                     this.limitEnd += this.pageCount;
        //                     this.loadingBool = true;
        //                     this.loadingBar.complete();
        //                     return resp;
        //                 } else {
        //     this.alertService.showApiAlert(res.errorMessage);
        // }
        //             },
        //             (error: any): void => {
        // this.alertService.showApiAlert(err.error.message);
        //             }
        //         )
        // );
    }

    commonUserInfoInit() {
        this.subscriptionList.push(
            this.store
                .select(commonUserInfoSelectors.getSelectId(CommonStore.COMMON_USER_INFO)) // 스토어 ID
                .subscribe(
                    (ev) => {
                        console.info('commonUserInfo > ', ev);
                        if (ev) { // 변경 되이터

                            // userInfo 세팅
                            this.userInfo = _.cloneDeep(ev['userInfo'].user);

                            // basket rq 세팅
                            console.log(this.dataModel.request, 'request');
                            this.response = this.dataModel.response.option.result;
                            this.request = this.dataModel.request.option;
                            const rq = {
                                stationTypeCode: environment.STATION_CODE,
                                currency: this.request.rq.currency,
                                language: this.request.rq.language,
                                transactionSetId: this.request.rq.transactionSetId,
                                condition: {
                                    userNo: 1,
                                    alertYn: true,
                                    tripTypeCode: this.request.rq.condition.tripTypeCode,
                                    adultCount: this.request.rq.condition.adultCount,
                                    childCount: this.request.rq.condition.childCount,
                                    infantCount: this.request.rq.condition.infantCount,
                                    laborCount: this.request.rq.condition.laborCount,
                                    studentCount: this.request.rq.condition.studentCount,
                                    // receiveEmailAddress: aa,
                                    // receiveDeviceToken: aaa,
                                    flight: {
                                        airlineCode: this.response.flights[0].airlineCode,
                                        itineraries: [
                                            {
                                                itineraryNo: this.response.flights[0].itinerary.itineraryNo,
                                                segments: [
                                                    {
                                                        segmentNo: this.response.flights[0].itinerary.segments[0].segmentNo,
                                                        cabinClassCode: this.request.vm.travelerStore.cabinClassCode,
                                                        // bookingClassCode: A,
                                                        origin: {
                                                            airportCode: this.response.flights[0].itinerary.segments[0].origin.airportCode,
                                                            cityCode: this.response.flights[0].itinerary.segments[0].origin.cityCode,
                                                            departureDate: this.response.flights[0].itinerary.segments[0].origin.departureDate,
                                                            departureTime: this.response.flights[0].itinerary.segments[0].origin.departureTime,
                                                        },
                                                        destination: {
                                                            airportCode: this.response.flights[0].itinerary.segments[0].destination.airportCode,
                                                            cityCode: this.response.flights[0].itinerary.segments[0].destination.cityCode,
                                                            arrivalDate: this.response.flights[0].itinerary.segments[0].destination.arrivalDate,
                                                            arrivalTime: this.response.flights[0].itinerary.segments[0].destination.arrivalTime,
                                                        },
                                                        marketing: {
                                                            airlineCode: this.response.flights[0].itinerary.segments[0].marketing.airlineCode,
                                                            flightNo: this.response.flights[0].itinerary.segments[0].marketing.flightNo,
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                }
                            };

                            //로그인 개인정보 > 이메일 필수값 아님
                            if (_.has(this.userInfo, 'emailAddress')) {
                                rq.condition['receiveEmailAddress'] = this.userInfo.emailAddress;
                            }

                            //api 실행
                            this.putBasketApi(rq);
                        }
                    }
                )
        );
    }

    /**
    * put basket api
    * @param rq
    */
    putBasketApi(rq: any) {
        this.subscriptionList.push(
            this.apiFlightService.PUT_FLIGHT_BASKET(rq)
                .subscribe(
                    (res: any) => {
                        console.info('[API 호출 | 항공 장바구니 추가 > ]', res);
                        if (res.succeedYn) {
                            this.cartMsgAlert('장바구니에 저장되었습니다.', '장바구니로 이동하시겠습니까?', false);
                        } else {
                            this.alertService.showApiAlert(res.errorMessage);
                        }
                    },
                    (err: any) => {
                        console.info('[API 호출 | 항공 장바구니 추가 > err]', err);
                        this.alertService.showApiAlert(err.error.message);
                    }
                )
        );
    }

    cartMsgAlert($titleTxt: any, $alertHtml: any, $errorBool: boolean) {
        const initialState = {
            titleTxt: $titleTxt,
            alertHtml: $alertHtml,
            closeObj: {
                fun: () => { }
            }
        };

        if ($errorBool) { // 장바구니 추가 에러일 경우
            initialState['okObj'] = {
                fun: () => { }
                // this.goToCartList();
            };
        } else {
            initialState['okObj'] = {
                fun: () => {

                }
            };

            initialState['cancelObj'] = {
                fun: () => { }
            };
        }

        this.bsModalService.show(CommonModalAlertComponent, { initialState, ...ConfigInfo });
    }

    // 장바구니 리스트
    goToCartList() {
        console.info('goToCartList');
        const path = '/my-wish-list';
        const extras = {
            relativeTo: this.route
        };
        this.router.navigate([path], extras);
        // this.onCloseClick();
    }

    /**
     * onCardChange
     */
    public onCardChange(event: any, item: any) {
        event && event.preventDefault();

        console.log(item, 'item');
        console.log(this.viewModel, 'viewModel');

        this.cardList = this.cardList.map(
            (item: any): any => {
                item.checked = false;
                return item;
            }
        );
        item.checked = event.target.checked;
    }

    onPayDetail() {
        console.info('[총 결제 금액 | 정보]');
        const initialState = {
            rs: this.rs
        };
        this.bsModalDetailRef = this.bsModalSvc.show(FlightModalPaymentDetailComponent, { initialState, ...ConfigInfo });
    }

    /**
     * onShareClick
     * 공유하기
     *
     * @param event dom 이벤트
     */
    public onShareClick(event: any): void {
        event && event.preventDefault();

        this.webShareS.webShare(
            {
                title: `${this.dataModel.request.option.vm.trip.destination[0].origin.name}-${this.dataModel.request.option.vm.trip.destination[0].dest.name}`,
                text: '',
                url: this.router.url
            }
        );
    }

    /**
     * onReserve
     */
    public onReserve(event: any): void {
        event && event.preventDefault();

        this.isClose = true;
        this.modalClose();
    }
}
