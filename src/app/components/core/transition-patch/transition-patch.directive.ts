/*
 * @Author: zhangshaolong
 * @Date: 2022-02-08 10:23:40
 */
import { AfterViewInit, Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';

import { ZSafeAny } from '../types';

/**
 * hack the bug
 * angular router change with unexpected transition trigger after calling applicationRef.attachView
 * https://github.com/angular/angular/issues/34718
 */
@Directive({
  selector:
    '[z-button], z-button-group, [z-menu-item], [z-submenu]'
})
export class ZTransitionPatchDirective implements AfterViewInit, OnChanges {
  @Input() hidden: ZSafeAny = null;
  setHiddenAttribute(): void {
    if (this.hidden) {
      if (typeof this.hidden === 'string') {
        this.renderer.setAttribute(this.elementRef.nativeElement, 'hidden', this.hidden);
      } else {
        this.renderer.setAttribute(this.elementRef.nativeElement, 'hidden', '');
      }
    } else {
      this.renderer.removeAttribute(this.elementRef.nativeElement, 'hidden');
    }
  }

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {
    this.renderer.setAttribute(this.elementRef.nativeElement, 'hidden', '');
  }

  ngOnChanges(): void {
    this.setHiddenAttribute();
  }

  ngAfterViewInit(): void {
    this.setHiddenAttribute();
  }
}
