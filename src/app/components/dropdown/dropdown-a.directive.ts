/*
 * @Author: zhangshaolong
 * @Date: 2022-02-07 15:26:17
 */
import { Directive } from '@angular/core';

@Directive({
  selector: 'a[z-dropdown]',
  host: {
    class: 'z-dropdown-link'
  }
})
export class ZDropDownADirective {
  constructor() {}
}
