/*
 * @Author: zhangshaolong
 * @Date: 2022-01-14 05:23:11
 */
import { Direction, Directionality } from '@angular/cdk/bidi';
import {
  AfterContentInit,
  ChangeDetectorRef,
  ContentChildren,
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
  SkipSelf,
} from '@angular/core';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BooleanInput } from '../core/types';
import { InputBoolean } from '../core/util';

import { ZMenuItemDirective } from './menu-item.directive';
import { ZSubMenuComponent } from './submenu.component';

import { ZMenuModeType, ZMenuThemeType } from './menu.types';
import { MenuService } from './menu.service';

import {
  ZIsMenuInsideDropDownToken,
  ZMenuServiceLocalToken,
} from './menu.token';

export function MenuServiceFactory(
  serviceInsideDropDown: MenuService,
  serviceOutsideDropDown: MenuService
): MenuService {
  return serviceInsideDropDown ? serviceInsideDropDown : serviceOutsideDropDown;
}
export function MenuDropDownTokenFactory(
  isMenuInsideDropDownToken: boolean
): boolean {
  return isMenuInsideDropDownToken ? isMenuInsideDropDownToken : false;
}
@Directive({
  selector: '[z-menu]',
  exportAs: 'zMenu',
  providers: [
    {
      provide: ZMenuServiceLocalToken,
      useClass: MenuService,
    },
    {
      provide: MenuService,
      useFactory: MenuServiceFactory,
      deps: [
        [new SkipSelf(), new Optional(), MenuService],
        ZMenuServiceLocalToken,
      ],
    },
    /** check if menu inside dropdown-menu component **/
    {
      provide: ZIsMenuInsideDropDownToken,
      useFactory: MenuDropDownTokenFactory,
      deps: [[new SkipSelf(), new Optional(), ZIsMenuInsideDropDownToken]],
    },
  ],
  host: {
    '[class.z-dropdown-menu]': `isMenuInsideDropDown`,
    '[class.z-dropdown-menu-root]': `isMenuInsideDropDown`,
    '[class.z-dropdown-menu-light]': `isMenuInsideDropDown && nzTheme === 'light'`,
    '[class.z-dropdown-menu-dark]': `isMenuInsideDropDown && nzTheme === 'dark'`,
    '[class.z-dropdown-menu-vertical]': `isMenuInsideDropDown && actualMode === 'vertical'`,
    '[class.z-dropdown-menu-horizontal]': `isMenuInsideDropDown && actualMode === 'horizontal'`,
    '[class.z-dropdown-menu-inline]': `isMenuInsideDropDown && actualMode === 'inline'`,
    '[class.z-dropdown-menu-inline-collapsed]': `isMenuInsideDropDown && nzInlineCollapsed`,
    '[class.z-menu]': `!isMenuInsideDropDown`,
    '[class.z-menu-root]': `!isMenuInsideDropDown`,
    '[class.z-menu-light]': `!isMenuInsideDropDown && nzTheme === 'light'`,
    '[class.z-menu-dark]': `!isMenuInsideDropDown && nzTheme === 'dark'`,
    '[class.z-menu-vertical]': `!isMenuInsideDropDown && actualMode === 'vertical'`,
    '[class.z-menu-horizontal]': `!isMenuInsideDropDown && actualMode === 'horizontal'`,
    '[class.z-menu-inline]': `!isMenuInsideDropDown && actualMode === 'inline'`,
    '[class.z-menu-inline-collapsed]': `!isMenuInsideDropDown && nzInlineCollapsed`,
    '[class.z-menu-rtl]': `dir === 'rtl'`,
  },
})
export class ZMenuDirective
  implements AfterContentInit, OnInit, OnChanges, OnDestroy
{
  static ngAcceptInputType_nzInlineCollapsed: BooleanInput;
  static ngAcceptInputType_nzSelectable: BooleanInput;

  @ContentChildren(ZMenuItemDirective, { descendants: true })
  listOfNzMenuItemDirective!: QueryList<ZMenuItemDirective>;
  @ContentChildren(ZSubMenuComponent, { descendants: true })
  listOfNzSubMenuComponent!: QueryList<ZSubMenuComponent>;
  @Input() nzInlineIndent = 24;
  @Input() nzMode: ZMenuModeType = 'vertical';
  @Input() @InputBoolean() zInlineCollapsed = false;
  @Input() @InputBoolean() nzSelectable = !this.isMenuInsideDropDown;
  @Output() readonly nzClick = new EventEmitter<ZMenuItemDirective>();
  actualMode: ZMenuModeType = 'vertical';
  dir: Direction = 'ltr';
  private inlineCollapsed$ = new BehaviorSubject<boolean>(
    this.zInlineCollapsed
  );
  private mode$ = new BehaviorSubject<ZMenuModeType>(this.nzMode);
  private destroy$ = new Subject();
  private listOfOpenedNzSubMenuComponent: ZSubMenuComponent[] = [];

  updateInlineCollapse(): void {
    if (this.listOfNzMenuItemDirective) {
      if (this.zInlineCollapsed) {
        this.listOfOpenedNzSubMenuComponent =
          this.listOfNzSubMenuComponent.filter((submenu) => submenu.nzOpen);
        this.listOfNzSubMenuComponent.forEach((submenu) =>
          submenu.setOpenStateWithoutDebounce(false)
        );
      } else {
        this.listOfOpenedNzSubMenuComponent.forEach((submenu) =>
          submenu.setOpenStateWithoutDebounce(true)
        );
        this.listOfOpenedNzSubMenuComponent = [];
      }
    }
  }

  constructor(
    private zMenuService: MenuService,
    private cdr: ChangeDetectorRef,
    @Optional() private directionality: Directionality,
    @Inject(ZIsMenuInsideDropDownToken) public isMenuInsideDropDown: boolean
  ) {}

  ngOnInit(): void {
    combineLatest([this.inlineCollapsed$, this.mode$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([inlineCollapsed, mode]) => {
        console.log(mode);

        this.actualMode = inlineCollapsed ? 'vertical' : mode;
        this.zMenuService.setMode(this.actualMode);
        this.cdr.markForCheck();
      });

    this.zMenuService.descendantMenuItemClick$
      .pipe(takeUntil(this.destroy$))
      .subscribe((menu) => {
        this.nzClick.emit(menu);
        if (this.nzSelectable && !menu.nzMatchRouter) {
          this.listOfNzMenuItemDirective.forEach((item) => {
            item.setSelectedState(item === menu);
          });
        }
      });

    // this.dir = this.directionality.value;

    // this.directionality.change?.pipe(takeUntil(this.destroy$)).subscribe((direction: Direction) => {
    //   this.dir = direction;
    //   this.zMenuService.setMode(this.actualMode);
    //   this.cdr.markForCheck();
    // });
  }

  ngAfterContentInit(): void {
    // this.inlineCollapsed$.pipe(takeUntil(this.destroy$)).subscribe(() => {
    //   this.updateInlineCollapse();
    //   this.cdr.markForCheck();
    // });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { nzInlineCollapsed, nzInlineIndent, nzTheme, nzMode } = changes;
    if (nzInlineCollapsed) {
      // this.inlineCollapsed$.next(this.zInlineCollapsed);
    }
    if (nzInlineIndent) {
      // this.zMenuService.setInlineIndent(this.nzInlineIndent);
    }
    if (nzTheme) {
      // this.zMenuService.setTheme(this.nzTheme);
    }
    if (nzMode) {
      this.mode$.next(this.nzMode);
      // if (!changes.nzMode.isFirstChange() && this.listOfNzSubMenuComponent) {
      //   this.listOfNzSubMenuComponent.forEach((submenu) =>
      //     submenu.setOpenStateWithoutDebounce(false)
      //   );
      // }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
