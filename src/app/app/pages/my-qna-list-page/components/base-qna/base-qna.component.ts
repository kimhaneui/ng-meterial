import { Component, OnInit, Input, Inject, PLATFORM_ID } from '@angular/core';
import { QnaTypes } from '@/app/common-source/enums/qna/qna-types.enum';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { SeoCanonicalService } from 'src/app/common-source/services/seo-canonical/seo-canonical.service';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { take } from 'rxjs/operators';
import { JwtService } from 'src/app/common-source/services/jwt/jwt.service';
import { ApiMypageService } from 'src/app/api/mypage/api-mypage.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';
import { environment } from '@/environments/environment';
import { BasePageComponent } from '../../../base-page/base-page.component';
import { MyModalQnaViewComponent } from '../../modal-components/my-modal-qna-view/my-modal-qna-view.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-base-qna',
    templateUrl: './base-qna.component.html',
    styleUrls: ['./base-qna.component.scss']
})
export class BaseQnaComponent extends BasePageComponent implements OnInit {
    @Input() list: any;

    private subscriptionList: Subscription[];
    public dataModel: any;
    resolveData: any;
    qnaTypes = QnaTypes;
    bsModalRef: BsModalRef;

    settings = {
        'IC01': {
            'reservation-title': {
                'icon': 'fight2'
            }
        },
        'IC02': {
            'reservation-title': {
                'icon': 'hotel4'
            }
        },
        'IC03': {
            'reservation-title': {
                'icon': 'rentalcar3'
            }
        },
        'IC04': {
            'reservation-title': {
                'icon': 'activity3'
            }
        },
    };
    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translateService: TranslateService,
        private apiMypageService: ApiMypageService,
        private alertService: ApiAlertService,
        public jwtService: JwtService,
        private route: ActivatedRoute,
        private bsModalService: BsModalService,
    ) {
        super(
            platformId,
            titleService,
            metaTagService,
            seoCanonicalService,
            translateService
        );
        this.initialize();
        // this.pageInit();
    }

    async ngOnInit() {
        super.ngOnInit();
        this.subscriptionList.push(
            this.route.data
                .pipe(take(1))
                .subscribe(
                    (data: any) => {
                        this.resolveData = _.cloneDeep(data.resolveData);

                    }
                )
        );
    }

    private async initialize() {
        this.dataModel = {
        };
        this.subscriptionList = [];
    }

    async pageInit() {
        const userInfoRes = await this.jwtService.getUserInfo();
        const rqInfo =
        {
            stationTypeCode: environment.STATION_CODE,
            currency: 'KRW',
            language: 'KO',
            condition: {
                userNo: userInfoRes.result.user.userNo,
                limits: [0, 10]
            }
        };
        // this.getQnaList(rqInfo);

    }

    getQnaList(rq) {
        this.subscriptionList.push(
            this.apiMypageService.POST_CONSULTING(rq)
                .subscribe(
                    (res: any) => {
                        if (res.succeedYn) {
                            this.dataModel = _.cloneDeep(res.result);
                            this.dataModel.list.forEach(item => {
                                return item;
                            });

                        }
                    },
                    (err: any) => {
                        this.alertService.showApiAlert(err.error.errorMessage);
                    }
                )

        );

    }
    detailView(i: number) {
        const initialState = {
            bookingItemCode: this.list[i].bookingItemCode,
            boardMasterSeq: this.list[i].boardMasterSeq,
            questionTitle: this.list[i].questionTitle,
            questionDetail: this.list[i].questionDetail,
            requestDatetime: this.list[i].requestDatetime,
            answerDetail: this.list[i].answerDetail,
            handleFinishDatetime: this.list[i].handleFinishDatetime,
            consultingTypeCode: this.list[i].consultingTypeCode,
            icon: this.settings[this.list[i].consultingCategoryCode]['reservation-title'].icon
        };

        const configInfo = {
            class: 'm-ngx-bootstrap-modal',
            animated: false
        };
        this.bsModalRef = this.bsModalService.show(MyModalQnaViewComponent, { initialState, ...configInfo });
    }

}
