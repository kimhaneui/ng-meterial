import { Component, Inject, OnInit, PLATFORM_ID, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import { clearActivityModalDestinations } from '@app/store/activity-common/activity-modal-destination/activity-modal-destination.actions';

import * as activityModalDestinationSelectors from '@app/store/activity-common/activity-modal-destination/activity-modal-destination.selectors';

import { TranslateService } from '@ngx-translate/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import * as _ from 'lodash';
import * as qs from 'qs';

import { MajorDestinationService } from '@/app/common-source/services/major-destination/major-destination.service';

import { environment } from '@/environments/environment';

import { RequestParam, RequestSet } from '@/app/common-source/models/common/condition.model';
import { majorDestinationRq } from '@/app/common-source/models/common/major-destination.model';
import { ConfigInfo } from '@/app/common-source/models/common/modal.model';

import { ActivityCommon } from '@/app/common-source/enums/activity/activity-common.enum';
import { ActivitySearch } from '@/app/common-source/enums/activity/activity-search.enum';
import { DestinationStore } from '@/app/common-source/enums/destination/destination-store.enum';

import { BaseChildComponent } from '../../../base-page/components/base-child/base-child.component';
import { ModalDestinationComponent } from '@/app/common-source/modal-components/modal-destination/modal-destination.component';

@Component({
    selector: 'app-activity-main-search',
    templateUrl: './activity-main-search.component.html',
    styleUrls: ['./activity-main-search.component.scss']
})
export class ActivityMainSearchComponent extends BaseChildComponent implements OnInit, OnDestroy {
    vm: any = {
        searchType: null, // CITY : 도시 선택, CATEGORY : 카테고리 선택, DETAIL : 상품 선택.
        searchCityCode: null,
        searchCityName: null,
        searchCategoryCode: null,
        searchCategoryName: null,
        detailId: null,
        categoryList: null
    };

    bsModalRef: BsModalRef;

    private subscriptionList: Subscription[];
    private majorRq: RequestParam;

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        private translateService: TranslateService,
        private store: Store<any>,
        private route: ActivatedRoute,
        private router: Router,
        private bsModalService: BsModalService,
        private majorDestinationS: MajorDestinationService
    ) {
        super(platformId);

        this.subscriptionList = [];
        this.getMajorDestination();
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.storeActivityCommonInit(); // store > activity-common 초기화
        this.vmInit();
        this.subscribeInit(); // 서브스크라이브 초기화
    }

    ngOnDestroy() {
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription) => {
                item.unsubscribe();
            }
        );
        this.closeAllModals();
    }

    private closeAllModals() {
        for (let i = 1; i <= this.bsModalService.getModalsCount(); ++i) {
            this.bsModalService.hide(i);
        }
    }

    private getMajorDestination() {
        this.majorRq = majorDestinationRq;
        this.majorRq.condition.itemCategoryCode = ActivityCommon.IITEM_CATEGORY_CODE;
        this.majorDestinationS.getMajorDestination(this.majorRq);
    }

    /**
     * vm 초기화
     */
    vmInit() {
        this.vm.categoryList = [
            { categoryId: 'AC01', styleType: 'sim', categoryName: 'CATEGORY_ITEM_TITLE_TYPE1', translateName: '' }, // WIFI&SIM카드
            { categoryId: 'AC02', styleType: 'service', categoryName: 'CATEGORY_ITEM_TITLE_TYPE2', translateName: '' }, // 여행서비스
            { categoryId: 'AC03', styleType: 'pickup', categoryName: 'CATEGORY_ITEM_TITLE_TYPE3', translateName: '' }, // 픽업/샌딩
            { categoryId: 'AC04', styleType: 'ticket', categoryName: 'CATEGORY_ITEM_TITLE_TYPE4', translateName: '' }, // 티켓/패스
            { categoryId: 'AC05', styleType: 'tour', categoryName: 'CATEGORY_ITEM_TITLE_TYPE5', translateName: '' }, // 투어
            { categoryId: 'AC06', styleType: 'experience', categoryName: 'CATEGORY_ITEM_TITLE_TYPE6', translateName: '' }, // 체험
            { categoryId: 'AC07', styleType: 'delicious', categoryName: 'CATEGORY_ITEM_TITLE_TYPE7', translateName: '' } // 맛집
        ];

        // 카테고리 목록에 다국어 title setting
        this.subscriptionList.push(
            this.translateService.getTranslation(this.translateService.getDefaultLang())
                .pipe(take(1))
                .subscribe(
                    (ev: any) => {
                        this.vm.categoryList = _.map(this.vm.categoryList, item => ({
                            ...item,
                            'translateName': ev.MAIN_SEARCH[item.categoryName]
                        }));
                    }
                )
        );
    }

    /**
     * 서브스크라이브 초기화
     */
    subscribeInit() {
        this.subscriptionList.push(
            this.store
                .select(activityModalDestinationSelectors.getSelectId([DestinationStore.STORE_ACTIVITY]))
                .subscribe(
                    (ev: any) => {
                        if (ev) {
                            this.vm.searchType = ev.type; // CITY : 도시 선택, CATEGORY : 카테고리 선택, DETAIL : 상품 선택.

                            if (this.vm.searchType === ActivitySearch.SEARCH_TYPE_CITY) {
                                this.vm.searchCityCode = ev.val;
                                this.vm.searchCityName = ev.name;
                            } else if (this.vm.searchType === ActivitySearch.SEARCH_TYPE_DETAIL) {
                                this.vm.detailId = Number(ev.val);
                            }

                            this.onGoNextPage();
                        }
                    }
                )
        );
    }

    /**
     * 다음 스탭으로 이동하는 로직
     * searchType에 따라 다른 페이지를 호출한다.
     */
    onGoNextPage() {
        if (this.vm.searchType == null) { // Defensive coding
            return;
        }

        let rqCondition = {};
        let tmpPath = '';

        if (this.vm.searchType === ActivitySearch.SEARCH_TYPE_DETAIL) {
            if (this.vm.detailId === null) { // Defensive coding
                return;
            }

            rqCondition = {
                activityCode: this.vm.detailId
            };
            tmpPath = ActivityCommon.PAGE_SEARCH_RESULT_DETAIL;
        } else {
            if (this.vm.searchCategoryCode === null && this.vm.searchCityCode === null) { // Defensive coding
                return;
            }

            if (this.vm.searchCategoryCode === null) { // searchCityCode 값만 있는 경우
                rqCondition = {
                    cityCode: this.vm.searchCityCode,
                    limits: [0, 10]
                };
                tmpPath = ActivityCommon.PAGE_CITY_INTRO;
            } else { // searchCityCode, searchCategoryCode 값이 있는 경우
                rqCondition = {
                    activityCategoryCode: this.vm.searchCategoryCode,
                    cityCode: this.vm.searchCityCode,
                    filter: {},
                    limits: [0, 10]
                };
                tmpPath = ActivityCommon.PAGE_SEARCH_RESULT;
            }
        }

        const activityMainInfo = {
            rq: _.cloneDeep(RequestSet),
            searchCityName: this.vm.searchCityName, // display용
            searchCategoryName: this.vm.searchCategoryName // display용
        };
        activityMainInfo.rq.condition = rqCondition;

        const qsStr = qs.stringify(activityMainInfo);
        const path = tmpPath + qsStr;
        const extras = {
            relativeTo: this.route
        };


        // this.location.replaceState(ActivityStore.PAGE_MAIN+);
        this.ngOnDestroy();
        this.router.navigate([path], extras);
    }

    searchModal() {
        const initialState = {
            storeId: DestinationStore.STORE_ACTIVITY,
            destinationRq: { // 목적지검색 API RQ
                rq: {
                    currency: 'KRW', // TODO - user setting
                    language: 'KO', // TODO - user setting
                    stationTypeCode: environment.STATION_CODE,
                    condition: {
                        itemCategoryCode: ActivityCommon.IITEM_CATEGORY_CODE,
                        keyword: null,
                        limits: [0, 20]
                    }
                }
            }
        };

        // console.info('[initialState]', initialState);
        this.bsModalRef = this.bsModalService.show(ModalDestinationComponent, { initialState, ...ConfigInfo });
    }

    /**
     * store > activity-common 초기화
     */
    storeActivityCommonInit() {
        this.store.dispatch(clearActivityModalDestinations());
    }

    /**
     * 검색어 클릭
     */
    onGoSearchClick() {
        this.vm.searchCategoryCode = null;
        this.vm.searchCategoryName = null;
        this.searchModal();
    }

    /**
     * 검색 카테고리 클릭
     */
    onGoCategorySearchClick($categoryIndex) {
        this.vm.searchCategoryCode = this.vm.categoryList[$categoryIndex].categoryId;
        this.vm.searchCategoryName = this.vm.categoryList[$categoryIndex].translateName;
        this.searchModal();
    }
}

