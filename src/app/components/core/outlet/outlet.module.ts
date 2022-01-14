/*
 * @Author: zhangshaolong
 * @Date: 2022-01-13 15:39:57
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ZStringTemplateOutletDirective } from './string_template_outlet.directive';


@NgModule({
  imports: [CommonModule],
  exports: [ZStringTemplateOutletDirective],
  declarations: [ZStringTemplateOutletDirective]
})
export class ZOutletModule {}
