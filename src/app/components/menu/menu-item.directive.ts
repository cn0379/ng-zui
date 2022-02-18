/*
 * @Author: zhangshaolong
 * @Date: 2022-01-13 17:52:04
 */
import { Direction, Directionality } from '@angular/cdk/bidi';
import {
  AfterContentInit,
  ChangeDetectorRef,
  ContentChildren,
  Directive,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  QueryList,
  SimpleChanges,
} from '@angular/core';

import { combineLatest, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { BooleanInput } from '../core/types';
import { InputBoolean } from '../core/util';

import { MenuService } from './menu.service';
import { ZIsMenuInsideDropDownToken } from './menu.token';
import { ZSubmenuService } from './submenu.service';

@Directive({
  selector: '[z-menu-item]',
  exportAs: 'zMenuItem',
  host: {
    '[class.z-dropdown-menu-item]': `isMenuInsideDropDown`,
    '[class.z-dropdown-menu-item-selected]': `isMenuInsideDropDown && nzSelected`,
    '[class.z-dropdown-menu-item-danger]': `isMenuInsideDropDown && nzDanger`,
    '[class.z-dropdown-menu-item-disabled]': `isMenuInsideDropDown && nzDisabled`,
    '[class.z-menu-item]': `!isMenuInsideDropDown`,
    '[class.z-menu-item-selected]': `!isMenuInsideDropDown && nzSelected`,
    '[class.z-menu-item-danger]': `!isMenuInsideDropDown && nzDanger`,
    '[class.z-menu-item-disabled]': `!isMenuInsideDropDown && nzDisabled`,
    '[style.paddingLeft.px]': `dir === 'rtl' ? null : nzPaddingLeft || inlinePaddingLeft`,
    '[style.paddingRight.px]': `dir === 'rtl' ? nzPaddingLeft || inlinePaddingLeft : null`,
    '(click)': 'clickMenuItem($event)',
  },
})
export class ZMenuItemDirective
  implements OnInit, OnChanges, OnDestroy, AfterContentInit
{
  static ngAcceptInputType_nzDisabled: BooleanInput;
  static ngAcceptInputType_nzSelected: BooleanInput;
  static ngAcceptInputType_nzDanger: BooleanInput;
  static ngAcceptInputType_nzMatchRouterExact: BooleanInput;
  static ngAcceptInputType_nzMatchRouter: BooleanInput;

  private destroy$ = new Subject();
  level = this.zSubmenuService ? this.zSubmenuService.level + 1 : 1;
  selected$ = new Subject<boolean>();
  inlinePaddingLeft: number | null = null;
  dir: Direction = 'ltr';
  @Input() nzPaddingLeft?: number;
  @Input() @InputBoolean() nzDisabled = false;
  @Input() @InputBoolean() nzSelected = false;
  @Input() @InputBoolean() nzDanger = false;
  @Input() @InputBoolean() nzMatchRouterExact = false;
  @Input() @InputBoolean() nzMatchRouter = false;

  clickMenuItem(e: MouseEvent): void {
    if (this.nzDisabled) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      this.zMenuService.onDescendantMenuItemClick(this);
      if (this.zSubmenuService) {
        /** menu item inside the submenu **/
        this.zSubmenuService.onChildMenuItemClick(this);
      } else {
        /** menu item inside the root menu **/
        this.zMenuService.onChildMenuItemClick(this);
      }
    }
  }

  setSelectedState(value: boolean): void {
    this.nzSelected = value;
    this.selected$.next(value);
  }

  constructor(
    private zMenuService: MenuService,
    @Inject(ZIsMenuInsideDropDownToken) public isMenuInsideDropDown: boolean,
    @Optional() private zSubmenuService: ZSubmenuService,
    @Optional() private directionality: Directionality
  ) {}

  ngOnInit(): void {
    combineLatest([this.zMenuService.mode$, this.zMenuService.inlineIndent$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([mode, inlineIndent]) => {
        this.inlinePaddingLeft =
          mode === 'inline' ? this.level * inlineIndent : null;
      });

    this.dir = this.directionality.value;
    this.directionality.change
      ?.pipe(takeUntil(this.destroy$))
      .subscribe((direction: Direction) => {
        this.dir = direction;
      });
  }

  ngAfterContentInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.nzSelected) {
      this.setSelectedState(this.nzSelected);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
