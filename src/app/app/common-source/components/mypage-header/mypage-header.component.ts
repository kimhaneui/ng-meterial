import { Component, Inject, Input, OnInit, PLATFORM_ID, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import { upsertCommonLayout } from '../../../store/common/common-layout/common-layout.actions';

import * as commonLayoutSelectors from '../../../store/common/common-layout/common-layout.selectors';

import { TranslateService } from '@ngx-translate/core';

import * as _ from 'lodash';

import { CommonLayoutSideMenuService } from '../../services/common-layout-side-menu/common-layout-side-menu.service';

import { HeaderTypes } from '../../enums/header-types.enum';

import { BaseChildComponent } from 'src/app/pages/base-page/components/base-child/base-child.component';

@Component({
    selector: 'app-mypage-header',
    templateUrl: './mypage-header.component.html',
    styleUrls: ['./mypage-header.component.scss']
})
export class MypageHeaderComponent extends BaseChildComponent implements OnInit, OnDestroy {
    @Input() headerType: HeaderTypes;
    @Input() headerConfig: any = null;

    isBrowser: boolean = false;
    isServer: boolean = false;

    vm = {
        title: '',
        sideMenuBool: false
    };

    vmSubscription: Subscription;

    rxAlive: boolean = true;

    private subscriptionList: Subscription[];

    constructor(
        @Inject(PLATFORM_ID) public platformId: any,
        public commonLayoutSideMenuService: CommonLayoutSideMenuService,
        private store: Store<any>,
        private translateService: TranslateService,
        private location: Location,
    ) {
        super(platformId);
        this.subscriptionList = [];
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.headerTitleInit();
        this.subscribeInit();
    }

    ngOnDestroy() {
        this.rxAlive = false;
        this.subscriptionList && this.subscriptionList.map(
            (item: Subscription) => {
                item.unsubscribe();
            }
        );
    }

    /**
     * 헤더 타이틀 초기화
     */
    headerTitleInit() {
        this.subscriptionList.push(
            this.translateService.getTranslation(
                this.translateService.getDefaultLang()
            )
                .pipe(take(1))
                .subscribe(
                    (ev) => {
                        this.vm.title = ev.HEADER.TITLE;
                    }
                )
        );
    }

    /**
     * 서브스크라이브 초기화
     */
    subscribeInit() {
        this.subscriptionList.push(
            this.store
                .select(commonLayoutSelectors.selectComponentStateVm)
                .subscribe(
                    (ev) => {
                        if (ev) {
                            this.vmUpdate(ev);
                            this.commonLayoutStoreUpdate();
                        }
                    }
                )
        );
    }

    /**
     * vm 데이터 업데이트
     */
    vmUpdate($commonLayout) {
        this.vm.sideMenuBool = $commonLayout.sideMenuBool;
    }

    commonLayoutStoreUpdate() {
        this.upsertOne({
            id: 'commonLayout',
            sideMenuBool: this.vm.sideMenuBool
        });
    }

    upsertOne($obj) {
        this.store.dispatch(upsertCommonLayout({
            commonLayout: $obj
        }));
    }

    /**
     * 메뉴클릭
     * @param e
     */
    onMenuClick(event: MouseEvent) {
        event && event.preventDefault();

        this.commonLayoutSideMenuService.setOpen();
    }

    /**
     * 뒤로가기
     */
    onBackClick() {
        const bodyEl = document.getElementsByTagName('body')[0];
        bodyEl.classList.remove('overflow-none');
        this.location.back();
    }

}
