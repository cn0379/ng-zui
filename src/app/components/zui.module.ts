/*
 * @Author: zhangshaolong
 * @Date: 2021-12-25 14:12:16
 * @LastEditors: Please set LastEditors
 */
import { ModuleWithProviders , NgModule} from '@angular/core';
import { ZLayoutModule  } from './layout'
import { ZMenuModule } from './menu'
import { ZButtonModule  } from './button'
import { ZDropDownModule  } from './dropdown'
import { ZGridModule } from './grid'
@NgModule({
  imports:[],
  exports:[
    ZLayoutModule,
    ZMenuModule,
    ZButtonModule,
    ZDropDownModule,
    ZGridModule
  ]
})

export class ZUIModule {
  static forRoot(): ModuleWithProviders<ZUIModule> {
    return {
      ngModule: ZUIModule,
    };
  }
}
