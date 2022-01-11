/*
 * @Author: zhangshaolong
 * @Date: 2022-01-14 05:23:11
 */
import { Direction, Directionality } from '@angular/cdk/bidi';
import {
  AfterContentInit,
  ChangeDetectorRef,
  ContentChildren, // 需了解
  Directive,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  QueryList,
  SimpleChanges,
  SkipSelf
} from '@angular/core';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BooleanInput } from '../core/types';
import { InputBoolean } from '../core/util';

import { ZMenuModeType, ZMenuThemeType  } from './menu.types';
import { MenuService } from './menu.service';

import { ZIsMenuInsideDropDownToken,ZMenuServiceLocalToken  } from './menu.token';

export function MenuServiceFactory(
  serviceInsideDropDown: MenuService,
  serviceOutsideDropDown: MenuService
): MenuService {
  return serviceInsideDropDown ? serviceInsideDropDown : serviceOutsideDropDown;
}
export function MenuDropDownTokenFactory(isMenuInsideDropDownToken: boolean): boolean {
  return isMenuInsideDropDownToken ? isMenuInsideDropDownToken : false;
}
@Directive({
  selector: '[z-menu]',
  exportAs: 'zMenu',
  providers: [
    /** check if menu inside dropdown-menu component **/
    {
      provide: ZIsMenuInsideDropDownToken,
      useFactory: MenuDropDownTokenFactory,
      deps: [[new SkipSelf(), new Optional(), ZIsMenuInsideDropDownToken]]
    }
  ],
  host: {
    '[class.z-menu]': `!isMenuInsideDropDown`,
    '[class.z-menu-root]': `!isMenuInsideDropDown`,
    '[class.z-menu-vertical]': `!isMenuInsideDropDown && actualMode === 'vertical'`,
    '[class.z-menu-inline]': `!isMenuInsideDropDown && actualMode === 'inline'`,
  }
})

export class ZMenuDirective implements AfterContentInit, OnInit, OnChanges, OnDestroy {
  @Input() nzInlineIndent = 24;
  @Input() nzMode: ZMenuModeType = 'vertical';
  @Input() @InputBoolean() nzInlineCollapsed = false;
  @Input() @InputBoolean() nzSelectable = !this.isMenuInsideDropDown;
  actualMode: ZMenuModeType = 'vertical';
  dir: Direction = 'ltr';
  private inlineCollapsed$ = new BehaviorSubject<boolean>(this.nzInlineCollapsed);
  private mode$ = new BehaviorSubject<ZMenuModeType>(this.nzMode);
  private destroy$ = new Subject();

  constructor(
    @Inject(ZIsMenuInsideDropDownToken) public isMenuInsideDropDown: boolean,
  ) {}

  ngOnInit(): void {
    console.log(this.isMenuInsideDropDown);

  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  ngAfterContentInit(): void {

  }

  ngOnDestroy(): void {

  }
}
