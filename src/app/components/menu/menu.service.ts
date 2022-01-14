/*
 * @Author: zhangshaolong
 * @Date: 2022-01-14 05:22:27
 */
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ZSafeAny } from '../core/types';
import { ZMenuModeType, ZMenuThemeType } from './menu.types';


@Injectable()
export class MenuService {
  /** all descendant menu click **/
  descendantMenuItemClick$ = new Subject<ZSafeAny>();
  /** child menu item click **/
  childMenuItemClick$ = new Subject<ZSafeAny>();
  theme$ = new BehaviorSubject<ZMenuThemeType>('light');
  mode$ = new BehaviorSubject<ZMenuModeType>('vertical');
  inlineIndent$ = new BehaviorSubject<number>(24);
  isChildSubMenuOpen$ = new BehaviorSubject<boolean>(false);

  onDescendantMenuItemClick(menu: ZSafeAny): void {
    this.descendantMenuItemClick$.next(menu);
  }

  onChildMenuItemClick(menu: ZSafeAny): void {
    this.childMenuItemClick$.next(menu);
  }

  setMode(mode: ZMenuModeType): void {
    console.log('---',mode);

    this.mode$.next(mode);
  }

  setTheme(theme: ZMenuThemeType): void {
    this.theme$.next(theme);
  }

  setInlineIndent(indent: number): void {
    this.inlineIndent$.next(indent);
  }
}
