/*
 * @Author: zhangshaolong
 * @Date: 2022-02-08 10:22:35
 */
import { PlatformModule } from '@angular/cdk/platform';
import { NgModule } from '@angular/core';

import { ZWaveDirective } from './z-wave.directive';

@NgModule({
  imports: [PlatformModule],
  exports: [ZWaveDirective],
  declarations: [ZWaveDirective]
})
export class ZWaveModule {}
