import { Component, OnInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { take } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { Subscription } from 'rxjs';
import * as _ from 'lodash';
import { environment } from '@/environments/environment';

import { upsertMyMileage } from 'src/app/store/my-mileage/my-mileage/my-mileage.actions';

import { ApiMypageService } from 'src/app/api/mypage/api-mypage.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';
import { JwtService } from 'src/app/common-source/services/jwt/jwt.service';

import { PostCategoryCode, CategoryList } from '@/app/common-source/models/my-qna/post-category-code.model';

import { ConsultingTypeCode, TypeCodeList } from '@/app/common-source/models/my-qna/consulting-type-code.model';

import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-my-modal-qna-write',
    templateUrl: './my-modal-qna-write.component.html',
    styleUrls: ['./my-modal-qna-write.component.scss']
})
export class MyModalQnaWriteComponent extends BaseChildComponent implements OnInit, OnDestroy {
    private subscriptionList: Subscription[];
    private dataModel: any;
    public viewModel: any;
    public consultingTypeCode: ConsultingTypeCode[];
    public consultingCategoryCode: PostCategoryCode[];
    resolveData: any;
    mainForm: FormGroup; // 생성된 폼 저장

    totalCount = 0;
    totalListCount = 0;
    checkBoxValue: boolean = true;
    limitStart = 0;
    limitEnd = 10;
    pageCount = 10;
    userInfoRes: any;
    code: any;
    categoryCode: any;
    public convertedList: any;

    imageSrc: any; result: Object;
    fileName: '';
    apiUrl = 'http://localhost:5500';

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        public translateService: TranslateService,
        public bsModalRef: BsModalRef,
        public bsModalService: BsModalService,
        private apiMypageService: ApiMypageService,
        private route: ActivatedRoute,
        private alertService: ApiAlertService,
        private store: Store<any>,
        private fb: FormBuilder,
        public jwtService: JwtService,
        private http: HttpClient
    ) {
        super(platformId);
        this.initialize();
        this.mainFormCreate();
    }


    ngOnInit(): void {
        super.ngOnInit();


        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('overflow-none');
        this.subscriptionList.push(
            this.route.data
                .pipe(take(1))
                .subscribe(
                    (data: any) => {
                        this.resolveData = _.cloneDeep(data.resolveData);
                        console.info('[1. route 통해 데이터 전달 받기]', data);
                    }
                )
        );

    }

    ngOnDestroy() {
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription): void => {
                item.unsubscribe();
            }
        );
    }

    modalClose() {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
        this.bsModalRef.hide();
    }

    onCloseClick() {
        this.modalClose();
    }

    private async initialize() {
        this.dataModel = {};
        this.viewModel = {};
        this.consultingCategoryCode = CategoryList;
        this.consultingTypeCode = TypeCodeList;
        this.subscriptionList = [];
        this.userInfoRes = await this.jwtService.getUserInfo();


        this.convertedList = [];
        this.consultingTypeCode.forEach((item) => {
            this.convertedList[item.code] = this.convertedList[item.code] || [];
            this.convertedList[item.code].push(item);
        });

        this.fileName = '';
    }

    upsertOne($obj) {
        this.store.dispatch(upsertMyMileage({
            myMileage: $obj
        }));
    }

    mainFormCreate() {
        this.mainForm = this.fb.group({
            consultingCategoryCode: new FormControl('', [Validators.required]),
            bookingItemCode: new FormControl('', [Validators.required]),
            consultingTypeCode: new FormControl(0, [Validators.required]),
            questionDetail: new FormControl('', [Validators.required]),
            selectFile: ['', Validators.required]
        });

        console.log(this.mainForm, 'this.mainForm');
    }

    async writeComplete() {

        const rqInfo =
        {
            stationTypeCode: environment.STATION_CODE,
            currency: 'KRW',
            language: 'KO',
            condition: {
                consultingCategoryCode: this.mainForm.get('consultingCategoryCode').value,
                consultingTypeCode: this.mainForm.get('consultingTypeCode').value,
                userNo: this.userInfoRes.result.user.userNo,
                smsReceiveYn: true,
                questionTitle: this.mainForm.get('questionDetail').value,
                questionDetail: this.mainForm.get('questionDetail').value,
                bookingItemCode: this.mainForm.get('bookingItemCode').value,
                attachedFileName1: this.mainForm.get('selectFile').value,
            },

        };

        console.log(rqInfo, 'rqInfo');

        this.subscriptionList.push(
            this.apiMypageService.PUT_CONSULTING(rqInfo)
                .subscribe(
                    (res: any) => {
                        if (res.succeedYn) {
                            this.modalClose();
                            this.dataModel.response = _.cloneDeep(res.result);
                            this.dataModel.transactionSetId = res.transactionSetId;
                            this.dataModel.form = this.mainForm;
                            console.log('성공이다~~~~');

                            this.upsertOne({
                                id: 'my-qna-list',
                                result: this.dataModel.response
                            });

                        } else {
                            this.alertService.showApiAlert(res.errorMessage);
                        }
                    },
                    (err: any) => {
                        console.log('error');
                        this.alertService.showApiAlert(err.error.errorMessage);
                    }
                )
        );
        this.mainForm.getRawValue();
        console.log(rqInfo, 'rqInfo');
        console.log(this.mainForm.getRawValue(), 'this.mainForm.getRawValue()');

    }


    public changeCategory(event: MouseEvent) {
        event && event.preventDefault();

        if (this.mainForm.value.consultingCategoryCode === '') {
            this.mainFormCreate();
        } else {

            this.setBookingList();
        }
        this.categoryCode = this.mainForm.value.consultingCategoryCode;
        this.convertedList = this.convertedList[this.categoryCode];

    }

    private setBookingList() {

        const rq = {
            stationTypeCode: environment.STATION_CODE,
            currency: 'KRW',
            language: 'KO',
            condition: {
                userNo: this.userInfoRes.result.user.userNo,
                excludeCancelYn: true,
                limits: [0, 10],
                itemCategoryCode: this.mainForm.value.consultingCategoryCode
            },

        };


        this.subscriptionList.push(
            this.apiMypageService.POST_BOOKING_LIST(rq)
                .subscribe(
                    (res: any) => {
                        if (res.succeedYn) {
                            this.viewModel.list = _.cloneDeep(res.result.list);
                            this.viewModel.list.forEach(item => {
                                this.code = this.viewModel.list[0].categories[0].code;

                                return item;
                            });

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

    onFileChange(files: FileList) {
        if (files && files.length > 0) {
            // For Preview
            const file = files[0];
            const reader = new FileReader();

            reader.readAsDataURL(file);
            reader.onload = () => {
                this.imageSrc = reader.result;
            };

            this.selectFile.setValue(file.name);
        }
        this.fileName = this.mainForm.get('selectFile').value;


    }

    get selectFile() {
        this.fileName = this.mainForm.get('selectFile').value;
        return this.mainForm.get('selectFile');
    }

    get files(): FormArray {
        return this.mainForm.get('selectFile') as FormArray;
    }

    newDest(): FormGroup {
        return this.fb.group({
            selectFile: new FormControl('', Validators.required)
        });
    }

    addDest() {
        this.files.push(this.newDest());
    }

    addClick() {
        this.addDest();
    }

    deleteClick() {

    }

    deleteFile() {

    }

}

