import { Component, OnInit } from '@angular/core';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { ConfigInfo } from '@/app/common-source/models/common/modal.model';

import { ModalMypageMainComponent } from '@/app/layouts/page-layout/modal-components/modal-mypage-main/modal-mypage-main.component';

@Component({
    selector: 'app-review-detail',
    templateUrl: './review-detail.component.html',
    styleUrls: ['./review-detail.component.scss']
})
export class ReviewDetailComponent implements OnInit {

    constructor(
        public bsModalRef: BsModalRef,
        public bsModalService: BsModalService
    ) { }

    ngOnInit() {
    }
    modalClose() {
        this.bsModalRef.hide();
    }
    menuClick() {
        this.modalClose();
        const initialState = {};
        this.bsModalService.show(ModalMypageMainComponent, { initialState, ...ConfigInfo });
    }
}
