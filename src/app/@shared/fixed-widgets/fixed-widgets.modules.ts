/*
 * @Author: zhangshaolong
 * @Date: 2022-01-27 17:37:19
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FixedWidgetsComponent } from './fixed-widgets.component';
import { ThemingIcon } from './theme-icons'


@NgModule({
  declarations: [
    FixedWidgetsComponent,
    ThemingIcon
  ],
  imports: [
    CommonModule,
  ],
  exports: [FixedWidgetsComponent]
})
export class FixedWidgetsModule { }
