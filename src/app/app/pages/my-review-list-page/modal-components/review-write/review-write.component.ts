import { Component, OnInit } from '@angular/core';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { ConfigInfo } from '@/app/common-source/models/common/modal.model';

import { ReviewWriteCompleteComponent } from '../review-write-complete/review-write-complete.component';

@Component({
    selector: 'app-review-write',
    templateUrl: './review-write.component.html',
    styleUrls: ['./review-write.component.scss']
})
export class ReviewWriteComponent implements OnInit {

    fileToUpload: File = null;
    url: any = '';

    constructor(
        public bsModalRef: BsModalRef,
        public bsModalService: BsModalService,
    ) {

    }

    ngOnInit() {
    }
    modalClose() {
        this.bsModalRef.hide();
    }
    reviewComplete() {
        this.modalClose();
        const initialState = {};
        this.bsModalService.show(ReviewWriteCompleteComponent, { initialState, ...ConfigInfo });
    }
    onSelectFile(event) {
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();

            reader.readAsDataURL(event.target.files[0]); // read file as data url

            reader.onload = (event) => { // called once readAsDataURL is completed
                this.url = event.target.result;
            };
        }
    }
    // handleFileInput(files: FileList) {
    //     this.fileToUpload = files.item(0);
    // }
    onDeleteItem() {

    }
}
