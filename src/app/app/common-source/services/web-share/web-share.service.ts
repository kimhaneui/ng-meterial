import { Injectable, OnDestroy } from '@angular/core';

import { BsModalService } from 'ngx-bootstrap/modal';

import { Share } from '../../models/common/web-share.model';
import { ApiAlert } from '../../models/common/api-alert.model';
import { ConfigInfo } from '../../models/common/modal.model';

import { CommonModalAlertComponent } from '../../modal-components/common-modal-alert/common-modal-alert.component';

@Injectable({
    providedIn: 'root'
})
export class WebShareService {
    private navigatorShare: any;

    constructor(
        private bsModalS: BsModalService
    ) {
        this.navigatorShare = window.navigator;
    }

    private allModalClose() {
        new Array(this.bsModalS.getModalsCount())
            .fill(null)
            .map(
                (_item: any, index: number) => {
                    this.bsModalS.hide(index);
                }
            );
    }

    public webShare(shareInfo: Share): void {
        if (this.navigatorShare && this.navigatorShare.share) {
            this.navigatorShare.share(shareInfo)
                .then(
                    () => {
                        return console.log('공유 성공');
                    }
                ).catch(
                    (error: any) => {
                        return console.log('실패', error);
                    }
                );
        } else {
            const initialState: ApiAlert = {
                titleTxt: '현재 브라우저는 공유기능을 지원하지 않습니다.',
                okObj: {
                    fun: () => {
                        this.allModalClose();
                    }
                }
            };

            this.bsModalS.show(CommonModalAlertComponent, { initialState, ...ConfigInfo });
        }
    }
}
