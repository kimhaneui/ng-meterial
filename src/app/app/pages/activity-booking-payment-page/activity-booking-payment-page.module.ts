import { NgModule, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';

import { CommonSourceModule } from '../../common-source/common-source.module';

import { ActivityBookingPaymentPageRoutes } from './activity-booking-payment-page.routing';

import { JwtService } from '../../common-source/services/jwt/jwt.service';

// 디렉티브
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';


// @ts-ignore
import * as translationKo from 'src/assets/i18n/activity-booking-page/ko.json';
// @ts-ignore
import * as translationEn from 'src/assets/i18n/activity-booking-page/en.json';

import { ActivityBookingPaymentPageComponent } from './activity-booking-payment-page.component';

/**
 * 필수 디렉티브
 * PreventDefaultLinkDirective : a 태그 이동 방지
 */
// ------------------------------------[다국어]
/**
 * 다국어 처리
 * 서버와 클라이언트에서의 분기 처리 추가
 */
const TRANSLATIONS = {
    ko: translationKo,
    en: translationEn
};

export class JSONModuleLoader implements TranslateLoader {
    getTranslation(lang: string): Observable<any> {
        return of(TRANSLATIONS[lang]);
    }
}

export function JSONModuleLoaderFactory(http: HttpClient, platform) {
    if (isPlatformBrowser(platform)) {
        return new TranslateHttpLoader(http, 'assets/i18n/activity-booking-page/', '.json');
    } else {
        return new JSONModuleLoader();
    }
}
// ------------------------------------[end 다국어]


@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        CommonSourceModule,
        FormsModule,
        ReactiveFormsModule,

        ActivityBookingPaymentPageRoutes,

        // 다국어
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: JSONModuleLoaderFactory,
                deps: [HttpClient, PLATFORM_ID]
            },
            isolate: true
        }),
    ],
    declarations: [ActivityBookingPaymentPageComponent],
    providers: [
        JwtService
    ],
})
export class ActivityBookingPaymentPageModule { }