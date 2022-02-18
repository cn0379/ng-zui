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

import { ZButtonModule } from '../button';
import { ZNoAnimationModule } from '../core/no-animation';
import { ZOutletModule } from '../core/outlet';
import { ZOverlayModule } from '../core/overlay';
import { ZMenuModule } from '../menu';

import { ZContextMenuServiceModule } from './context-menu.service.module';
import { ZDropDownADirective } from './dropdown-a.directive';
import { ZDropdownMenuComponent } from './dropdown-menu.component';
import { ZDropDownDirective } from './dropdown.directive';
import { ZDropdownButtonDirective } from './dropdown-button.directive';


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
    ZButtonModule,
    ZContextMenuServiceModule,
    ZOutletModule
  ],
  entryComponents: [ZDropdownMenuComponent],
  declarations: [ ZDropDownDirective, ZDropdownMenuComponent, ZDropDownADirective,ZDropdownButtonDirective],
  exports: [ZMenuModule, ZDropdownMenuComponent,ZDropDownDirective,ZDropDownADirective,ZDropdownButtonDirective]
})
export class ZDropDownModule {}
