import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { RestCallService } from '../rest-call/rest-call.service';

@Injectable({
    providedIn: 'root'
})
export class ApiFlightService {
    constructor(
        private restCallS: RestCallService
    ) { }

    /**
     * 추천 항공 조회
     */
    POST_FLIGHT_RECOMMEND(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/flight/recommend', body, opt);
    }

    /**
     * 항공 검색
     */
    POST_FLIGHT_LIST_ITINERARY(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/flight/list/itinerary', body, opt);
    }

    /**
     * 항공 현재 상황 조회
     */
    POST_FLIGHT_STATS(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/flight/stats', body, opt);
    }

    /**
     * 항공 운임규정 조회
     */
    POST_FLIGHT_FARERULE(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/flight/fare-rule', body, opt);
    }

    /**
     * 항공 Seg Hold
     */
    POST_FLIGHT_SEGHOLD(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/flight/seg-hold', body, opt);
    }

    /**
     * 항공 비행상세 조회
     */
    POST_FLIGHT_DETAIL(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/booking/flight/detail', body, opt);
    }

    /**
     * 항공 부가서비스 조회
     */
    POST_FLIGHT_ANCILLARY(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/flight/ancillary', body, opt);
    }

    /**
     * 항공 위시에 추가
     */
    POST_FLIGHT_BASKET(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/flight/basket', body, opt);
    }

    /**
     * 항공 요금 알리미에 추가
     */
    POST_FLIGHT_ALERT(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/flight/alert', body, opt);
    }

    /**
     * 항공 중복 체크
     */
    POST_FLIGHT_DUPE(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/flight/dupe', body, opt);
    }

    /**
     * 항공 churning 체크
     */
    POST_FLIGHT_CHURNING(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/flight/Churning', body, opt);
    }

    /**
     * 항공 프로모션 조회
     */
    POST_FLIGHT_PROMOTION(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/flight/promotion', body, opt);
    }

    /**
     * 항공 페널티 체크
     */
    POST_FLIGHT_PENALTY(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/flight/penalty', body, opt);
    }

    /**
     * 항공 취소하기
     */
    POST_FLIGHT_CANCEL(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/booking/flight/cancel', body, opt);
    }

    /**
     * 항공 마일리지카드 입력
     */
    POST_FLIGHT_MEMEBERSHIP(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/flight/memebership', body, opt);
    }

    /**
     * 항공 APIS 입력
     */
    POST_FLIGHT_APIS(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/flights', body, opt);
    }

    /**
     * 항공 현지체류지 입력
     */
    POST_FLIGHT_LOCALSTAY(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/flight/localStay', body, opt);
    }

    /**
     * 항공 발권하기
     */
    POST_FLIGHT_TICKETING(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/flight/ticketing', body, opt);
    }

    /**
     * 항공 SeatMap 보기
     */
    POST_FLIGHT_SEAT_MAP(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/flight/seat/map', body, opt);
    }

    /**
     * 항공 SeatMap 지정
     */
    POST_FLIGHT_SEAT_ASSIGN(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/flight/seat/assign', body, opt);
    }

    PUT_FLIGHT_BASKET(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPut('/flight/basket', body, opt);
    }

    /**
     * POST_FLIGHT_FARE_DISCOUT
     * 국내선 요금 규정
     *
     * @param body
     * @param opt
     */
    POST_FLIGHT_FARE_DISCOUT(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/flight/fare-discount', body, opt);
    }
}
