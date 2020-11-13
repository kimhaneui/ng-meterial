import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';

//store
import { upsertFlightMainSearch } from 'src/app/store/flight-main-page/flight-main-search/flight-main-search.actions';
import { upsertHotelMainSearch } from 'src/app/store/hotel-main-page/hotel-main-search/hotel-main-search.actions';
import { upsertRentMainSearch } from 'src/app/store/rent-main-page/rent-main-search/rent-main-search.actions';

@Injectable({
    providedIn: 'root'
})
export class BackBtnService {

    constructor(
        private store: Store<any>,
        private router: Router,
    ) { }

    goFlightMainSearch(path: any, vm: any) {
        const obj: any = {
            id: 'flight-search-again',
            search: vm
        };

        this.store.dispatch(upsertFlightMainSearch({
            flightMainSearch: obj
        }));

        this.router.navigate([path]);
    }

    goHotelMainSearch(path: any, routeData: any, researchRq: any) {
        // 1. 검색 폼 디폴트 값 데이터 세팅
        /**
         * 호텔 결과 페이지 Request Data Model
         * environment.STATION_CODE
         */
        const rqInfo = {
            city: routeData.city,
            cityGubun: routeData.cityGubun,
            cityName: routeData.cityName,
            chkIn: routeData.chkIn,
            chkOut: routeData.chkOut,
            roomList: routeData.roomList
        };

        if (_.has(researchRq.condition, 'filter')) {
            const filter: any = researchRq.condition.filter;
            const detailObj: any = {};
            let price: any;
            let review: any;
            let star: any;
            if (_.has(filter, 'amount'))
                price = [filter.amount.lowestAmount, filter.amount.highestAmount];

            if (_.has(filter, 'reviewRatings'))
                review = [filter.reviewRatings.lowestRating, filter.reviewRatings.highestRating];

            if (_.has(filter, 'starRatings'))
                star = filter.starRatings;

            if (!_.isEmpty(price))
                detailObj['price'] = price;

            if (!_.isEmpty(review))
                detailObj['review'] = review;

            if (!_.isEmpty(star))
                detailObj['star'] = star;

            rqInfo['detail'] = detailObj;
        }

        console.info('againSearch > rqInfo', rqInfo);
        // 2. 각 카테고리 메인으로 이동
        const obj = {
            id: 'hotel-search-again',
            search: rqInfo
        };

        this.store.dispatch(upsertHotelMainSearch({
            hotelMainSearch: obj
        }));

        this.router.navigate([path]);
    }

    goRentMainSearch(path: any, resolveData: any) {
        const obj: any = {
            id: 'rent-search-again',
            search: _.omit(resolveData, 'rq')
        };

        this.store.dispatch(upsertRentMainSearch({
            rentMainSearch: obj
        }));

        this.router.navigate([path]);
    }
}
