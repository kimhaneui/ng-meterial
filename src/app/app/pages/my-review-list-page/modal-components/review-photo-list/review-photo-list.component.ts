import { Component, OnInit } from '@angular/core';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { ConfigInfo } from '@/app/common-source/models/common/modal.model';

import { ReviewPhotoDetailComponent } from '../review-photo-detail/review-photo-detail.component';

@Component({
    selector: 'app-review-photo-list',
    templateUrl: './review-photo-list.component.html',
    styleUrls: ['./review-photo-list.component.scss']
})
export class ReviewPhotoListComponent implements OnInit {

    constructor(
        public bsModalRef: BsModalRef,
        public bsModalService: BsModalService
    ) { }

    ngOnInit() {
    }
    modalClose() {
        this.bsModalRef.hide();
    }
    photoDetailClick() {
        const initialState = {};
        this.bsModalService.show(ReviewPhotoDetailComponent, { initialState, ...ConfigInfo });
    }
}
