import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { RestCallService } from '../rest-call/rest-call.service';

@Injectable({
    providedIn: 'root'
})
export class ApiPaymentService {
    constructor(
        private restCallS: RestCallService
    ) { }

    /**
     * 카드 결제
     */
    POST_PAYMENT_CARD_PAY(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/payment/card/pay', body, opt);
    }

    /**
     * 카드 결제 취소
     */
    POST_PAYMENT_CARD_CANCEL(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/payment/card/cancel', body, opt);
    }

    /**
     * 가상계좌 결제
     */
    POST_PAYMENT_BANK_PAY(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/payment/bank/pay', body, opt);
    }

    /**
     * 네이버페이 결제
     */
    POST_PAYMENT_NAVER_PAY(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/payment/naver/pay', body, opt);
    }

    /**
     * 네이버페이 결제취소
     */
    POST_PAYMENT_NAVER_CANCEL(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/payment/naver/cancel', body, opt);
    }

    /**
     * PUT_PAYMENT
     * 결제
     *
     * @param $body
     * @param $opt
     */
    PUT_PAYMENT(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPut('/payment', body, opt);
    }

    /**
     * POST_INICIS_PAYMENT_KEY
     * 예약 키 먼저 생성
     *
     * @param body
     * @param opt?
     */
    POST_INICIS_PAYMENT_KEY(body: any, opt?: any) {
        return this.restCallS.httpPost('/payment/inicis/key', body, opt);
    }
}
