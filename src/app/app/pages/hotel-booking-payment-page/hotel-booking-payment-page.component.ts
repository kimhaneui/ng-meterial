import { Component, OnInit, PLATFORM_ID, Inject, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, Validators, FormControl, FormGroup, FormArray } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Store } from '@ngrx/store';

//store
import { upsertHotelSessionStorage } from 'src/app/store/hotel-common/hotel-session-storage/hotel-session-storage.actions';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';
import * as moment from 'moment';
import { extendMoment } from 'moment-range';

//service
import { SeoCanonicalService } from 'src/app/common-source/services/seo-canonical/seo-canonical.service';
import { ApiPaymentService } from '@/app/api/payment/api-payment.service';
import { CommonValidatorService } from '@/app/common-source/services/common-validator/common-validator.service';
import { HotelComService } from '@/app/common-source/services/hotel-com-service/hotel-com-service.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { environment } from '@/environments/environment';

import { PaymnetStyleSet, UseCardSet } from './models/hotel-booking-page.model';
import { CardMonthSet, CardSet, PaymentStyle } from '@/app/common-source/models/booking.model';

import { HeaderTypes } from 'src/app/common-source/enums/header-types.enum';

//component
import { BasePageComponent } from '../base-page/base-page.component';
import { CommonModalAlertComponent } from '@/app/common-source/modal-components/common-modal-alert/common-modal-alert.component';

@Component({
    selector: 'app-hotel-booking-payment-page',
    templateUrl: './hotel-booking-payment-page.component.html',
    styleUrls: ['./hotel-booking-payment-page.component.scss']
})
export class HotelBookingPaymentPageComponent extends BasePageComponent implements OnInit, OnDestroy {
    public viewModel: any;
    private dataModel: any;
    private subscriptionList: Subscription[];
    public pageForm: any;
    public hotelInfoSession: any;

    ctx: any = this;
    headerType: any;
    headerConfig: any;
    rxAlive: boolean = true;

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translate: TranslateService,
        private location: Location,
        private route: ActivatedRoute,
        private router: Router,
        private store: Store<any>,
        private fb: FormBuilder,
        private bsModalService: BsModalService,
        private apiPaymentS: ApiPaymentService,
        private comHotelS: HotelComService,
        private comValidator: CommonValidatorService,
        private alertService: ApiAlertService
    ) {
        super(
            platformId,
            titleService,
            metaTagService,
            seoCanonicalService,
            translate
        );

        this.initialize();
    }

    ngOnInit() {
        super.ngOnInit();
    }

    ngOnDestroy() {
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription): void => {
                item.unsubscribe();
            }
        );
    }

    /**
     * initialize
     * 초기화
     */
    private initialize(): void {
        this.dataModel = {};
        this.sessionInit();
        this.subscriptionList = [];
        this.viewModel = {
            useCardList: UseCardSet,
            cardList: CardSet,
            cardMonthList: CardMonthSet,
            loadingFlag: true,
            paymentStyleList: PaymnetStyleSet
        };

        //호텔 취소수수료 정책 rq
        const lowestRoomAmount = this.hotelInfoSession.rq.roomInfo.lowestRoomAmount;
        const roomUpgrade: number = this.hotelInfoSession.rq.roomInfo.roomType.amountSum - lowestRoomAmount;
        this.viewModel.amount = {
            sum: this.hotelInfoSession.rq.roomInfo.roomType.amountSum,
            lowestRoomAmount: lowestRoomAmount,
            noRoomUpgradeBool: (roomUpgrade === 0) ? true : false
        };

        // 결제 수단 form 생성
        this.pageForm = this.fb.group({
            // 결제 수단
            payment: this.newPaymnet()
        });

        this.headerSet(this.hotelInfoSession);
    }

    get payment(): FormArray {
        return this.pageForm.get('payment') as FormArray;
    }

    /**
     * makeUserPayment
     * 사용자 결제 정보용 form 생성
     */
    private makeUserPayment(): void {
        if (this.payment.controls.length > 1) {
            new Array(this.payment.controls.length).map(
                (item: any, index: number): void => {
                    index > 0 && this.payment.removeAt(index);
                }
            );
        }
    }

    private newPaymnet(): FormGroup {
        return this.fb.group({
            cardHolderTypeCode: new FormControl('', Validators.required),
            cardMasterCode: new FormControl('', Validators.required),
            cardNo: new FormControl(
                '',
                [
                    Validators.required,
                    Validators.maxLength(16),
                    this.comValidator.customPattern({ pattern: /^[0-9]*$/, msg: '\'-\'를 제외한 숫자만 입력해주세요.' })
                ]
            ),
            cardHolderName: new FormControl(
                '',
                [
                    Validators.required,
                    this.comValidator.customPattern({ pattern: /^[a-zA-Z]*$/, msg: '영문만 입력해주세요.' })
                ]
            ),
            cardHolderBirthday: new FormControl(
                '',
                [
                    Validators.required,
                    Validators.minLength(8),
                    Validators.maxLength(8),
                    this.comValidator.customPattern({ pattern: /^(((19|20)([2468][048]|[13579][26]|0[48])|2000)0229|((19|20)[0-9]{2}(0[4678]|1[02])(0[1-9]|[12][0-9]|30)|(19|20)[0-9]{2}(0[1359]|11)(0[1-9]|[12][0-9]|3[01])|(19|20)[0-9]{2}02(0[1-9]|1[0-9]|2[0-8])))/, msg: '입력한 형식이 올바르지 않습니다.' })
                ]
            ),
            cardValidPeriod: new FormControl(
                '',
                [
                    Validators.required,
                    Validators.minLength(4),
                    Validators.maxLength(4),
                    this.comValidator.customPattern({ pattern: /^(0[1-9]|1[012])(\d{2})*$/, msg: '\'/\'를 제외한 숫자만 입력해주세요.' })
                ]
            ),
            // 할부
            cardCvc: new FormControl(
                '',
                [
                    Validators.required,
                    Validators.minLength(3),
                    Validators.maxLength(3),
                    this.comValidator.customPattern({ pattern: /^[0-9]*$/, msg: '숫자 3자리 입력해주세요.' })
                ]
            ),
            //카드 비밀번호
            cardPassword: new FormControl(
                '',
                [
                    Validators.maxLength(2),
                    Validators.maxLength(2),
                    this.comValidator.customPattern({ pattern: /^(\d{2})*$/, msg: '비밀번호 앞 2자리를 입력해주세요.' })
                ]
            ),

            // 할부기간
            cardQuotaMonth: new FormControl('', Validators.required)

            // 문의 필요
            // cardHolderRelationCode: new FormControl(''),
            // paidAmount: new FormControl(amount),

            // 항공만 각각 결제일 경우 값이 들어감
            // bookingTravelerCode: new FormControl(''),

            // end 문의 필요
        });
    }

    /**
     * sessionInit
     * 세션 저장 데이터 꺼내기
     */
    private sessionInit(): void {
        const sessionItem = JSON.parse(localStorage.getItem('hotel-common'));

        if (!_.isEmpty(sessionItem.hotelSessionStorages.entities)) {
            this.dataModel.response = sessionItem.hotelSessionStorages.entities['hotel-booking-rs'].result;

            this.hotelInfoSession = sessionItem.hotelSessionStorages.entities['hotel-booking-infomation-rs'].result;
        }

        console.log(_.cloneDeep(this.hotelInfoSession));

    }

    /**
     * headerSet
     * 헤더 표시에 필요한 데이터 설정
     *
     * @param resolveData session 에 저장되었던 데이터
     */
    private headerSet(resolveData: any): void {
        console.info('[헤더 초기화]', resolveData);
        // ---------[헤더 초기화]
        const Moment = extendMoment(moment);
        const checkInDate = moment(resolveData.rq.checkInDate).format('MM.DD');
        const checkOutDate = moment(resolveData.rq.checkOutDate).format('MM.DD');
        const range = Moment.range(resolveData.rq.checkInDate, resolveData.rq.checkOutDate);
        const dayDiff = range.diff('days'); //여행일수
        const travelerInfo = this.comHotelS.getTravelerInfo(resolveData.roomConRq.rooms, false); //객실 수, 인원

        const stepTitle = `결제하기`;
        const headerDetail = `${checkInDate}-${checkOutDate}(${dayDiff}박), ${travelerInfo}`;

        this.headerInit({
            icon: 'card',
            stepTitle: stepTitle,
            detail: headerDetail
        });
        // ---------[ end 헤더 초기화]

        console.info('[헤더 초기화 끝]');
    }

    /**
     * headerInit
     * 헤더 초기화
     *
     * @param header
     */
    private headerInit(header: any): void {
        this.headerType = HeaderTypes.SUB_PAGE;
        this.headerConfig = {
            icon: header.icon,
            step: { title: header.stepTitle },
            detail: header.detail,
            ctx: this.ctx
        };
    }

    /**
     * upsertOneSession
     * 세션 스토어에 내용 저장
     */
    private upsertOneSession(obj: any): void {
        this.store.dispatch(
            upsertHotelSessionStorage({ hotelSessionStorage: _.cloneDeep(obj) })
        );
    }

    /**
     * makeBookingPaymentRequest
     * 예약 결제 리퀘스트 생성
     */
    private makeBookingPaymentRequest(): void {
        const rq: any = {
            stationTypeCode: environment.STATION_CODE,
            currency: 'KRW',
            language: 'KO',
            transactionSetId: this.dataModel.response.transactionSetId,
            condition: {
                bookingItemCode: this.dataModel.response.bookingItems[0].bookingItemCode,
                cards: [{
                    ..._.omit(this.payment.value, 'cardCvc'),
                    ...{
                        cardValidPeriod: [this.payment.value.cardValidPeriod.slice(0, 2), this.payment.value.cardValidPeriod.slice(2, 4)].join('/'),
                        cardHolderBirthday: [this.payment.value.cardHolderBirthday.slice(0, 4), this.payment.value.cardHolderBirthday.slice(4, 6), this.payment.value.cardHolderBirthday.slice(6, 8)].join('-')
                    }
                }]
            }
        };
        console.info(' this.dataModel.response', this.dataModel.response);
        console.info('makeBookingPaymentRequest', rq);
        this.bookingPayment(rq);
    }

    /**
     * bookingPayment
     * 결제 요청
     *
     * @param request 결제 요청 request
     */
    private bookingPayment(request: any): void {
        this.subscriptionList.push(
            this.apiPaymentS.PUT_PAYMENT(request)
                .subscribe(
                    (resp: any): void => {
                        if (resp.succeedYn) {
                            this.upsertOneSession({
                                id: 'hotel-booking-payment-rs',
                                result: resp['result']
                            });
                            // 예약 완료 페이지에서 뒤로가기시 메인페이지로 가기
                            this.location.replaceState('/hotel-main');
                            this.router.navigate(['/hotel-booking-complete'], { relativeTo: this.route });
                        } else {
                            this.alertService.showApiAlert(resp.errorMessage);
                        }
                    },
                    (err: any) => {
                        // 하림대리용
                        // this.alertService.showApiAlert(err);
                        console.info('[error]', err);
                        const initialState = {
                            titleTxt: '결제 예러',
                            closeObj: null
                        };

                        return this.bsModalService.show(
                            CommonModalAlertComponent,
                            {
                                initialState,
                                ...{ class: 'm-ngx-bootstrap-modal', animated: false }
                            }
                        );
                    }
                )
        );
    }

    /**
     * changePaymentList
     * 일반, 각각 결제 선택
     *
     * @param event mounse 이벤트
     * @param index 결제 방식 번호
     */
    public changePaymentList(event: any, index: number): void {
        event && event.preventDefault();

        this.viewModel.paymentStyleList = this.viewModel.paymentStyleList.map(
            (payItem: PaymentStyle, payIndex: number): PaymentStyle => {
                if (payIndex === index) {
                    payItem.checked = event.target.checked;
                } else {
                    payItem.checked = false;
                }

                return payItem;
            }
        );

        this.makeUserPayment();
    }

    /**
     * getClassName
     * 클래스 변경
     */
    public getClassName(): string {
        return this.viewModel.paymentStyleList[0].checked ? 'row-group' : 'traveler-item';
    }

    /**
     * onPay
     * 사용자 결제 이벤트
     */
    public onPay(): void {
        if (this.pageForm.valid) {
            this.makeBookingPaymentRequest();
        } else {
            _.forEach(this.pageForm.controls, (pageItem: any, pageKey: any) => {
                if (!pageItem.valid) {
                    console.info('[$key | 유효성 체크 실패]', pageKey);
                    let targetId = pageKey;
                    if (pageKey === 'payment') {
                        let flag = true;
                        _.forEach(
                            this.pageForm.controls.payment.controls,
                            (payItem: any, payKey: any) => {
                                console.info(payKey, '[$key : payment | 유효성 체크 실패]', payItem.invalid);
                                if (flag && payItem.invalid) {
                                    flag = false;
                                    targetId = payKey;
                                }
                            }
                        );
                    }

                    this.inValidAlert(targetId);

                    return false;
                }
            });
        }
    }

    public inValidAlert(targetId) {
        console.info('inValidAlert', targetId);
        const initialState = {
            titleTxt: '입력 값이 올바르지 않은 항목이 있습니다.',
            closeObj: { fun: () => { } },
        };

        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };

        this.bsModalService.show(CommonModalAlertComponent, { initialState, ...configInfo });
        this.subscriptionList.push(
            this.bsModalService.onHidden.subscribe(
                () => {
                    this.comValidator.scrollToTarget(targetId);
                }
            )
        );

    }
}