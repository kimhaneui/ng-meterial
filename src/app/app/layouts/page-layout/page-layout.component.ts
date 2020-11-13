import { Component, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Store } from '@ngrx/store';

import { upsertCommonLayout } from '../../store/common/common-layout/common-layout.actions';

import * as commonLayoutSelectors from '../../store/common/common-layout/common-layout.selectors';

import { BsModalRef } from 'ngx-bootstrap/modal';

import { ModalMypageMainComponent } from './modal-components/modal-mypage-main/modal-mypage-main.component';

@Component({
    selector: 'app-page-layout',
    templateUrl: './page-layout.component.html',
    styleUrls: ['./page-layout.component.scss']
})
export class PageLayoutComponent implements OnDestroy {
    isMyModalMain: boolean;
    storeId: string = 'my-menu-layout';
    bsModalRef: BsModalRef;
    private subscriptionList: Subscription[];

    constructor(
        private store: Store<any>
    ) {
        this.subscriptionList = [];
        this.subscribeInit();
    }

    ngOnDestroy() {
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription) => {
                item.unsubscribe();
            }
        );
    }

    @ViewChild(ModalMypageMainComponent) myMain: ModalMypageMainComponent;

    subscribeInit() {
        console.info('[CommonLayoutSideMenuService > subscribeInit]');
        this.subscriptionList.push(
            this.store
                .select(commonLayoutSelectors.getSelectId([this.storeId]))
                .subscribe(
                    (ev: any) => {
                        console.info('[CommonLayoutSideMenuService > subscribeInit]', ev);
                        if (ev) {
                            this.isMyModalMain = ev.isMyModalMain;

                        } else {
                            this.isMyModalMain = false;
                            this.commonLayoutUpsertOne({
                                id: this.storeId,
                                isMyModalMain: false
                            });
                        }
                    }
                )
        );

    }

    commonLayoutUpsertOne($obj) {
        this.store.dispatch(upsertCommonLayout({
            commonLayout: $obj
        }));
    }
}
