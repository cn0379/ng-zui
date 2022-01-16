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
  exportAs: 'nzMenu',


})
export class ZMenuDirective implements AfterContentInit, OnInit, OnChanges, OnDestroy {

}
