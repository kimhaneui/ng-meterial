import { Component, Inject, PLATFORM_ID, ViewChild, ElementRef } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    @ViewChild('route', { read: ElementRef }) private routeElement: ElementRef;

    constructor(
        @Inject(PLATFORM_ID) public platformId: any
    ) { }

    public resetPosition() {
        this.routeElement.nativeElement.scrollTop = 0;
    }
}
