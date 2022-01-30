/*
 * @Author: zhangshaolong
 * @Date: 2022-01-26 23:48:27
 */
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  Input,
  Optional,
  Renderer2,
  SkipSelf,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import { ZIsMenuInsideDropDownToken } from './menu.token';

export function MenuGroupFactory(isMenuInsideDropDownToken: boolean): boolean {
  return isMenuInsideDropDownToken ? isMenuInsideDropDownToken : false;
}

@Component({
  selector: '[z-menu-group]',
  exportAs: 'zMenuGroup',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    /** check if menu inside dropdown-menu component **/
    {
      provide: ZIsMenuInsideDropDownToken,
      useFactory: MenuGroupFactory,
      deps: [[new SkipSelf(), new Optional(), ZIsMenuInsideDropDownToken]]
    }
  ],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div
      [class.z-menu-item-group-title]="!isMenuInsideDropDown"
      [class.z-dropdown-menu-item-group-title]="isMenuInsideDropDown"
      #titleElement
    >
      <ng-container *nzStringTemplateOutlet="zTitle">{{ zTitle }}</ng-container>
      <ng-content select="[title]" *ngIf="!zTitle"></ng-content>
    </div>
    <ng-content></ng-content>
  `,
  preserveWhitespaces: false
})
export class ZMenuGroupComponent implements AfterViewInit {
  @Input() zTitle?: string | TemplateRef<void>;
  @ViewChild('titleElement') titleElement?: ElementRef;

  constructor(
    public elementRef: ElementRef,
    private renderer: Renderer2,
    @Inject(ZIsMenuInsideDropDownToken) public isMenuInsideDropDown: boolean
  ) {
    const className = this.isMenuInsideDropDown ? 'z-dropdown-menu-item-group' : 'z-menu-item-group';
    this.renderer.addClass(elementRef.nativeElement, className);
  }

  ngAfterViewInit(): void {
    const ulElement = this.titleElement!.nativeElement.nextElementSibling;
    if (ulElement) {
      /** add classname to ul **/
      const className = this.isMenuInsideDropDown ? 'z-dropdown-menu-item-group-list' : 'z-menu-item-group-list';
      this.renderer.addClass(ulElement, className);
    }
  }
}
