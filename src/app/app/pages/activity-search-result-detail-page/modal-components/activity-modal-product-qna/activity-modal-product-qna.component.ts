import { Component, Inject, PLATFORM_ID, OnInit, OnDestroy } from '@angular/core';

import * as _ from 'lodash';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { environment } from '@/environments/environment';

import { BaseChildComponent } from '../../../../pages/base-page/components/base-child/base-child.component';
import { ActivityModalQnaWriteComponent } from '../activity-modal-qna-write/activity-modal-qna-write.component';

import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';
import { JwtService } from 'src/app/common-source/services/jwt/jwt.service';
import { ApiMypageService } from 'src/app/api/mypage/api-mypage.service';


@Component({
    selector: 'app-activity-modal-product-qna',
    templateUrl: './activity-modal-product-qna.component.html',
    styleUrls: ['./activity-modal-product-qna.component.scss']
})
export class ActivityModalProductQnaComponent extends BaseChildComponent implements OnInit, OnDestroy {
    private subscriptionList: Subscription[];
    private dataModel: any;
    public viewModel: any;

    activityMasterSeq: any;
    rqInfo: any;

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        public bsModalService: BsModalService,
        public bsModalRef: BsModalRef,
        public jwtService: JwtService,
        private apiMypageService: ApiMypageService,
        private alertService: ApiAlertService,
    ) {
        super(platformId);

        this.initialize();

    }



    ngOnInit(): void {
        super.ngOnInit();
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('overflow-none');

        console.log(this.activityMasterSeq, 'postSeq');
        console.log(this.rqInfo, 'rqInfo');
        this.getQnaList(this.rqInfo);

    }

    ngOnDestroy() {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
    }


    initialize() {
        this.dataModel = [];
        this.viewModel = [];
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

    getQnaList(rq) {
        this.subscriptionList.push(
            this.apiMypageService.POST_QNA(rq)
                .subscribe(
                    (res: any) => {
                        if (res.succeedYn) {

                            this.dataModel = _.cloneDeep(res.result);
                            console.log(this.dataModel, ' this.dataModel');
                            this.setViewModel();

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

    setViewModel() {
        this.viewModel = this.dataModel;
    }

    writeQna() {
        const initialState = {
            rqInfo: this.dataModel.list
        };
        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };
        this.bsModalRef = this.bsModalService.show(ActivityModalQnaWriteComponent, { initialState, ...configInfo });
    }

}
