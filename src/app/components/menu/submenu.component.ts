/*
 * @Author: zhangshaolong
 * @Date: 2022-01-12 17:42:58
 */
import { Direction, Directionality } from '@angular/cdk/bidi';
import {
  CdkOverlayOrigin,
  ConnectedOverlayPositionChange,
} from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Host,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { combineLatest, merge, Subject } from 'rxjs';
import { map, startWith, switchMap, takeUntil } from 'rxjs/operators';

import { BooleanInput } from '../core/types';
import { InputBoolean } from '../core/util';

import { ZMenuItemDirective } from './menu-item.directive';

import { ZIsMenuInsideDropDownToken } from './menu.token';
import { ZMenuModeType, ZMenuThemeType } from './menu.types';
import { ZSubmenuService } from './submenu.service';
import {  MenuService } from './menu.service'

@Component({
  selector: '[z-submenu]',
  exportAs: 'zSubmenu',
  providers: [ZSubmenuService],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  template: `
    <div
      [zTitle]="zTitle"
      [mode]="mode"
      [isMenuInsideDropDown]="isMenuInsideDropDown"
      [nzDisabled]="nzDisabled"
      [paddingLeft]="nzPaddingLeft || inlinePaddingLeft"
      (subMenuMouseState)="setMouseEnterState($event)"
      (toggleSubMenu)="toggleSubMenu()"
      z-submenu-title
    >
      <ng-content select="[title]" *ngIf="!zTitle"></ng-content>
    </div>
    <div
      *ngIf="mode === 'inline'; else nonInlineTemplate"
      z-submenu-inline-child
      [mode]="mode"
      [nzOpen]="nzOpen"
      [menuClass]="nzMenuClassName"
      [templateOutlet]="subMenuTemplate"
    ></div>
    <ng-template #nonInlineTemplate>
      <ng-template>
        <div z-submenu-none-inline-child></div>
      </ng-template>
    </ng-template>

    <ng-template #subMenuTemplate>
      <ng-content></ng-content>
    </ng-template>
  `,
  host: {
    '[class.z-dropdown-menu-submenu]': `isMenuInsideDropDown`,
    '[class.z-dropdown-menu-submenu-disabled]': `isMenuInsideDropDown && nzDisabled`,
    '[class.z-dropdown-menu-submenu-open]': `isMenuInsideDropDown && nzOpen`,
    '[class.z-dropdown-menu-submenu-selected]': `isMenuInsideDropDown && isSelected`,
    '[class.z-dropdown-menu-submenu-vertical]': `isMenuInsideDropDown && mode === 'vertical'`,
    '[class.z-dropdown-menu-submenu-horizontal]': `isMenuInsideDropDown && mode === 'horizontal'`,
    '[class.z-dropdown-menu-submenu-inline]': `isMenuInsideDropDown && mode === 'inline'`,
    '[class.z-dropdown-menu-submenu-active]': `isMenuInsideDropDown && isActive`,
    '[class.z-menu-submenu]': `!isMenuInsideDropDown`,
    '[class.z-menu-submenu-disabled]': `!isMenuInsideDropDown && nzDisabled`,
    '[class.z-menu-submenu-open]': `!isMenuInsideDropDown && nzOpen`,
    '[class.z-menu-submenu-selected]': `!isMenuInsideDropDown && isSelected`,
    '[class.z-menu-submenu-vertical]': `!isMenuInsideDropDown && mode === 'vertical'`,
    '[class.z-menu-submenu-horizontal]': `!isMenuInsideDropDown && mode === 'horizontal'`,
    '[class.z-menu-submenu-inline]': `!isMenuInsideDropDown && mode === 'inline'`,
    '[class.z-menu-submenu-active]': `!isMenuInsideDropDown && isActive`,
    '[class.z-menu-submenu-rtl]': `dir === 'rtl'`
  },
})
export class ZSubMenuComponent
  implements OnInit, OnDestroy, AfterContentInit, OnChanges
{
  static ngAcceptInputType_nzOpen: BooleanInput;
  static ngAcceptInputType_nzDisabled: BooleanInput;

  @Input() nzMenuClassName: string = '';
  @Input() nzPaddingLeft: number | null = null;
  @Input() zTitle: string | TemplateRef<void> | null = null;
  @Input() nzIcon: string | null = null;
  @Input() @InputBoolean() nzOpen = false;
  @Input() @InputBoolean() nzDisabled = false;
  @Output() readonly zOpenChange: EventEmitter<boolean> = new EventEmitter();

  @ContentChildren(ZMenuItemDirective, { descendants: true })
  listOfNzMenuItemDirective: QueryList<ZMenuItemDirective> | null = null;
  private level = this.zSubmenuService.level;
  private destroy$ = new Subject<void>();
  mode: ZMenuModeType = 'vertical';
  inlinePaddingLeft: number | null = null;
  isSelected = false;
  isActive = false;
  dir: Direction = 'ltr';

  constructor(
    public zSubmenuService: ZSubmenuService,
    public zMenuService: MenuService,
    private platform: Platform,
    private cdr: ChangeDetectorRef,
    @Inject(ZIsMenuInsideDropDownToken) public isMenuInsideDropDown: boolean
  ) {}

  setOpenStateWithoutDebounce(open: boolean): void {
    this.zSubmenuService.setOpenStateWithoutDebounce(open);
  }

  setMouseEnterState(value: boolean): void {
    this.isActive = value;
    if (this.mode !== 'inline') {
      this.zSubmenuService.setMouseEnterTitleOrOverlayState(value);
    }
  }

  toggleSubMenu(): void {
    this.setOpenStateWithoutDebounce(!this.nzOpen);
  }

  ngOnInit(): void {

    /** submenu mode update **/
    this.zSubmenuService.mode$.pipe(takeUntil(this.destroy$)).subscribe(mode => {
      this.mode = mode;
      this.cdr.markForCheck();
    });
    /** inlineIndent update **/
    combineLatest([this.zSubmenuService.mode$, this.zMenuService.inlineIndent$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([mode, inlineIndent]) => {
        this.inlinePaddingLeft = mode === 'inline' ? this.level * inlineIndent : null;
        this.cdr.markForCheck();
      });

    /** current submenu open status **/
    this.zSubmenuService.isCurrentSubMenuOpen$.pipe(takeUntil(this.destroy$)).subscribe(open => {
      this.isActive = open;
      if (open !== this.nzOpen) {
        this.nzOpen = open;
        this.zOpenChange.emit(this.nzOpen);
        this.cdr.markForCheck();
      }
    });
  }


  ngAfterContentInit(): void {
    const listOfNzMenuItemDirective = this.listOfNzMenuItemDirective;
    const changes = listOfNzMenuItemDirective!.changes;
    const mergedObservable = merge(
      ...[changes, ...listOfNzMenuItemDirective!.map((menu) => menu.selected$)]
    );
    changes
      .pipe(
        startWith(listOfNzMenuItemDirective),
        switchMap(() => mergedObservable),
        startWith(true),
        map(() => listOfNzMenuItemDirective!.some((e) => e.nzSelected)),
        takeUntil(this.destroy$)
      )
      .subscribe((selected) => {
        this.isSelected = selected;
        this.cdr.markForCheck();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { nzOpen } = changes;
    if (nzOpen) {
      this.zSubmenuService.setOpenStateWithoutDebounce(this.nzOpen);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
