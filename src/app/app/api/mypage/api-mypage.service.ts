import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { RestCallService } from '../rest-call/rest-call.service';

@Injectable({
    providedIn: 'root'
})
export class ApiMypageService {
    constructor(
        private restCallS: RestCallService
    ) { }

    // 예약리스트
    POST_BOOKING_LIST(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/booking/list', body, opt);
    }

    // 항공 예약 상세
    POST_BOOKING_FLIGHT_DETAIL(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/booking/flight/detail', body, opt);
    }

    // 호텔 예약 상세
    POST_BOOKING_HOTEL_DETAIL(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/booking/hotel/detail', body, opt);
    }

    // 렌터카 예약 상세
    POST_BOOKING_RENT_DETAIL(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/booking/rent/detail', body, opt);
    }

    POST_BOOKING_ACTIVITY_DETAIL(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/booking/activity/detail', body, opt);
    }

    // FAQ 리스트
    POST_MYPAGE_FAQ(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/my-page/faq', body, opt);
    }

    // FAQ 상세
    POST_MYPAGE_FAQ_DETAIL(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/my-page/faq/detail', body, opt);
    }

    // 공지사항 리스트
    POST_MYPAGE_NOTICE(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/my-page/notice', body, opt);
    }

    // 공지사항 상세
    POST_MYPAGE_NOTICE_DETAIL(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/my-page/notice/detail', body, opt);
    }

    POST_BASKET_LIST(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/basket/list', body, opt);
    }

    // 이용후기
    POST_REVIEW_LIST(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/my-page/review/list', body, opt);
    }

    // QNA
    POST_QNA(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/my-page/qna', body, opt);
    }

    // QNA_PUT
    PUT_QNA(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPut('/my-page/qna', body, opt);
    }

    // CONSULTING
    POST_CONSULTING(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/my-page/consulting', body, opt);
    }

    // CONSULTING_PUT
    PUT_CONSULTING(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPut('/my-page/consulting', body, opt);
    }
}
