import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Store } from '@ngrx/store';

import * as commonUserInfoSelectors from '../../../store/common/common-user-info/common-user-info.selectors';

import * as _ from 'lodash';

@Injectable({
    providedIn: 'root'
})
export class CommonUserInfoService implements OnDestroy {
    private subscriptionList: Subscription[];

    constructor(
        private store: Store<any>
    ) { }

    ngOnDestroy() {
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription) => {
                item.unsubscribe();
            }
        );
    }

    /**
     * 유저 정보 가져오기
     */
    getUserInfoSvc() {
        let vmInfo: any = {};

        // 데이터 선택
        this.subscriptionList.push(
            this.store
                .select(commonUserInfoSelectors.selectComponentStateVm)
                .subscribe(
                    (ev) => {
                        if (ev) {
                            vmInfo = _.cloneDeep(ev);
                        }
                    }
                )
        );

        // 리턴
        return vmInfo;
    }
}
