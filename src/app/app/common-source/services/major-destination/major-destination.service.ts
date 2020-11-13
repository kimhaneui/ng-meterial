import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Store } from '@ngrx/store';

import { clearCommonMajorDestinations, upsertCommonMajorDestination } from '@/app/store/common/common-major-destination/common-major-destination.actions';

import { ApiCommonService } from '@/app/api/common/api-common.service';
import { ApiAlertService } from '@/app/common-source/services/api-alert/api-alert.service';

import { RequestParam } from '@/app/common-source/models/common/condition.model';
import { CommonStore } from '../../enums/common/common-store.enum';

@Injectable({
    providedIn: 'root'
})
export class MajorDestinationService implements OnDestroy {
    private subscriptionList: Subscription[];

    constructor(
        private apiCommonS: ApiCommonService,
        private apiAlertS: ApiAlertService,
        private store: Store<any>
    ) {
        this.subscriptionList = [];
    }

    ngOnDestroy() {
        console.info('설마 이게 사라지는거야? 그런거야?');
        this.clearDestination();
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription) => {
                item.unsubscribe();
            }
        );
    }

    private upsertOne(data: any) {
        this.store.dispatch(
            upsertCommonMajorDestination({ commonMajorDestination: data })
        );
    }

    public getMajorDestination(requestParam: RequestParam) {
        this.subscriptionList.push(
            this.apiCommonS.POST_MAJOR_DESTINATION(requestParam)
                .subscribe(
                    (res: any) => {
                        console.info('[주요 도시 목록 데이터 가져오기 > res]', res.result);
                        try {
                            if (res.succeedYn) {
                                this.upsertOne(
                                    {
                                        id: CommonStore.STORE_MAJOR_DESTINATION_RS,
                                        result: res
                                    }
                                );
                            } else {
                                this.apiAlertS.showApiAlert(res.errorMessage);
                            }
                        } catch (err) {
                            this.apiAlertS.showApiAlert(err.error.message);
                        }
                    },
                    (err: any) => {
                        this.apiAlertS.showApiAlert(err.error.message);
                    }
                )
        );
    }

    public checkDestination(): boolean {
        return (this.subscriptionList.length > 0) ? false : true;
    }

    public clearDestination(): boolean {
        this.store.dispatch(clearCommonMajorDestinations());
        return true;
    }
}
