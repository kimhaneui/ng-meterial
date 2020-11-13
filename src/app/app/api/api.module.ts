import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { JwtModule } from '@auth0/angular-jwt';

import { ApiTestService } from './api-test/api-test.service';

import { RestCallService } from './rest-call/rest-call.service';

import { environment } from '@/environments/environment';

export function tokenGetter() {
    console.info('[jwtOptionsFactory > tokenGetter]');

    if (localStorage.getItem(environment.JWT_OPTION.TOKEN_KEY)) {
        return localStorage.getItem(environment.JWT_OPTION.TOKEN_KEY);
    } else {
        return '';
    }
}

@NgModule({
    imports: [
        CommonModule,

        HttpClientModule,

        JwtModule.forRoot(
            {
                config: {
                    tokenGetter: tokenGetter,
                    allowedDomains: environment.JWT_OPTION.whitelistedDomains,
                    disallowedRoutes: environment.JWT_OPTION.blacklistedRoutes,
                    headerName: environment.JWT_OPTION.headerName,
                    authScheme: environment.JWT_OPTION.authScheme
                }
            }
        )
    ],
    providers: [
        RestCallService,
        ApiTestService
    ]
})
export class ApiModule { }
