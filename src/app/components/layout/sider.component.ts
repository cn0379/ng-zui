/*
 * @Author: zhangshaolong
 * @Date: 2021-12-25 15:24:58
 * @LastEditors: Please set LastEditors
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
import { NzBreakpointKey, NzBreakpointService, siderResponsiveMap } from '../core/services';
import { BooleanInput } from '../core/types';
import { inNextTick, InputBoolean, toCssPixel } from '../core/util';
// import { NzMenuDirective } from 'ng-zorro-antd/menu';-

@Component({
  selector: 'z-side',
  exportAs: 'zSide',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="z-layout-sider-children" >
      <ng-content></ng-content>
    </div>
  `,
  host:{
    class: 'z-layout-sider',
    '[style.flex]': 'flexSetting',
    '[style.maxWidth]': 'widthSetting',
    '[style.minWidth]': 'widthSetting',
    '[style.width]': 'widthSetting'
  }
})
export class ZSideComponent implements OnInit, OnDestroy, OnChanges, AfterContentInit  {

  private destroy$ = new Subject();
  @Output() readonly nzCollapsedChange = new EventEmitter();
  @Input() nzWidth: string | number = 200;
  @Input() nzTheme: 'light' | 'dark' = 'dark';
  @Input() nzCollapsedWidth = 80;
  @Input() nzBreakpoint: NzBreakpointKey | null = null;
  @Input() @InputBoolean() nzReverseArrow = false;
  @Input() @InputBoolean() nzCollapsible = false;
  @Input() @InputBoolean() nzCollapsed = false;
  matchBreakPoint = false;
  flexSetting: string | null = null;
  widthSetting: string | null = null;

  constructor(
    private platform: Platform,
    private cdr: ChangeDetectorRef,
  ){

  }

  updateStyleMap(): void {
    this.widthSetting = this.nzCollapsed ? `${this.nzCollapsedWidth}px` : toCssPixel(this.nzWidth);
    this.flexSetting = `0 0 ${this.widthSetting}`;
    this.cdr.markForCheck();
  }

  updateMenuInlineCollapsed() :void {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.updateStyleMap();

  }

  ngOnDestroy(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    const { nzCollapsed, nzCollapsedWidth, nzWidth } = changes;
    if (nzCollapsed || nzCollapsedWidth || nzWidth) {
      this.updateStyleMap();
    }
    if (nzCollapsed) {
      this.updateMenuInlineCollapsed();
    }
  }

  ngAfterContentInit(): void {

  }

}
