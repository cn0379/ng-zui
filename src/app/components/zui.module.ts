/*
 * @Author: zhangshaolong
 * @Date: 2021-12-25 14:12:16
 * @LastEditors: g05047
 */
import { ModuleWithProviders , NgModule} from '@angular/core';
import { ZLayoutModule  } from './layout'

export * from './layout';
@NgModule({
  imports:[],
  exports:[
    ZLayoutModule,
  ]
})

export class ZUIModule {
  static forRoot(): ModuleWithProviders<ZUIModule> {
    return {
      ngModule: ZUIModule,
    };
  }
}
