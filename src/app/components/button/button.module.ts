/*
 * @Author: zhangshaolong
 * @Date: 2022-02-08 10:17:42
 */
import { BidiModule } from '@angular/cdk/bidi';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ɵZTransitionPatchModule as ZTransitionPatchModule } from '../core/transition-patch';
import { ZWaveModule } from '../core/wave';

import { ZButtonGroupComponent } from './button-group.component';
import { ZButtonComponent } from './button.component';

@NgModule({
  declarations: [ZButtonComponent, ZButtonGroupComponent],
  exports: [ZButtonComponent, ZButtonGroupComponent, ZTransitionPatchModule, ZWaveModule],
  imports: [BidiModule, CommonModule, ZWaveModule, ZTransitionPatchModule]
})
export class ZButtonModule {}
