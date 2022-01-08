/*
 * @Author: zhangshaolong
 * @Date: 2021-12-30 09:58:25
 */
import { Injectable, NgZone, OnDestroy, Renderer2, RendererFactory2 } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { auditTime, finalize } from 'rxjs/operators';

const NOOP = (): void => {};
@Injectable({
  providedIn: 'root'
})
