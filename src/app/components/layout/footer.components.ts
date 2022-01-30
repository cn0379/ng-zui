/*
 * @Author: zhangshaolong
 * @Date: 2021-12-25 15:22:25
 */
import { ChangeDetectionStrategy, Component, ElementRef, Renderer2, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'z-footer',
  exportAs: 'zFooter',
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <ng-content></ng-content> `
})
export class ZFooterComponent {
  constructor(public elementRef: ElementRef, private renderer: Renderer2) {
    this.renderer.addClass(this.elementRef.nativeElement, 'z-layout-footer');
  }
}
