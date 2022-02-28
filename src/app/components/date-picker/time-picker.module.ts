/*
 * @Author: zhangshaolong
 * @Date: 2022-03-02 14:00:30
 */
import { BidiModule } from '@angular/cdk/bidi';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZButtonModule } from '../button';
import { ZOutletModule } from '../core/outlet';
import { ZOverlayModule } from '../core/overlay';

@NgModule({
  declarations: [],
  exports: [],
  imports: [
    BidiModule,
    CommonModule,
    FormsModule,
    OverlayModule,
    ZOverlayModule,
    ZOutletModule,
    ZButtonModule
  ]
})

export class NzTimePickerModule {}
