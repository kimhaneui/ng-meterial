import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { RestCallService } from '../rest-call/rest-call.service';

@Injectable({
    providedIn: 'root'
})
export class ApiHotelService {
    constructor(
        private restCallS: RestCallService
    ) { }

    /**
     * 추천 호텔 조회
     */
    POST_HOTEL_RECOMMEND(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/hotel/recommend', body, opt);
    }

    /**
     * 호텔 검색
     */
    POST_HOTEL_LIST(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/hotel/list', body, opt);
    }

    /**
     * 호텔 지도 검색
     */
    POST_HOTEL_MAP(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/hotel/map', body, opt);
    }

    /**
     * 호텔 현재 상황 조회
     */
    POST_HOTEL_STATS(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/hotel/stats', body, opt);
    }

    /**
     * 호텔 객실 검색
     */
    POST_HOTEL_ROOM_LIST(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/hotel/room/list', body, opt);
    }

    /**
     * 호텔 차지 컨디션
     */
    POST_HOTEL_ROOM_CONDITION(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/hotel/room/condition', body, opt);
    }

    /**
     * 호텔 객실 정보
     */
    POST_HOTEL_ROOM_INFORMATION(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/hotel/room/information', body, opt);
    }

    /**
     * 호텔 상세정보
     */
    POST_HOTEL_INFORMATION(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/hotel/information', body, opt);
    }

    /**
     * 호텔 리뷰 보기
     */
    POST_HOTEL_REVIEW_LIST(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/hotel/review/list', body, opt);
    }

    /**
     * 호텔 리뷰 쓰기
     */
    POST_HOTEL_REVIEW_WRITE(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/hotel/review/write', body, opt);
    }

    /**
     * 호텔 위시에 추가
     */
    POST_HOTEL_BASKET(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/hotel/basket', body, opt);
    }

    /**
     * 호텔 요금 알리미에 추가
     */
    POST_HOTEL_ALERT(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/hotel/alert', body, opt);
    }

    /**
     * 호텔 멥버쉽카드 입력
     */
    POST_HOTEL_MEMEBERSHIP(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/hotel/memebership', body, opt);
    }

    /**
       * 호텔 예약 취소하기
       */
    POST_HOTEL_CANCEL(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/booking/hotel/cancel', body, opt);
    }

    /**
     * 호텔 장바구니 추가
     * @param $body
     * @param $opt
     */

    PUT_HOTEL_BASKET(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPut('/hotel/basket', body, opt);
    }
}
