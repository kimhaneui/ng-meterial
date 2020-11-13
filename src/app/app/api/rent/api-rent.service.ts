import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { RestCallService } from '../rest-call/rest-call.service';

@Injectable({
    providedIn: 'root'
})
export class ApiRentService {
    constructor(
        private restCallS: RestCallService
    ) { }

    /**
     * 추천 렌터카 조회
     */
    POST_RENT_RECOMMEND(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/rent/recommend', body, opt);
    }

    /**
     * 렌터카 검색
     */
    POST_RENT_LIST(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/rent/list', body, opt);
    }

    /**
     * 렌터카 상세
     */
    POST_RENT_RENTRULE(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/rent/rent-rule', body, opt);
    }

    /**
     * 렌터카 옵션 검색
     */
    POST_RENT_OPTION(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/rent/option', body, opt);
    }

    /**
     * 렌터카 현재 상황 조회
     */
    POST_RENT_STATS(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/rent/stats', body, opt);
    }

    /**
     * 렌터카 운임규정 조회
     */
    POST_RENT_CONDITION(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/rent/condition', body, opt);
    }

    /**
     * 렌터카 위시에 추가
     */
    POST_RENT_BASKET(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/rent/basket', body, opt);
    }

    /**
     * 렌터카 멤버쉽 입력
     */
    POST_RENT_MEMEBERSHIP(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/rent/memebership', body, opt);
    }

    /**
     * 렌터카 취소하기
     */
    POST_RENT_CANCEL(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/booking/rent/cancel', body, opt);
    }
}
