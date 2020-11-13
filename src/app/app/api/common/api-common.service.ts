import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { RestCallService } from '../rest-call/rest-call.service';

@Injectable({
    providedIn: 'root'
})
export class ApiCommonService {
    constructor(
        private restCallS: RestCallService
    ) { }

    /**
     * 목적지 검색
     */
    POST_DESTINATION(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/common/destination', body, opt);
    }

    /**
     * 주요 목적지 조회
     */
    POST_MAJOR_DESTINATION(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/common/major-destination', body, opt);
    }

    /**
     * 달력 조회
     */
    POST_CALENDAR(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/common/calendar', body, opt);
    }

    /**
     * 쿠폰 조회
     */
    POST_COUPON_LIST(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/common/coupon/list', body, opt);
    }

    /**
     * 쿠폰 다운로드
     */
    POST_COUPON_DOWN(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/common/coupon/down', body, opt);
    }

    /**
     * 이벤트 조회
     */
    POST_EVENT_LIST(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/common/event/list', body, opt);
    }

    /**
     * 이벤트 상세
     */
    POST_EVENT_DETAIL(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/common/event/detail', body, opt);
    }

    /**
     * 약관 조회
     */
    POST_TERMS(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/common/terms', body, opt);
    }

    /**
     * 공유하기 카카오
     */
    POST_SHARE_KAKAO(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/common/share/kakao', body, opt);
    }

    /**
     * 공유하기 페이스북
     */
    POST_SHARE_FACEBOOK(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/common/share/facebook', body, opt);
    }

    /**
     * 이메일 발송
     */
    POST_EMAIL(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/common/email', body, opt);
    }

    /**
     * 파일 업로드
     */
    POST_FILE_UPLOAD(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/common/file/upload', body, opt);
    }

    /**
     * 파일 삭제
     */
    POST_FILE_DELETE(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/common/file/delete', body, opt);
    }

    /**
     * 알림톡 템플릿 조회
     */
    POST_ALIMTALK_TEMPLATE(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/common/alim-talk/template', body, opt);
    }

    /**
     * 알림톡 발송
     */
    POST_ALIMTALK_SEND(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/common/alim-talk/send', body, opt);
    }

    /**
     * 상담내용 입력
     */
    POST_CONSULTING(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/common/consulting', body, opt);
    }

    /**
     * 전화번호 고객등급 조회
     */
    POST_CUSTOMER_GRADE(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/common/customer/grade', body, opt);
    }

    /**
     * UMS 문자수신 차단
     */
    POST_UMS_BLOCK(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/common/ums/block', body, opt);
    }

    /**
     * 날씨정보 조회
     */
    POST_WEATHER(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/common/weather', body, opt);
    }

    /**
     * 짧은 URL 생성
     */
    POST_SHORTURL(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/common/shortUrl', body, opt);
    }

    /**
     * 휴대폰 인증
     */
    POST_PHONECERTIFY(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/common/phoneCertify', body, opt);
    }
}
