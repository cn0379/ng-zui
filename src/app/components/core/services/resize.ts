/*
 * @Author: zhangshaolong
 * @Date: 2021-12-30 09:58:25
 */
import {
  Injectable,
  NgZone,
  OnDestroy,
  Renderer2,
  RendererFactory2,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { auditTime, finalize } from 'rxjs/operators';

const NOOP = (): void => {};

@Injectable({
  providedIn: 'root',
})
export class ZResizeService implements OnDestroy {
  private readonly resizeSource$ = new Subject<void>();

  private listeners = 0;

  private disposeHandle = NOOP;

  private renderer: Renderer2;

  private handler = (): void => {
    this.ngZone.run(() => {
      this.resizeSource$.next();
    });
  };

  constructor(
    private ngZone: NgZone,
    private rendererFactory2: RendererFactory2
  ) {
    console.log('yes READ');

    this.renderer = this.rendererFactory2.createRenderer(null, null);
  }

  subscribe(): Observable<void> {
    this.registerListener();

    return this.resizeSource$.pipe(
      auditTime(16),
      finalize(() => this.unregisterListener())
    );
  }

  unsubscribe(): void {
    this.unregisterListener();
  }

  private registerListener(): void {
    if (this.listeners === 0) {
      this.ngZone.runOutsideAngular(() => {
        this.disposeHandle = this.renderer.listen(
          'window',
          'resize',
          this.handler
        );
      });
    }

    this.listeners += 1;
  }

  private unregisterListener(): void {
    this.listeners -= 1;

    if (this.listeners === 0) {
      this.disposeHandle();
      this.disposeHandle = NOOP;
    }
  }

  ngOnDestroy(): void {
    this.handler = NOOP;
  }
}
