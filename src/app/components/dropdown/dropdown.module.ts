/*
 * @Author: zhangshaolong
 * @Date: 2022-01-31 10:34:15
 */
import { BidiModule } from '@angular/cdk/bidi';
import { OverlayModule } from '@angular/cdk/overlay';
import { PlatformModule } from '@angular/cdk/platform';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZNoAnimationModule } from '../core/no-animation';
import { ZOutletModule } from '../core/outlet';
import { ZOverlayModule } from '../core/overlay';
import { ZMenuModule } from '../menu';

import { ZDropdownMenuComponent } from './dropdown-menu.component';
import { ZDropDownDirective } from './dropdown.directive';


@NgModule({
  imports: [
    BidiModule,
    CommonModule,
    OverlayModule,
    FormsModule,
    ZMenuModule,
    ZNoAnimationModule,
    PlatformModule,
    ZOverlayModule,
    ZOutletModule
  ],
  entryComponents: [ZDropdownMenuComponent],
  declarations: [ ZDropDownDirective, ZDropdownMenuComponent, ],
  exports: [ZMenuModule, ZDropdownMenuComponent,ZDropDownDirective]
})
export class NzDropDownModule {}
