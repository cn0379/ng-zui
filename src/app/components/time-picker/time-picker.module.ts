/*
 * @Author: zhangshaolong
 * @Date: 2022-03-03 05:37:33
 */

import { BidiModule } from '@angular/cdk/bidi';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZButtonModule } from '../button';
import { ZOutletModule } from '../core/outlet';
import { ZOverlayModule } from '../core/overlay';
import { NzTimePickerComponent } from './time-picker.component';
import { NzTimePickerPanelComponent } from './time-picker-panel.component';

@NgModule({
  declarations: [NzTimePickerComponent, NzTimePickerPanelComponent],
  exports: [NzTimePickerComponent, NzTimePickerPanelComponent],
  imports: [
    BidiModule,
    CommonModule,
    FormsModule,
    OverlayModule,
    ZOverlayModule,
    ZOutletModule,
    ZButtonModule,
  ],
})
export class NzTimePickerModule {}
