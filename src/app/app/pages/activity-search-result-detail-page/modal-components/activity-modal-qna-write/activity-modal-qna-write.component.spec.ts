/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ActivityModalQnaWriteComponent } from './activity-modal-qna-write.component';

describe('ActivityModalQnaWriteComponent', () => {
  let component: ActivityModalQnaWriteComponent;
  let fixture: ComponentFixture<ActivityModalQnaWriteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityModalQnaWriteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityModalQnaWriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
