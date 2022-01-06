/*
 * @Author: zhangshaolong
 * @Date: 2021-12-25 15:24:58
 * @LastEditors: g05047
 */
import { Platform } from '@angular/cdk/platform';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NzBreakpointKey, NzBreakpointService, siderResponsiveMap } from './core/services';

@Component({
  selector: 'z-side',
  exportAs: 'zSide',
  template: '<ng-content></ng-content>',
})
export class ZSideComponent implements OnInit, OnDestroy, OnChanges, AfterContentInit  {
  constructor(
    private platform: Platform,
  ){

  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }

  ngOnDestroy(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  ngAfterContentInit(): void {

  }

}
