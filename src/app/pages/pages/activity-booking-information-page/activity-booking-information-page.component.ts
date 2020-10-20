import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Subscription } from 'rxjs';
import { distinct } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';

import { upsertActivitySessionStorage } from '@/app/store/activity-common/activity-session-storage/activity-session-storage.actions';

import * as commonUserInfoSelectors from 'src/app/store/common/common-user-info/common-user-info.selectors';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';
import * as moment from 'moment';

import { JwtService } from '@/app/common-source/services/jwt/jwt.service';
import { CommonValidatorService } from '@/app/common-source/services/common-validator/common-validator.service';
import { ActivityComServiceService } from '@/app/common-source/services/activity-com-service/activity-com-service.service';
import { SeoCanonicalService } from '@/app/common-source/services/seo-canonical/seo-canonical.service';
import { ApiActivityService } from '@/app/api/activity/api-activity.service';
import { ApiBookingService } from '@/app/api/booking/api-booking.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { environment } from '@/environments/environment';

import { DeliveryList, GenderSet } from './models/activity-booking-information-page.model';

import { PageCodes } from '@/app/common-source/enums/page-codes.enum';
import { ActivityStore } from '@/app/common-source/enums/activity/activity-store.enum';
import { ActivityCommon } from '@/app/common-source/enums/activity/activity-common.enum';

import { BasePageComponent } from '../base-page/base-page.component';
import { ActivityModalAgreementComponent } from './modal-component/activity-modal-agreement/activity-modal-agreement.component';

@Component({
    selector: 'app-activity-booking-information-page',
    templateUrl: './activity-booking-information-page.component.html',
    styleUrls: ['./activity-booking-information-page.component.scss']
})
export class ActivityBookingInformationPageComponent extends BasePageComponent implements OnInit, OnDestroy {
    private subscriptionList: Subscription[];
    private element: any;
    private dataModel: any;

    public headerConfig: any;
    public mainForm: FormGroup;
    public viewModel: any;

    constructor(
        @Inject(PLATFORM_ID) public platformId: object,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translate: TranslateService,
        private el: ElementRef,
        private fb: FormBuilder,
        private comValidatorS: CommonValidatorService,
        private bsModalService: BsModalService,
        private route: ActivatedRoute,
        private router: Router,
        private jwtService: JwtService,
        private store: Store<any>,
        private activityComServiceService: ActivityComServiceService,
        private apiActivityService: ApiActivityService,
        private apiBookingService: ApiBookingService,
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

        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.className = '';
    }

    ngOnDestroy() {
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription): void => {
                item.unsubscribe();
            }
        );
        this.closeAllModals();
    }

    /**
    * 모든 bsModal 창 닫기
    */
    private closeAllModals() {
        for (let i = 1; i <= this.bsModalService.getModalsCount(); i++) {
            this.bsModalService.hide(i);
        }
    }

    // 여행자
    get travelers(): FormArray {
        return this.mainForm.get('travelers') as FormArray;
    }

    // 액티비티 아이템
    get activityItemFormArray(): FormArray {
        return this.mainForm.get('activityItems') as FormArray;
    }

    // 액티비티 아이템 안의 여행자
    get travelerFormArray(): FormArray {
        return this.activityItemFormArray.controls[0].get('travelers') as FormArray;
    }

    // 액티비티 아이템 안의 필수답변 사항
    get neededInfoFormArray(): FormArray {
        return this.activityItemFormArray.controls[0].get('neededInfos') as FormArray;
    }

    // 규정
    get agreeList(): FormArray {
        return this.mainForm.get('agreeList') as FormArray;
    }

    private initialize() {
        this.element = this.el.nativeElement;
        this.dataModel = {};
        this.viewModel = {
            neededInfoList: []
        };
        this.subscriptionList = [];
        this.headerInit();
        this.formInit();
        this.loginInit();
    }

    private headerInit() {
        this.headerConfig = {
            category: PageCodes.PAGE_RENT
        };
    }

    public formInit() {
        this.mainForm = this.fb.group({
            userNo: [''],
            name: [
                '',
                [
                    Validators.required,
                    this.comValidatorS.customPattern({ pattern: /^[가-힣a-zA-Z]*$/, msg: '한글 또는 영문으로만 입력해주세요.' })
                ]
            ],
            mobileNo: [
                '',
                [
                    Validators.required, this.comValidatorS.customPattern({ pattern: /^01([0|1|6|7|8|9]?)([0-9]{3,4})([0-9]{4})$/, msg: '\'-\'를 제외한 숫자만 입력해주세요.' })
                ]
            ], // - 입력도 포함
            email: ['', [Validators.required, Validators.email]],
            travelers: this.fb.array([]),
            activityItems: this.fb.array(
                [
                    this.fb.group({
                        activityCode: new FormControl(''),
                        optionCode: new FormControl(''),
                        serviceFromDate: new FormControl(''),
                        serviceToDate: new FormControl(''),
                        travelers: this.fb.array([]),
                        amountSum: new FormControl(''),
                        currencyCode: new FormControl(''),
                        promotionSeq: new FormControl(''),
                        deliveryZipCode: new FormControl(''),
                        deliveryAddress: new FormControl(''),
                        conditionCodedData: new FormControl(''),
                        neededInfos: this.fb.array([]),
                    })
                ]
            ),
            agreeList: this.fb.array(
                [
                    new FormControl(false),
                    new FormControl(false),
                    new FormControl(false)
                ],
                [this.comValidatorS.validateAgreeList]
            ),
        });
    }

    private loginInit() {
        const curUrl = this.route.snapshot['_routerState'].url;
        this.jwtService.loginGuardInit(curUrl)
            .then(
                (resp: any) => {
                    if (resp) {
                        this.subscribeInit();
                        this.sessionInit();
                        resp && this.sendActivityInfomation();
                    }
                },
                (err: any) => {
                    console.info('[jwtService.loginGuardInit > err]', err);
                }
            );
    }

    /**
     * subscribeInit
     * 구독 준비
     */
    private subscribeInit(): void {
        this.subscriptionList.push(
            this.store.pipe(
                select(commonUserInfoSelectors.getSelectId(['commonUserInfo'])),
                distinct((item: any) => item)
            )
                .subscribe(
                    (resp: any): void => {
                        if (resp) {
                            this.dataModel.user = _.cloneDeep(resp.userInfo.user);
                            this.dataModel.traveler = _.cloneDeep(resp.traveler);

                            this.mainForm.patchValue({
                                userNo: this.dataModel.user.userNo,
                                name: this.dataModel.user.nameKo,
                                mobileNo: this.dataModel.user.mobileNo.replace(/-/gi, ''),
                                email: this.dataModel.user.emailAddress
                            });
                        }
                    }
                )
        );
    }

    /**
     * sessionInit
     * 세션 데이터 초기화
     */
    private sessionInit(): void {
        const sessionItem = JSON.parse(sessionStorage.getItem(ActivityStore.STORE_COMMON));

        if (!_.isEmpty(sessionItem.activitySessionStorages.entities)) {
            const request = this.activityComServiceService.afterEncodingRq(
                _.cloneDeep(sessionItem.activitySessionStorages.entities[ActivityStore.STORE_BOOKING_INFORMATION].result)
            );
            console.log(sessionItem);
            this.dataModel.conditionRequest = _.cloneDeep(request.rq);
            this.dataModel.optionView = _.cloneDeep(request.view);
            this.dataModel.informationRequest = _.cloneDeep(this.dataModel.conditionRequest);
            this.dataModel.informationRequest.condition = { activityCode: request.rq.condition.activityCode };
        }
    }

    private sendActivityInfomation() {
        this.subscriptionList.push(
            forkJoin(
                this.apiActivityService.POST_ACTIVITY_CONDITION(this.dataModel.conditionRequest),
                this.apiActivityService.POST_ACTIVITY_INFORMATION(this.dataModel.informationRequest)
            )
                .pipe(distinct((item: any) => item))
                .subscribe(
                    ([resp1, resp2]: any) => {
                        console.log('이게 뭘까요??? : ', resp1, resp2);

                        if (resp1.succeedYn && resp2.succeedYn) {
                            this.dataModel.conditionResponse = _.cloneDeep(resp1.result);
                            this.dataModel.informationResponse = _.cloneDeep(resp2.result);
                            this.upsertOneSession({
                                id: ActivityStore.STORE_BOOKING_INFORMATION_RS,
                                result: _.cloneDeep(resp1.result)
                            });
                            this.dataModel.transactionSetId = resp1.transactionSetId;
                            this.setNeededInfos();
                            this.setActivityItems();
                            this.setViewModel();
                        } else {
                            if (resp1.errorMessage) {
                                this.alertService.showApiAlert(resp1.errorMessage);
                            } else {
                                this.alertService.showApiAlert(resp2.errorMessage);
                            }
                        }
                    },
                    (err: any) => {
                        this.alertService.showApiAlert(err.error.errorMessage);
                    }
                )
        );
    }

    private setNeededInfos() {
        this.dataModel.conditionResponse.neededInfos.map(
            (item: any) => {
                console.log(this.neededInfoFormArray);
                this.neededInfoFormArray.push(
                    this.fb.group(
                        {
                            infoCode: new FormControl(item.infoCode),
                            infoName: new FormControl(item.infoName),
                            addValue: new FormControl(item.addValue || ''),
                            // 사용자 답변
                            userInputValue: new FormControl(
                                '',
                                [
                                    Validators.required,
                                    Validators.maxLength(50)
                                ]
                            ),
                            // 해당 값이 Y이면 this.itemTravelers의 neededInfos의 모든 값을 넣어줘야함
                            perTravelerYn: new FormControl(item.perTravelerYn)
                        }
                    )
                );
            }
        );
    }

    private setActivityItems() {
        console.log('activityItems 코드를 만들어 볼까요? ', this.dataModel);
        this.activityItemFormArray.controls[0].patchValue({
            activityCode: this.dataModel.conditionRequest.condition.activityCode,
            optionCode: this.dataModel.conditionRequest.condition.optionCode,
            serviceFromDate: this.dataModel.conditionRequest.condition.serviceDate,
            serviceToDate: this.dataModel.conditionRequest.condition.serviceDate,
            amountSum: this.dataModel.optionView.amountSum,
            currencyCode: this.dataModel.conditionResponse.chargeConditions[0].billingCurrencyCode,
            promotionSeq: '',
            deliveryZipCode: '',
            deliveryAddress: '',
            conditionCodedData: this.dataModel.conditionResponse.conditionCodedData
        });
    }

    private setViewModel() {
        console.log('제대로 내려오고 있나요? ', this.dataModel);

        this.viewModel = {
            date: moment(this.dataModel.conditionRequest.condition.serviceDate).format('YYYY.MM.DD(ddd)'),
            defaultPhoto: this.dataModel.optionView.mainImage,
            activityNameLn: this.dataModel.informationResponse.activityNameLn,
            activityNameEn: this.dataModel.informationResponse.activityNameEn,
            amountSum: 0,
            cancelMainDeadLineDate: moment(this.dataModel.conditionResponse.cancelDeadline.clientCancelDeadline).format('MM.DD (ddd)'),
            cancelMainDeadLineTime: moment(this.dataModel.conditionResponse.cancelDeadline.clientCancelDeadline).format('HH:mm'),
            cancelDeadLineList: this.dataModel.conditionResponse.chargeConditions.map(
                (item: any) => {
                    if (Number(item.chargeAmount) > 0) {
                        return {
                            charged: true,
                            chargeAmount: item.chargeAmount,
                            startDate: item.clientFromTime,
                            endDate: item.clientToTime
                        };
                    } else {
                        return {
                            charged: false,
                            chargeAmount: item.chargeAmount,
                            startDate: item.clientFromTime,
                            endDate: item.clientToTime
                        };
                    }
                }
            ),
            travelerInfoList: _.cloneDeep(this.dataModel.traveler).map(
                (item: any) => {
                    item.active = false;
                    return item;
                }
            ),
            travelerCountInfoList: [],
            deleverOptionList: DeliveryList,
            ageTypeCode: {
                'AAG01': 'ADT',
                'AAG04': 'CHD',
                'AAG05': 'INF'
            },
            genderList: GenderSet,
            neededInfoList: this.dataModel.conditionResponse.neededInfos,
            reviewAverage: this.dataModel.informationResponse.reviewAverage,
            reviewCount: this.dataModel.informationResponse.reviewCount,
            instantConfirmYn: this.dataModel.informationResponse.instantConfirmYn
        };

        this.viewModel.travelerSum = this.dataModel.optionView.age.map(
            (item: any) => {
                this.viewModel.amountSum += item.countAmountSum;

                new Array(item.count)
                    .fill(item)
                    .map(
                        (tItem: any, tIndex: number) => {
                            this.addTraveler(tItem, (tIndex + 1));
                        }
                    );

                return {
                    traveler: `${item.name}*${item.count}`,
                    amountSum: `${item.countAmountSum}`,
                };
            }
        );

        console.log('어떻게 되어서 나오는거지? ', _.cloneDeep(this.viewModel));
    }

    /**
    * addTraveler
    * 사용자 수 만큼 formarray 크기 변경 및 초기화
    */
    private addTraveler(item: any, travelerIndex: number) {
        console.log('ttttt traveler ', item);

        this.travelers.push(
            this.fb.group({
                ageTypeCode: new FormControl(item.code),
                birthday: new FormControl(
                    '',
                    [
                        Validators.required,
                        this.comValidatorS.customPattern(
                            {
                                pattern: /^(19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])*$/,
                                msg: '생년월일을 \'-\'를 제외한 제외한 8자리(2000101) 숫자만으로 입력해주세요.'
                            }
                        )
                    ]
                ),
                firstName: new FormControl(
                    '',
                    [
                        Validators.required,
                        Validators.maxLength(50),
                        this.comValidatorS.customPattern({ pattern: /^[a-zA-Z]*$/, msg: '영문만 입력해주세요.' })
                    ]
                ),
                gender: new FormControl('M', Validators.required),
                lastName: new FormControl(
                    '',
                    [
                        Validators.required,
                        Validators.maxLength(50),
                        this.comValidatorS.customPattern({ pattern: /^[a-zA-Z]*$/, msg: '영문만 입력해주세요.' })
                    ]
                ),
                middleName: new FormControl(''),
                name: new FormControl(
                    '',
                    [
                        Validators.required,
                        Validators.maxLength(33),
                        this.comValidatorS.customPattern({ pattern: /^[가-힣]*$/, msg: '한글만 입력해주세요.' })
                    ]
                ),
                nationalityCode: new FormControl('KR'),
                travelerIndex: new FormControl(travelerIndex),
                userNo: new FormControl(''),
                type: new FormControl(item.name),
                infoIndex: new FormControl(''),
                issueCountryCode: new FormControl('KR'),
                optionCodedData: new FormControl(item.optionCodedData),
                firstNameLn: new FormControl(''),
                lastNameLn: new FormControl('')
            })
        );

        this.travelerFormArray.push(
            this.fb.group({
                travelerIndex: new FormControl(travelerIndex),
                ageTypeCode: new FormControl(item.code),
                infoCode: new FormControl(''),
                addValue: new FormControl(''),
                userInputValue: new FormControl(''),
                optionCodedData: new FormControl(item.optionCodedData),
                firstNameLn: new FormControl(''),
                lastNameLn: new FormControl('')
            })
        );
    }

    private goBooking() {
        const formData = this.mainForm.value;
        formData.activityItems.map(
            (aItem: any) => {

                aItem.travelers = formData.travelers.map(
                    (item: any) => {
                        console.log('aaaaaaaa iiiiiinnnnnnnn tttttttt : ', item, aItem);

                        const newItem: any = {
                            travelerIndex: item.travelerIndex,
                            ageTypeCode: item.ageTypeCode,
                            infoCode: item.infoIndex && aItem.neededInfos[0].infoCode,
                            addValue: item.infoIndex && aItem.neededInfos[0].addValue,
                            userInputValue: item.infoIndex && aItem.neededInfos[0].userInputValue,
                            optionCodedData: item.optionCodedData
                        };

                        if (aItem.neededInfos.length === 0 || !aItem.neededInfos[0].perTravelerYn) {
                            newItem.infoCode = undefined;
                            newItem.addValue = undefined;
                            newItem.userInputValue = undefined;
                        }

                        return newItem;
                    }
                );

            }
        );

        const rq: any = {
            stationTypeCode: environment.STATION_CODE,
            currency: 'KRW',
            language: 'KO',
            transactionSetId: this.dataModel.transactionSetId,
            condition: {
                activityItems: formData.activityItems.map(
                    (item: any) => {
                        console.log('aaaaaaaa : ', item);

                        return {
                            activityCode: item.activityCode,
                            amountSum: item.amountSum,
                            conditionCodedData: item.conditionCodedData,
                            currencyCode: item.currencyCode,
                            deliveryAddress: item.deliveryAddress === '' && undefined,
                            deliveryZipCode: item.deliveryZipCode === '' && undefined,
                            neededInfos: item.neededInfos.map(
                                (infoItem: any) => {
                                    return {
                                        infoCode: infoItem.infoCode,
                                        addValue: infoItem.addValue,
                                        userInputValue: infoItem.userInputValue
                                    };
                                }
                            ),
                            optionCode: item.optionCode,
                            promotionSeq: item.promotionSeq === '' && undefined,
                            serviceFromDate: item.serviceFromDate,
                            serviceToDate: item.serviceToDate,
                            travelers: item.travelers
                        };
                    }
                ),
                booker: {
                    userNo: formData.userNo,
                    email: formData.email,
                    mobileNo: _.replace(formData.mobileNo, new RegExp('-', 'g'), ''),
                    name: formData.name,
                    // picUno: 예약담당자가 있을 경우 담당자 userNo를 integer type으로 넣는다
                },
                deviceTypeCode: environment.DEVICE_TYPE,
                domainAddress: window.location.href,
                travelers: formData.travelers.map(
                    (item: any) => {
                        console.log('ttttt : ', item);

                        return {
                            ageTypeCode: this.viewModel.ageTypeCode[item.ageTypeCode],
                            birthday: moment(item.birthday, 'YYYYMMDD').format('YYYY-MM-DD'),
                            firstName: _.upperCase(item.firstName),
                            firstNameLn: item.firstNameLn === '' && undefined,
                            gender: item.gender,
                            issueCountryCode: item.issueCountryCode,
                            lastName: _.upperCase(item.lastName),
                            lastNameLn: item.lastNameLn === '' && undefined,
                            middleName: item.middleName === '' && undefined,
                            name: item.name,
                            nationalityCode: item.nationalityCode,
                            travelerIndex: item.travelerIndex,
                            userNo: formData.userNo // 왜 예약자 userNo를 넘기는지 물어볼 것
                        };
                    }
                )
            }
        };

        this.sendBookingApi(rq);
        console.log('rrrrrrrrrrrqqqqqqqqqqqq : ', rq);
    }

    private sendBookingApi(rq: any) {
        this.upsertOneSession({
            id: ActivityStore.STORE_BOOKING_RS,
            result: rq,
        });
        this.subscriptionList.push(
            this.apiBookingService.POST_BOOKING(rq)
                .subscribe(
                    (res: any) => {
                        console.info('[예약완료 결제로 가잣 > res]', res.result);
                        if (res.succeedYn) {
                            this.upsertOneSession({
                                id: ActivityStore.STORE_BOOKING_RS,
                                result: _.cloneDeep(res.result),
                            });

                            // this.location.replaceState(ActivityCommon.PAGE_MAIN); // 예약 완료 페이지에서 뒤로가기시 메인페이지로 가기
                            this.router.navigate([ActivityCommon.PAGE_BOOKING_PAYMENT], { relativeTo: this.route });
                        } else {
                            this.alertService.showApiAlert(res.errorMessage);
                        }
                    },
                    (err: any) => {
                        this.alertService.showApiAlert(err.error.errorMessage);
                    }
                )
        );
    }

    private upsertOneSession(data: any) {
        this.store.dispatch(
            upsertActivitySessionStorage({ activitySessionStorage: data })
        );
    }

    /**
     * onChangeTraveler
     * 여행자 선택 시 이벤트
     */
    public onChangeTraveler(event: any, travelrsIndex: number) {
        event && event.preventDefault();

        const selectIndex = (event.target.selectedIndex - 1);
        this.travelers.controls[travelrsIndex].patchValue({
            birthday: _.replace(this.viewModel.travelerInfoList[selectIndex].birthday, new RegExp('-', 'g'), ''),
            firstName: this.viewModel.travelerInfoList[selectIndex].firstName,
            gender: this.viewModel.travelerInfoList[selectIndex].gender,
            lastName: this.viewModel.travelerInfoList[selectIndex].lastName,
            middleName: this.viewModel.travelerInfoList[selectIndex].middleName || '',
            name: this.viewModel.travelerInfoList[selectIndex].name,
            userNo: this.viewModel.travelerInfoList[selectIndex].userNo,
            infoIndex: selectIndex,
            firstNameLn: '',
            lastNameLn: ''
        });

        this.travelerFormArray.controls[travelrsIndex].patchValue({
            birthday: _.replace(this.viewModel.travelerInfoList[selectIndex].birthday, new RegExp('-', 'g'), ''),
            firstName: this.viewModel.travelerInfoList[selectIndex].firstName,
            gender: this.viewModel.travelerInfoList[selectIndex].gender,
            lastName: this.viewModel.travelerInfoList[selectIndex].lastName,
            middleName: this.viewModel.travelerInfoList[selectIndex].middleName || '',
            name: this.viewModel.travelerInfoList[selectIndex].name,
            userNo: this.viewModel.travelerInfoList[selectIndex].userNo,
            infoIndex: selectIndex,
            firstNameLn: '',
            lastNameLn: ''
        });

        this.viewModel.travelerInfoList = this.viewModel.travelerInfoList.map(
            (item: any, index: number) => {
                item.active = false;
                // 선택된 사용자 여행자 리스트에서 제거
                this.travelers.controls.map(
                    (tItem: any) => {
                        if (index === tItem.value.infoIndex) {
                            item.active = true;
                        }
                    }
                );

                return item;
            }
        );
    }

    public onChangeAllAgreement(event: any) {
        event && event.preventDefault();

        console.info('onChangeAllAgreement');
        const tgElList = this.element.querySelectorAll(`[data-target="agreeChk"] input[type='checkbox']`);
        if (event.target.checked) {
            _.forEach(tgElList, (tgElItem, index) => {
                tgElItem.checked = true;
                this.agreeList.controls[index].setValue(true);
            });
        } else {
            _.forEach(tgElList, (tgElItem, index) => {
                tgElItem.checked = false;
                this.agreeList.controls[index].setValue(false);
            });
        }
    }

    public onChangeAgreement(index: number, event?: any) {
        event && event.preventDefault();

        console.info('onChangeAgreement', index);
        let chkBool: boolean = true;

        //checkbox change 이벤트 발생 시
        if (!_.isEmpty(event)) {
            //checked false 경우
            if (!event.target.checked)
                chkBool = false;
        }

        //form update
        this.agreeList.controls[index].setValue(chkBool);

        //모든 동의 checkbox checked
        const isTotChk = _.every(this.agreeList.value);
        const totChk = this.element.querySelector(`[data-target="agreeAllChk"] input[type='checkbox']`);
        if (isTotChk) { // 모두 동의
            totChk.checked = true;
        } else {
            totChk.checked = false;
        }

        console.info('[onChangeAgreement formArray]', this.agreeList);

    }

    public onAgreementClick(event: MouseEvent, storeId: string) {
        event && event.stopImmediatePropagation();

        console.info('[요금, 취소수수료 규정]', event);
        let tabNumber: number;
        // 모달 전달 데이터
        const initialState = {
            storeId: storeId,
            okFun: (($store) => {
                console.info('[okFun]',);
                if ($store === 'normal')
                    tabNumber = 0;
                else if ($store === 'cancel')
                    tabNumber = 1;
                else if ($store === 'personalInfo')
                    tabNumber = 2;

                this.onChangeAgreement(tabNumber);
            })
        };

        // ngx-bootstrap config
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };

        this.bsModalService.show(ActivityModalAgreementComponent, { initialState, ...configInfo });
    }

    public onSubmit(event: MouseEvent) {
        event && event.preventDefault();
        console.info('[activity-booking-information > onSubmit > value]', this.mainForm.value);
        console.info('[activity-booking-information > onSubmit > valid]', this.mainForm.valid);

        if (this.mainForm.valid) {
            console.info('[1. 유효성 체크 성공]');
            this.goBooking();
        } else {
            _.forEach(
                this.mainForm.controls, (value: any, key: string) => {
                    console.info('[key | 유효성 체크 실패]', key);
                }
            );
        }
    }

    public onKeyupKrName(event: KeyboardEvent) {
        event && event.preventDefault();
    }

    public getActivityItems(form: any): any {
        return form.controls.activityItems.controls;
    }

    public getTravelers(form: any): any {
        return form.controls.travelers.controls;
    }

    public getNeedeInfos(form: any): any {
        return form.controls.neededInfos.controls;
    }

    /**
     * resetText
     * 텍스트 박스 리셋
     *
     * @param event? 돔 이벤트
     * @param target formKey
     */
    public userInfoReset(event: MouseEvent, target: string) {
        event && event.preventDefault();

        this.mainForm.get(target).patchValue('');
    }
}
