/*
 * @Author: zhangshaolong
 * @Date: 2022-01-13 22:01:51
 */
import { Direction, Directionality } from '@angular/cdk/bidi';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Renderer2,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { collapseMotion } from '../core/animation';

import { ZSafeAny } from '../core/types';

import { ZMenuModeType } from './menu.types';

@Component({
  selector: '[z-submenu-inline-child]',
  animations: [collapseMotion],
  exportAs: 'zSubmenuInlineChild',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <ng-template [ngTemplateOutlet]="templateOutlet"></ng-template> `,
  host: {
    class: 'z-menu z-menu-inline z-menu-sub',
    '[@collapseMotion]': 'expandState'
  },
})
export class ZSubmenuInlineChildComponent
  implements OnDestroy, OnInit, OnChanges
{
  @Input() templateOutlet: TemplateRef<ZSafeAny> | null = null;
  @Input() menuClass: string = '';
  @Input() mode: ZMenuModeType = 'vertical';
  @Input() nzOpen = false;
  listOfCacheClassName: string[] = [];
  expandState = 'collapsed';
  dir: Direction = 'ltr';
  private destroy$ = new Subject<void>();

  calcMotionState(): void {
    if (this.nzOpen) {
      this.expandState = 'expanded';
    } else {
      this.expandState = 'collapsed';
    }
  }

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    @Optional() private directionality: Directionality
  ) {}

  ngOnInit(): void {
    this.calcMotionState();

    this.dir = this.directionality.value;
    this.directionality.change
      ?.pipe(takeUntil(this.destroy$))
      .subscribe((direction: Direction) => {
        this.dir = direction;
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { mode, nzOpen, menuClass } = changes;
    if (mode || nzOpen) {
      this.calcMotionState();
    }
    if (menuClass) {
      if (this.listOfCacheClassName.length) {
        this.listOfCacheClassName
          .filter((item) => !!item)
          .forEach((className) => {
            this.renderer.removeClass(this.elementRef.nativeElement, className);
          });
      }
      if (this.menuClass) {
        this.listOfCacheClassName = this.menuClass.split(' ');
        this.listOfCacheClassName
          .filter((item) => !!item)
          .forEach((className) => {
            this.renderer.addClass(this.elementRef.nativeElement, className);
          });
      }
    }
  }

  ngOnDestroy(): void {}
}
