import { Component, OnInit, Inject, PLATFORM_ID, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { environment } from '@/environments/environment';

import { JwtService } from 'src/app/common-source/services/jwt/jwt.service';
import { ApiMypageService } from 'src/app/api/mypage/api-mypage.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { Subscription } from 'rxjs';
import * as _ from 'lodash';

import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';

import { ConsultingTypeCode, TypeCodeList } from '@app/common-source/models/my-qna/consulting-type-code.model'

@Component({
    selector: 'app-my-modal-reservation-qna-write',
    templateUrl: './my-modal-reservation-qna-write.component.html',
    styleUrls: ['./my-modal-reservation-qna-write.component.scss']
})
export class MyModalReservationQnaWriteComponent extends BaseChildComponent implements OnInit {
    private subscriptionList: Subscription[];
    public consultingTypeCode: ConsultingTypeCode[];
    private dataModel: any;
    public viewModel: any;
    element: any;
    $element: any;
    mainForm: FormGroup; // 생성된 폼 저장
    bookingItemCode: any;
    type: any;
    typeCode: any;
    convertedList: any[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        public translateService: TranslateService,
        private fb: FormBuilder,
        private el: ElementRef,
        public bsModalRef: BsModalRef,
        public jwtService: JwtService,
        private apiMypageService: ApiMypageService,
        private alertService: ApiAlertService,
    ) {
        super(platformId);
        this.element = this.el.nativeElement;
        this.initialize();
        this.mainFormCreate();
    }

    ngOnInit(): void {
        super.ngOnInit();
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('overflow-none');
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
        this.subscriptionList = [];
        this.consultingTypeCode = TypeCodeList;

        this.convertedList = [];
        this.consultingTypeCode.forEach((item) => {
            this.convertedList[item.code] = this.convertedList[item.code] || [];
            this.convertedList[item.code].push(item);
        });


    }

    mainFormCreate() {
        this.mainForm = this.fb.group({
            consultingTypeCode: new FormControl('', [Validators.required]),
            questionDetail: new FormControl('', [Validators.required]),
        });
    }

    async writeComplete() {
        const userInfoRes = await this.jwtService.getUserInfo();
        const rqInfo =
        {
            stationTypeCode: environment.STATION_CODE,
            currency: 'KRW',
            language: 'KO',
            condition: {
                consultingCategoryCode: this.type,
                consultingTypeCode: this.mainForm.get('consultingTypeCode').value,
                userNo: userInfoRes.result.user.userNo,
                smsReceiveYn: true,
                questionTitle: 'title',
                questionDetail: this.mainForm.get('questionDetail').value,
                bookingItemCode: this.bookingItemCode,
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

}
