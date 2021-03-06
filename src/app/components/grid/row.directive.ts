/*
 * @Author: zhangshaolong
 * @Date: 2022-02-17 14:20:32
 */

import { Direction, Directionality } from '@angular/cdk/bidi';
import { MediaMatcher } from '@angular/cdk/layout';
import { Platform } from '@angular/cdk/platform';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Renderer2,
  SimpleChanges
} from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { gridResponsiveMap, NzBreakpointKey, NzBreakpointService } from '../core/services';
import { IndexableObject } from '../core/types';

export type NzJustify = 'start' | 'end' | 'center' | 'space-around' | 'space-between';
export type NzAlign = 'top' | 'middle' | 'bottom';

@Directive({
  selector: '[z-row],z-row,z-form-item',
  exportAs: 'zRow',
  host: {
    class: 'z-row',
    '[class.z-row-top]': `nzAlign === 'top'`,
    '[class.z-row-middle]': `nzAlign === 'middle'`,
    '[class.z-row-bottom]': `nzAlign === 'bottom'`,
    '[class.z-row-start]': `nzJustify === 'start'`,
    '[class.z-row-end]': `nzJustify === 'end'`,
    '[class.z-row-center]': `nzJustify === 'center'`,
    '[class.z-row-space-around]': `nzJustify === 'space-around'`,
    '[class.z-row-space-between]': `nzJustify === 'space-between'`,
    '[class.z-row-rtl]': `dir === "rtl"`
  }
})
export class NzRowDirective implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() nzAlign: NzAlign | null = null;
  @Input() nzJustify: NzJustify | null = null;
  @Input() nzGutter: string | number | IndexableObject | [number, number] | [IndexableObject, IndexableObject] | null =
  null;

  readonly actualGutter$ = new ReplaySubject<[number | null, number | null]>(1);

  dir: Direction = 'ltr';

  private readonly destroy$ = new Subject();

  getGutter(): [number | null, number | null] {
    const results: [number | null, number | null] = [null, null];
    const gutter = this.nzGutter || 0;
    const normalizedGutter = Array.isArray(gutter) ? gutter : [gutter, null];
    console.log('gutter',normalizedGutter)

    normalizedGutter.forEach((g, index) => {
      if (typeof g === 'object' && g !== null) {
        results[index] = null;
        Object.keys(gridResponsiveMap).map((screen: string) => {
          const bp = screen as NzBreakpointKey;
          console.log(gridResponsiveMap[bp])
          console.log('this.mediaMatcher.matchMedia(gridResponsiveMap[bp])',this.mediaMatcher.matchMedia(gridResponsiveMap[bp]))
          console.log('this.mediaMatcher.matchMedia(gridResponsiveMap[bp]).matches',this.mediaMatcher.matchMedia(gridResponsiveMap[bp]).matches)

          if (this.mediaMatcher.matchMedia(gridResponsiveMap[bp]).matches && g[bp]) {
            console.log('g[bp]',g[bp])
            results[index] = g![bp] as number;
          }
        });
      } else {
        results[index] = Number(g) || null;
      }
    });
    return results;
  }

  setGutterStyle(): void {
    const [horizontalGutter, verticalGutter] = this.getGutter();
    this.actualGutter$.next([horizontalGutter, verticalGutter]);
    const renderGutter = (name: string, gutter: number | null): void => {
      const nativeElement = this.elementRef.nativeElement;
      if (gutter !== null) {
        this.renderer.setStyle(nativeElement, name, `-${gutter / 2}px`);
      }
    };
    renderGutter('margin-left', horizontalGutter);
    renderGutter('margin-right', horizontalGutter);
    renderGutter('margin-top', verticalGutter);
    renderGutter('margin-bottom', verticalGutter);
  }

  constructor(
    public elementRef: ElementRef,
    public renderer: Renderer2,
    public mediaMatcher: MediaMatcher,
    public ngZone: NgZone,
    public platform: Platform,
    private breakpointService: NzBreakpointService,
    @Optional() private directionality: Directionality
  ) {}

  ngOnInit(): void {
    this.dir = this.directionality.value;
    this.directionality.change?.pipe(takeUntil(this.destroy$)).subscribe((direction: Direction) => {
      this.dir = direction;
    });
    console.log('init')
    this.setGutterStyle();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.nzGutter) {
      console.log('changes.nzGutter',changes.nzGutter)
      this.setGutterStyle();
    }
  }

  ngAfterViewInit(): void {
    if (this.platform.isBrowser) {
      console.log('mounted');
      console.log('gridResponsiveMap',gridResponsiveMap)
      this.breakpointService
        .subscribe(gridResponsiveMap)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.setGutterStyle();
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
