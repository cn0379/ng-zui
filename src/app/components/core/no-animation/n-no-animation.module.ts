/*
 * @Author: zhangshaolong
 * @Date: 2022-02-05 17:33:19
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ZNoAnimationDirective } from './z-no-animation.directive';

@NgModule({
  declarations: [ZNoAnimationDirective],
  exports: [ZNoAnimationDirective],
  imports: [CommonModule]
})
export class ZNoAnimationModule {}
