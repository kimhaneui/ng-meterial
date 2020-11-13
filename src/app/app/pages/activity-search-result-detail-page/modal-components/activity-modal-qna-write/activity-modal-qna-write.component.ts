import { Component, OnInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { environment } from '@/environments/environment';

import { JwtService } from 'src/app/common-source/services/jwt/jwt.service';
import { ApiMypageService } from 'src/app/api/mypage/api-mypage.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-activity-modal-qna-write',
    templateUrl: './activity-modal-qna-write.component.html',
    styleUrls: ['./activity-modal-qna-write.component.scss']
})
export class ActivityModalQnaWriteComponent extends BaseChildComponent implements OnInit, OnDestroy {
    private subscriptionList: Subscription[];
    public viewModel: any;
    private dataModel: any;
    mainForm: FormGroup; // 생성된 폼 저장
    rqInfo: any;
    resolveData: any;

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        public translateService: TranslateService,
        private fb: FormBuilder,
        public jwtService: JwtService,
        private apiMypageService: ApiMypageService,
        private alertService: ApiAlertService,
        public bsModalRef: BsModalRef,
        public bsModalService: BsModalService,
        private route: ActivatedRoute,

    ) {
        super(platformId);
        this.initialize();
        this.mainFormCreate();
    }

    ngOnInit() {
        super.ngOnInit();
        console.log(this.rqInfo, 'rqInfo');

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

    initialize() {
        this.dataModel = {};
        this.viewModel = {};
        this.subscriptionList = [];

    }

    modalClose() {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
        this.bsModalRef.hide();
    }

    onCloseClick(event: MouseEvent) {
        event && event.preventDefault();

        console.info('모달 닫기');
        this.modalClose();
    }

    mainFormCreate() {
        this.mainForm = this.fb.group({
            questionDetail: new FormControl('', [Validators.required]),
        });

        console.log(this.mainForm, 'this.mainForm');
    }


    async writeComplete() {

        const userInfoRes = await this.jwtService.getUserInfo();
        const rqInfo =
        {
            stationTypeCode: environment.STATION_CODE,
            currency: 'KRW',
            language: 'KO',
            condition: {
                boardMasterSeq: 1000020,
                postCategoryCode: 'IC04',
                userNo: userInfoRes.result.user.userNo,
                postTitle: this.mainForm.get('questionDetail').value,
                postDetail: this.mainForm.get('questionDetail').value,
                activityCode: this.rqInfo[0].activityMasterSeq
            },
        };
        console.log(rqInfo, ' writeComplete === rqInfo');

        this.subscriptionList.push(
            this.apiMypageService.PUT_QNA(rqInfo)
                .subscribe(
                    (res: any) => {
                        if (res.succeedYn) {
                            this.modalClose();
                            this.dataModel.response = _.cloneDeep(res.result);
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
