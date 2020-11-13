import { Component, Inject, PLATFORM_ID, OnInit, OnDestroy } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { pluck, take, tap } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import { upsertAirtelResultMainSearch } from 'src/app/store/airtel-search-result-page/main-search/airtel-result-main-search.actions';

import * as resultMainSearchSelectors from 'src/app/store/airtel-search-result-page/main-search/airtel-result-main-search.selectors';

import { TranslateService } from '@ngx-translate/core';

import * as _ from 'lodash';

import { AirtelSearchResultPageService } from './services/airtel-search-result-page.service';

import { AirtelResultSearch } from 'src/app/store/airtel-search-result-page/main-search/airtel-result-main-search.model';

import { PageCodes } from '../../common-source/enums/page-codes.enum';
import { HeaderTypes } from '../../common-source/enums/header-types.enum';


import { SeoCanonicalService } from '../../common-source/services/seo-canonical/seo-canonical.service';

import { BasePageComponent } from '../base-page/base-page.component';

@Component({
    selector: 'app-airtel-search-result-page',
    styleUrls: ['./airtel-search-result-page.component.scss'],
    templateUrl: './airtel-search-result-page.component.html',
})
export class AirtelSearchResultPageComponent extends BasePageComponent implements OnInit, OnDestroy {
    searchBool: boolean = false;
    vmModel: AirtelResultSearch;

    /**
     * 초기화 데이터
     * - 데이터 업데이트 전 데이터를 셋팅하고 수정하는 용도로 사용한다.
     */
    initData: any;
    /**
     * 데이터가 준비 된후에 템플릿이 실행한다.
     */
    initBool: boolean = false;

    con: any = {
        'stationTypeCode': 'STN03',
        'requestUno': 21910712,
        'currency': 'KRW',
        'language': 'KO',
        'condition': {
            'hotelCode': '233411'
        },
        'transactionSetId': 'L342607132378123684'
    };
    private subscriptionList: Subscription[];

    public hotelList$: Observable<any>;

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        public titleService: Title,
        public metaTagService: Meta,
        public seoCanonicalService: SeoCanonicalService,
        public translate: TranslateService,
        private route: ActivatedRoute,
        private _api: AirtelSearchResultPageService,
        private store: Store<any>,
        private router: Router
    ) {
        super(
            platformId,
            titleService,
            metaTagService,
            seoCanonicalService,
            translate
        );
        this.subscriptionList = [];
    }

    async ngOnInit() {
        console.info('[PAGE > ngOnInit]');
        this.basePageInit({
            headerInit: {
                pageCode: PageCodes['PAGE_AIRTEL'],
                headerType: HeaderTypes['SUB_PAGE'],
                headerConfig: {
                    icon: {
                        'room': true
                    },
                    step: '04 LAX 호텔 룸타입 선택',
                    detail: '09.30-10.02(5일), 객실2(3박), 5명'
                }
            }
        });

        await this.dataInit();
    }

    ngOnDestroy() {
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription) => {
                item.unsubscribe();
            }
        );
    }
    /**
    * 데이터 초기화
    */
    async dataInit() {
        /**
         * 파라메터 상태에 따라 api 호출 여부 결정
         */
        this.subscriptionList.push(
            this.route.queryParams
                .pipe(
                    take(1),
                    tap(ev => console.log('[queryParams$]', ev)),
                    pluck('search'),
                )
                .subscribe(
                    (ev: any) => (ev) ? this.searchBool = true : this.searchBool = false
                )
        );

        switch (this.searchBool) {
            case false:
                console.info('[switch > false ]');
                this.vmModel = await this._api.getHotelList(this.con);
                this.vmModel.id = 'airtel-search-result-page';
                this.upsertOne(this.vmModel);
                break;
            case true:
                console.info('[switch > true]');
                break;
            default:
        }

        this.initBool = true;
    }

    /**
     * 초기화 데이터 로드
     * - 최근 스토어 데이터를 가져온다.
     * - 가져온 데이터를 수정하기 위해 _.cloneDeep 적용.
     * - take(1) : 한번만 실행.
     * @param cloneDeep default true
     */
    initDataLoad($bool: boolean = true): void {
        this.subscriptionList.push(
            this.store
                .select(resultMainSearchSelectors.selectComponentStateVm)
                .subscribe(
                    (ev) => {
                        this.initData = ($bool) ? _.cloneDeep(ev) : ev;
                    }
                )
        );
    }

    /**
     * 데이터 추가 | 업데이트
     * action > key 값을 확인.
     */
    upsertOne($obj) {
        this.store.dispatch(upsertAirtelResultMainSearch({
            airtelResultMainSearch: $obj
        }));
    }

    onHotelDtl(hotelItem) {
        console.log('move hotel detail...');
        this.router.navigate(['/airtel-search-roomtype'], { queryParams: { hotelCode: hotelItem.hotelCode } });
    }

    getHotelRating(hotelGradeCode) {
        if (!hotelGradeCode) {
            return '0';
        }

        const hotelGradeCodeSplit = hotelGradeCode.split('.');
        let result = hotelGradeCodeSplit[0];
        if (hotelGradeCodeSplit.length > 1) {
            result += 'h';
        }
        return result;
    }
}
