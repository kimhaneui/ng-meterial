/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BaseQnaComponent } from './base-qna.component';

describe('BaseQnaComponent', () => {
  let component: BaseQnaComponent;
  let fixture: ComponentFixture<BaseQnaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseQnaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseQnaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
