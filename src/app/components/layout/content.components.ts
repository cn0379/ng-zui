import { ChangeDetectionStrategy, Component, ElementRef, Renderer2, ViewEncapsulation } from '@angular/core';


@Component({
  selector:'z-content',
  exportAs:'zContent',
  template: '<ng-content></ng-content>',
})

export class  ZContentComponent {
  constructor(private elementRef: ElementRef, private renderer: Renderer2) {
    this.renderer.addClass(this.elementRef.nativeElement, 'z-layout-content');
  }
}
