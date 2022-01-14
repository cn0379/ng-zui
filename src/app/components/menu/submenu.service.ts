/*
 * @Author: zhangshaolong
 * @Date: 2022-01-12 17:58:54
 */
import { Inject, Injectable, OnDestroy, Optional, SkipSelf } from '@angular/core';
import { BehaviorSubject, combineLatest, merge, Observable, Subject } from 'rxjs';
import { auditTime, distinctUntilChanged, filter, map, mapTo, mergeMap, takeUntil } from 'rxjs/operators';

import { ZSafeAny } from '../core/types';

import { MenuService } from './menu.service';
import { ZIsMenuInsideDropDownToken } from './menu.token';
import { ZMenuModeType } from './menu.types';


@Injectable()
export class ZSubmenuService implements OnDestroy {
  mode$: Observable<ZMenuModeType> = this.zMenuService.mode$.pipe(
    map(mode => {
      if (mode === 'inline') {
        return 'inline';
        /** if inside another submenu, set the mode to vertical **/
      } else if (mode === 'vertical' || this.zHostSubmenuService) {
        return 'vertical';
      } else {
        return 'horizontal';
      }
    })
  );
  level = 1;
  isCurrentSubMenuOpen$ = new BehaviorSubject<boolean>(false);
  private isChildSubMenuOpen$ = new BehaviorSubject<boolean>(false);
  private isMouseEnterTitleOrOverlay$ = new Subject<boolean>();
  private childMenuItemClick$ = new Subject<ZSafeAny>();
  private destroy$ = new Subject<void>();
 /**
   * menu item inside submenu clicked
   *
   * @param menu
   */
  onChildMenuItemClick(menu: ZSafeAny): void {
    this.childMenuItemClick$.next(menu);
  }
  setOpenStateWithoutDebounce(value: boolean): void {
    this.isCurrentSubMenuOpen$.next(value);
  }
  setMouseEnterTitleOrOverlayState(value: boolean): void {
    this.isMouseEnterTitleOrOverlay$.next(value);
  }

  constructor(
    @SkipSelf() @Optional() private zHostSubmenuService: ZSubmenuService,
    public zMenuService: MenuService,
    @Inject(ZIsMenuInsideDropDownToken) public isMenuInsideDropDown: boolean
  ){
    if (this.zHostSubmenuService) {
      this.level = this.zHostSubmenuService.level + 1;
    }

    /** close if menu item clicked **/
     const isClosedByMenuItemClick = this.childMenuItemClick$.pipe(
      mergeMap(() => this.mode$),
      filter(mode => mode !== 'inline' || this.isMenuInsideDropDown),
      mapTo(false)
    );
    const isCurrentSubmenuOpen$ = merge(this.isMouseEnterTitleOrOverlay$, isClosedByMenuItemClick);
    const isSubMenuOpenWithDebounce$ = combineLatest([this.isChildSubMenuOpen$, isCurrentSubmenuOpen$]).pipe(
      map(([isChildSubMenuOpen, isCurrentSubmenuOpen]) => isChildSubMenuOpen || isCurrentSubmenuOpen),
      auditTime(150),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    );
    isSubMenuOpenWithDebounce$.pipe(distinctUntilChanged()).subscribe(data => {
      this.setOpenStateWithoutDebounce(data);
      if (this.zHostSubmenuService) {
        /** set parent submenu's child submenu open status **/
        this.zHostSubmenuService.isChildSubMenuOpen$.next(data);
      } else {
        this.zMenuService.isChildSubMenuOpen$.next(data);
      }
    });
  }

  ngOnDestroy(): void {

  }

}
