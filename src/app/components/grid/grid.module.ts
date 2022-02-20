/*
 * @Author: zhangshaolong
 * @Date: 2022-02-17 14:19:20
 */
import { BidiModule } from '@angular/cdk/bidi';
import { LayoutModule } from '@angular/cdk/layout';
import { PlatformModule } from '@angular/cdk/platform';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';


import { NzColDirective } from './col.directive';
import { NzRowDirective } from './row.directive';

@NgModule({
  declarations: [NzColDirective, NzRowDirective],
  exports: [NzColDirective, NzRowDirective],
  imports: [BidiModule, CommonModule, LayoutModule, PlatformModule]
})
export class ZGridModule {}
