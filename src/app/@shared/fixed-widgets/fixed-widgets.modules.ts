/*
 * @Author: zhangshaolong
 * @Date: 2022-01-27 17:37:19
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FixedWidgetsComponent } from './fixed-widgets.component';
import { ThemingIcon } from './theme-icons'
import { ZDropDownModule } from '../../components/dropdown';


@NgModule({
  declarations: [
    FixedWidgetsComponent,
    ThemingIcon
  ],
  imports: [
    CommonModule,
    ZDropDownModule
  ],
  exports: [FixedWidgetsComponent]
})
export class FixedWidgetsModule { }
