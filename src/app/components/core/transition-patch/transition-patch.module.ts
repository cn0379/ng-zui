/*
 * @Author: zhangshaolong
 * @Date: 2022-02-08 10:23:52
 */
import { PlatformModule } from '@angular/cdk/platform';
import { NgModule } from '@angular/core';

import { ZTransitionPatchDirective } from './transition-patch.directive';

@NgModule({
  imports: [PlatformModule],
  exports: [ZTransitionPatchDirective],
  declarations: [ZTransitionPatchDirective]
})
export class ZTransitionPatchModule {}
