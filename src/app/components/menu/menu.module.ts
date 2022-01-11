/*
 * @Author: zhangshaolong
 * @Date: 2022-01-14 05:21:44
 */
import { BidiModule } from '@angular/cdk/bidi';
import { OverlayModule } from '@angular/cdk/overlay';
import { PlatformModule } from '@angular/cdk/platform';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ZMenuDirective } from './menu.directive';

@NgModule({
  imports: [BidiModule, CommonModule, PlatformModule, OverlayModule],
  declarations: [
    ZMenuDirective,
  ],
  exports: [ZMenuDirective]
})

export class ZMenuModule {}
