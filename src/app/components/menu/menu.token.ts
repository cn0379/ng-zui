/*
 * @Author: zhangshaolong
 * @Date: 2022-01-11 10:52:11
 */
import { InjectionToken } from '@angular/core';
import { MenuService } from './menu.service';

export const ZIsMenuInsideDropDownToken = new InjectionToken<boolean>('NzIsInDropDownMenuToken');
export const ZMenuServiceLocalToken = new InjectionToken<MenuService>('NzMenuServiceLocalToken');
