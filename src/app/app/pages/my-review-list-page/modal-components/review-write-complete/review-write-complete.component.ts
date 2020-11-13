import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { ConfigInfo } from '@/app/common-source/models/common/modal.model';

import { ReviewDetailComponent } from '../review-detail/review-detail.component';

@Component({
    selector: 'app-review-write-complete',
    templateUrl: './review-write-complete.component.html',
    styleUrls: ['./review-write-complete.component.scss']
})
export class ReviewWriteCompleteComponent implements OnInit {

    constructor(
        public bsModalRef: BsModalRef,
        public bsModalService: BsModalService,
        private route: ActivatedRoute,
        private router: Router,
    ) { }

    ngOnInit() {
    }
    modalClose() {
        this.bsModalRef.hide();
    }
    reviewDetail() {
        const initialState = {};
        this.bsModalService.show(ReviewDetailComponent, { initialState, ...ConfigInfo });
    }
    myReviewList() {
        this.modalClose();
        const path = '/my-review-list';
        const extras = {
            relativeTo: this.route
        };
        this.router.navigate([path], extras);
    }
}
