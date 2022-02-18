/*
 * @Author: zhangshaolong
 * @Date: 2022-02-07 15:26:39
 */
import { AfterViewInit, Directive, ElementRef, Host, Optional, Renderer2 } from '@angular/core';

import { ZButtonGroupComponent } from '../button';

@Directive({
  selector: '[z-button][z-dropdown]'
})
export class ZDropdownButtonDirective implements AfterViewInit {
  constructor(
    private renderer: Renderer2,
    @Host() @Optional() private zButtonGroupComponent: ZButtonGroupComponent,
    private elementRef: ElementRef
  ) {}
  ngAfterViewInit(): void {
    const parentElement = this.renderer.parentNode(this.elementRef.nativeElement);
    if (this.zButtonGroupComponent && parentElement) {
      this.renderer.addClass(parentElement, 'z-dropdown-button');
    }
  }
}

