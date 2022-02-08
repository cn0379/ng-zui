/*
 * @Author: zhangshaolong
 * @Date: 2022-02-02 18:29:47
 */

import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class ZDestroyService extends Subject<void> implements OnDestroy {
  ngOnDestroy(): void {
    this.next();
    this.complete();
  }
}
