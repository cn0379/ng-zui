/*
 * @Author: zhangshaolong
 * @Date: 2022-03-02 12:59:37
 */
import { BidiModule } from '@angular/cdk/bidi';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZButtonModule } from '../button/button.module';
import { ZNoAnimationModule } from '../core/no-animation';
import { ZOutletModule } from  '../core/outlet';
import { ZOverlayModule } from '../core/overlay';


@NgModule({
  imports: [
    BidiModule,
    CommonModule,
    FormsModule,
    OverlayModule,
    ZOverlayModule,
    ZNoAnimationModule,
    ZOutletModule,
    ZButtonModule,
  ],
  exports: [

  ],
  declarations: [

  ]
})
export class NzDatePickerModule {}

