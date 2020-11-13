import { Component, OnInit, Inject, PLATFORM_ID, ElementRef } from '@angular/core';
import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-my-modal-reservation-qna-view',
    templateUrl: './my-modal-reservation-qna-view.component.html',
    styleUrls: ['./my-modal-reservation-qna-view.component.scss']
})
export class MyModalReservationQnaViewComponent extends BaseChildComponent implements OnInit {
    element: any;
    $element: any;
    bookingItemCode: any;
    boardMasterSeq: any;
    requestDatetime: any;
    questionTitle: any;
    questionDetail: any;
    answerDetail: any;
    handleFinishDatetime: any;
    consultingTypeCode: any;
    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        public translateService: TranslateService,
        private el: ElementRef,
        public bsModalRef: BsModalRef
    ) {
        super(platformId);
        this.element = this.el.nativeElement;
    }

    ngOnInit(): void {
        super.ngOnInit();
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.add('overflow-none');
    }

    modalClose() {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
        this.bsModalRef.hide();
    }

    onCloseClick() {
        this.modalClose();
    }

}
