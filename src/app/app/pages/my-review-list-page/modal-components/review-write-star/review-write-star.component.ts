import { Component, OnInit } from '@angular/core';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { ConfigInfo } from '@/app/common-source/models/common/modal.model';

import { ReviewDetailComponent } from '../review-detail/review-detail.component';
import { ReviewWriteComponent } from '../review-write/review-write.component';

@Component({
    selector: 'app-review-write-star',
    templateUrl: './review-write-star.component.html',
    styleUrls: ['./review-write-star.component.scss']
})
export class ReviewWriteStarComponent implements OnInit {

    constructor(
        public bsModalRef: BsModalRef,
        public bsModalService: BsModalService
    ) { }

    ngOnInit() {
    }
    modalClose() {
        this.bsModalRef.hide();
    }
    reviewWrite() {
        this.modalClose();
        const initialState = {};
        this.bsModalService.show(ReviewWriteComponent, { initialState, ...ConfigInfo });
    }
    myReview() {
        this.modalClose();
        const initialState = {};
        this.bsModalService.show(ReviewDetailComponent, { initialState, ...ConfigInfo });
    }
}
