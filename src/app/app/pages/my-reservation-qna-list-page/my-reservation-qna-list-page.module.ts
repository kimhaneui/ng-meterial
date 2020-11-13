import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyReservationQnaListPageComponent } from './my-reservation-qna-list-page.component';
import { MyModalReservationQnaViewComponent } from './modal-components/my-modal-reservation-qna-view/my-modal-reservation-qna-view.component';
import { MyModalReservationQnaWriteComponent } from './modal-components/my-modal-reservation-qna-write/my-modal-reservation-qna-write.component';

import { MyReservationQnaListPageRoutingModule } from './my-reservation-qna-list-page-routing.module';
import { CommonSourceModule } from 'src/app/common-source/common-source.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        MyReservationQnaListPageComponent,
        MyModalReservationQnaViewComponent,
        MyModalReservationQnaWriteComponent
    ],
    imports: [
        CommonModule,
        CommonSourceModule,
        MyReservationQnaListPageRoutingModule,
        FormsModule,
        ReactiveFormsModule
    ]
})
export class MyReservationQnaListPageModule { }
