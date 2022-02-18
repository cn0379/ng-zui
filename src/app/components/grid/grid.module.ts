/*
 * @Author: zhangshaolong
 * @Date: 2022-02-17 14:19:20
 */
import { BidiModule } from '@angular/cdk/bidi';
import { LayoutModule } from '@angular/cdk/layout';
import { PlatformModule } from '@angular/cdk/platform';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';


@NgModule({
  declarations: [],
  exports: [],
  imports: [BidiModule, CommonModule, LayoutModule, PlatformModule]
})
export class NzGridModule {}
