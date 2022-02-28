/*
 * @Author: zhangshaolong
 * @Date: 2022-02-21 18:03:03
 */
import { BidiModule } from '@angular/cdk/bidi';
import { PlatformModule } from '@angular/cdk/platform';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ZOutletModule } from '../core/outlet';

import { NzInputGroupSlotComponent } from './input-group-slot.component';
import { NzInputGroupComponent, NzInputGroupWhitSuffixOrPrefixDirective } from './input-group.component';
import { NzInputDirective } from './input.directive';

@NgModule({
  declarations: [
    NzInputDirective,
    NzInputGroupSlotComponent,
    NzInputGroupComponent,
    NzInputGroupWhitSuffixOrPrefixDirective,
    NzInputGroupSlotComponent,
  ],
  exports: [
    NzInputDirective,
    NzInputDirective,
    NzInputGroupSlotComponent,
    NzInputGroupComponent,
    NzInputGroupWhitSuffixOrPrefixDirective,
    NzInputGroupSlotComponent,
  ],
  imports: [BidiModule, CommonModule,  PlatformModule, ZOutletModule]
})
export class NzInputModule {}
