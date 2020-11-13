import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { RestCallService } from '../rest-call/rest-call.service';

@Injectable({
    providedIn: 'root'
})
export class ApiUserService {
    constructor(
        private restCallS: RestCallService
    ) { }

    /**
     * 로그인
     */
    POST_USER_LOGIN(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/user/login', body, opt);
    }

    /**
     * 사용자 정보
     */
    POST_USER_GETINFO(body?: any, opt?: any): Observable<any> {
        return this.restCallS.httpPost('/user/get-info', body, opt);
    }
}
