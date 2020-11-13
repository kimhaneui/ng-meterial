import { Component, Inject, OnInit, PLATFORM_ID, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Store } from '@ngrx/store';

import * as activityCityIntroPageSelectors from '../../../../store/activity-city-intro-page/activity-city-search/activity-city-search.selectors';

import * as _ from 'lodash';
import * as qs from 'qs';

import { environment } from '@/environments/environment';

import { ActivityCommon } from '@/app/common-source/enums/activity/activity-common.enum';
import { ActivityStore } from '@/app/common-source/enums/activity/activity-store.enum';

import { BaseChildComponent } from '../../../base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-activity-city-hotplace',
    templateUrl: './activity-city-hotplace.component.html',
    styleUrls: ['./activity-city-hotplace.component.scss']
})
export class ActivityCityHotplaceComponent extends BaseChildComponent implements OnInit, OnDestroy {
    vm: any = {
        cityName: null,
        nearByCities: null,
        searchCityCode: null,
        searchCityName: null
    };

    loadingBool: Boolean = false;
    rxAlive: boolean = true;

    private subscriptionList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        private store: Store<any>,
        private route: ActivatedRoute,
        private router: Router,
    ) {
        super(platformId);
        this.subscriptionList = [];
    }

    ngOnInit(): void {
        super.ngOnInit();

        this.rxAlive = true;
        this.vm.searchCity = {
            val: '',
            name: ''
        };

        this.subscribeInit(); // 서브스크라이브 초기화
    }

    ngOnDestroy() {
        this.rxAlive = false;
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription) => {
                item.unsubscribe();
            }
        );
    }

    /**
     * 서브스크라이브 초기화
     */
    subscribeInit() {
        this.subscriptionList.push(
            this.store
                .select(activityCityIntroPageSelectors.getSelectId(ActivityStore.STORE_CITYINTRO_RS))
                .subscribe(
                    (ev: any) => {
                        // console.info('[activityCityRs$ > subscribe]', ev);
                        if (ev) {
                            this.vm.nearByCities = _.cloneDeep(ev.result.nearByCities);
                            this.vm.nearByCities = _.map(this.vm.nearByCities, (item) => (
                                {
                                    ...item,
                                    'defaultPhotoUrl': (item.defaultPhotoUrl) ? item.defaultPhotoUrl : '/assets/images/temp/@temp-hotplace.png' // TODO default img
                                }
                            ));

                            this.loadingBool = true;
                        } else {
                            this.loadingBool = false;
                        }
                    }
                )
        );

        this.subscriptionList.push(
            this.store
                .select(activityCityIntroPageSelectors.getSelectId(ActivityStore.STORE_CITYINTRO_CITYNAME))
                .subscribe(
                    (ev: any) => {
                        // console.info('[activityCityName$ > subscribe]', ev);
                        if (ev) {
                            this.vm.cityName = ev.result;
                            this.loadingBool = true;
                        } else {
                            this.loadingBool = false;
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
        if (this.vm.searchCityCode === null) { // Defensive coding
            return;
        }

        const activityMainInfo = {
            rq: {
                stationTypeCode: environment.STATION_CODE,
                currency: 'KRW',  // TODO - user setting
                language: 'KO', // TODO - user setting
                condition: {
                    cityCode: this.vm.searchCityCode,
                    limits: [0, 10]
                }
            },
            searchCityName: this.vm.searchCityName,
            searchCategoryName: ''
        };


        this.rxAlive = false;
        // const base64Str = this.base64Svc.base64EncodingFun(activityMainInfo);
        // const path = ActivityStore.PAGE_CITY_INTRO + base64Str;
        const qsStr = qs.stringify(activityMainInfo);
        const path = ActivityCommon.PAGE_CITY_INTRO + qsStr;
        const extras = {
            relativeTo: this.route
        };
        this.router.navigate([path], extras);
    }

    /**
     * 검색 카테고리 클릭
     */
    onGoCityIntroClick(cIndex) {
        // console.log("onGoCityIntroClick cIndex : ", this.vm.nearByCities[cIndex]);
        this.vm.searchCityCode = this.vm.nearByCities[cIndex].cityCode;
        this.vm.searchCityName = (this.vm.nearByCities[cIndex].cityNameLn != null) ? this.vm.nearByCities[cIndex].cityNameLn : this.vm.nearByCities[cIndex].cityNameEn;
        this.onGoNextPage();
    }

}
