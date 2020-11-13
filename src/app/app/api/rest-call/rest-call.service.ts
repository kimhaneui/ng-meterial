import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

import { environment } from '@/environments/environment';

import { Condition } from '@/app/common-source/models/common/condition.model';

@Injectable({
    providedIn: 'root'
})
export class RestCallService {
    private baseUrl: String;
    private httpOptions: any;

    constructor(
        private http: HttpClient
    ) {
        this.initialize();
    }

    private initialize() {
        this.baseUrl = environment.API_URL;
        // Http Options
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json;charset=UTF-8'
            })
        };
    }


    /**
     * handleError
     * api 에러 로그 남기기
     */
    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('통신 에러:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(`서버 리턴 코드 ${error.status}, ` + `에러 내용: ${error.error}`);
        }
        // return an observable with a user-facing error message
        return throwError('서버 통신 에러 발생하였습니다. 잠시 후 다시 시도하세요');
    }

    public httpPost(path: string, data: Condition, opt?: any): Observable<any> {
        const url = this.baseUrl + path;
        const body = data || {};
        const options = { ...this.httpOptions, ...opt };

        return this.http
            .post(url, body, options)
            .pipe(
                timeout(Number(environment.timeOut)),
                catchError(this.handleError)
            );
    }

    public httpPut(path: string, data: Condition, opt?: any): Observable<any> {
        const url = this.baseUrl + path;
        const body = data || {};
        const options = { ...this.httpOptions, ...opt };

        return this.http
            .put(url, body, options)
            .pipe(
                timeout(Number(environment.timeOut)),
                catchError(this.handleError)
            );
    }
}
