/*
 * @Author: zhangshaolong
 * @Date: 2022-01-14 05:21:44
 */
import { BidiModule } from '@angular/cdk/bidi';
import { OverlayModule } from '@angular/cdk/overlay';
import { PlatformModule } from '@angular/cdk/platform';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ZOutletModule } from '../core/outlet';

import { ZMenuDirective } from './menu.directive';
import { ZSubMenuComponent } from './submenu.component';
import { ZSubMenuTitleComponent } from './submenu-title.component';
import { ZMenuItemDirective } from './menu-item.directive';
import { ZSubmenuInlineChildComponent } from './submenu-inline-child.component';

@NgModule({
  imports: [
    BidiModule,
    CommonModule,
    PlatformModule,
    OverlayModule,
    ZOutletModule,
  ],
  declarations: [
    ZMenuDirective,
    ZSubMenuComponent,
    ZSubMenuTitleComponent,
    ZMenuItemDirective,
    ZSubmenuInlineChildComponent,
  ],
  exports: [
    ZMenuDirective,
    ZMenuItemDirective,
    ZSubMenuComponent,
    ZSubmenuInlineChildComponent,
  ],
})
export class ZMenuModule {}
