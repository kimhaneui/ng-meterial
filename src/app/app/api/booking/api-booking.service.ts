import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { RestCallService } from '../rest-call/rest-call.service';

@Injectable({
    providedIn: 'root'
})
export class ApiBookingService {
    constructor(
        private restCallS: RestCallService
    ) { }

    /**
     * 항공, 호텔, 렌터카, 액티비티 예약하기 (통합 예약하기)
     */
    POST_BOOKING(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/booking', body, opt);
    }

    /**
     * 항공, 호텔, 렌터카, 액티비티 Retrieve (통합 Retrieve)
     */
    POST_BOOKING_RETRIEVE(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/booking/retrieve', body, opt);
    }

    /**
   * 항공 예약 취소하기
   */
    POST_BOOKING_FLIGHT_CANCEL(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/booking/flight/cancel', body, opt);
    }

    /**
     * 호텔 예약 취소하기
     */
    POST_BOOKING_HOTEL_CANCEL(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/booking/hotel/cancel', body, opt);
    }

    /**
     * 렌터카 예약 취소하기
     */
    POST_BOOKING_RENT_CANCEL(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/booking/rent/cancel', body, opt);
    }

    POST_BOOKING_ACTIVITY_CANCEL(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/booking/activity/cancel', body, opt);
    }

    /**
     * 항공, 호텔, 렌터카, 액티비티 이티켓보기 (통합 문서 보기(eTicket, voucher, confirmSheet))
     */
    POST_BOOKING_DOCUMENT(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/booking/document', body, opt);
    }

    /**
     * 예약 목록
     */
    POST_BOOKING_LIST(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/booking/list', body, opt);
    }

    /**
     * 예약 상세 내역
     */
    POST_BOOKING_DETAIL(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/booking/detail', body, opt);
    }

    /**
     * 내 여행자 목록
     */
    POST_BOOKING_TRAVELER(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/booking/traveler', body, opt);
    }

    POST_E_TICKET(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/booking/flight/e-ticket', body, opt);
    }

    POST_BASKET_LIST(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/booking/list', body, opt);
    }

    POST_HOTEL_INVOICE(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/booking/hotel/invoice', body, opt);
    }

    POST_HOTEL_VOUCHER(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/booking/hotel/voucher', body, opt);
    }

    POST_RENT_CONFIRMATION(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/booking/rent/confirm_sheet', body, opt);
    }

    POST_RENT_INVOICE(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/booking/rent/invoice', body, opt);
    }

    POST_ACTIVITY_VOUCHER(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/booking/activity/invoice', body, opt);
    }

    /**
    * 항공 예약 완료 정보
    */
    POST_BOOKING_FLIGHT_SUMMARY(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/booking/flight/summary', body, opt);
    }

    /**
     * POST_BOOKING_DISCOUNT_INFO
     * 요금 정보 확인
     *
     * @param body
     * @param opt
     */
    POST_BOOKING_DISCOUNT_INFO(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/booking/discount-info', body, opt);
    }

    POST_BOOKING_V2(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/booking/v2', body, opt);
    }
}
