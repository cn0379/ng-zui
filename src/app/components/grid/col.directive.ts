/*
 * @Author: zhangshaolong
 * @Date: 2022-02-17 14:20:17
 */
import { Direction, Directionality } from '@angular/cdk/bidi';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  Host,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Renderer2,
  SimpleChanges
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { NgClassInterface } from '../core/types';
import { isNotNil } from '../core/util';

import { NzRowDirective } from './row.directive';

export interface EmbeddedProperty {
  span?: number;
  pull?: number;
  push?: number;
  offset?: number;
  order?: number;
}

@Directive({
  selector: '[z-col],z-col,z-form-control,z-form-label',
  exportAs: 'zCol',
  host: {
    '[style.flex]': 'hostFlexStyle'
  }
})
export class NzColDirective implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  private classMap: { [key: string]: boolean } = {};
  private destroy$ = new Subject();
  hostFlexStyle: string | null = null;
  dir: Direction = 'ltr';
  @Input() nzFlex: string | number | null = null;
  @Input() nzSpan: string | number | null = null;
  @Input() nzOrder: string | number | null = null;
  @Input() nzOffset: string | number | null = null;
  @Input() nzPush: string | number | null = null;
  @Input() nzPull: string | number | null = null;
  @Input() nzXs: string | number | EmbeddedProperty | null = null;
  @Input() nzSm: string | number | EmbeddedProperty | null = null;
  @Input() nzMd: string | number | EmbeddedProperty | null = null;
  @Input() nzLg: string | number | EmbeddedProperty | null = null;
  @Input() nzXl: string | number | EmbeddedProperty | null = null;
  @Input() nzXXl: string | number | EmbeddedProperty | null = null;

  setHostClassMap(): void {
    const hostClassMap = {
      ['z-col']: true,
      [`z-col-${this.nzSpan}`]: isNotNil(this.nzSpan),
      [`z-col-order-${this.nzOrder}`]: isNotNil(this.nzOrder),
      [`z-col-offset-${this.nzOffset}`]: isNotNil(this.nzOffset),
      [`z-col-pull-${this.nzPull}`]: isNotNil(this.nzPull),
      [`z-col-push-${this.nzPush}`]: isNotNil(this.nzPush),
      ['z-col-rtl']: this.dir === 'rtl',
      ...this.generateClass()
    };
    console.log('this.classMap',this.classMap)
    for (const i in this.classMap) {
      if (this.classMap.hasOwnProperty(i)) {
        this.renderer.removeClass(this.elementRef.nativeElement, i);
      }
    }
    this.classMap = { ...hostClassMap };
    for (const i in this.classMap) {
      if (this.classMap.hasOwnProperty(i) && this.classMap[i]) {
        this.renderer.addClass(this.elementRef.nativeElement, i);
      }
    }
  }

  setHostFlexStyle(): void {
    this.hostFlexStyle = this.parseFlex(this.nzFlex);
  }

  parseFlex(flex: number | string | null): string | null {
    if (typeof flex === 'number') {
      return `${flex} ${flex} auto`;
    } else if (typeof flex === 'string') {
      if (/^\d+(\.\d+)?(px|em|rem|%)$/.test(flex)) {
        return `0 0 ${flex}`;
      }
    }
    return flex;
  }

  generateClass(): object {
    const listOfSizeInputName: Array<keyof NzColDirective> = ['nzXs', 'nzSm', 'nzMd', 'nzLg', 'nzXl', 'nzXXl'];
    const listClassMap: NgClassInterface = {};
    listOfSizeInputName.forEach(name => {
      const sizeName = name.replace('nz', '').toLowerCase();
      if (isNotNil(this[name])) {
        if (typeof this[name] === 'number' || typeof this[name] === 'string') {
          listClassMap[`ant-col-${sizeName}-${this[name]}`] = true;
        } else {
          const embedded = this[name] as EmbeddedProperty;
          const prefixArray: Array<keyof EmbeddedProperty> = ['span', 'pull', 'push', 'offset', 'order'];
          prefixArray.forEach(prefix => {
            const prefixClass = prefix === 'span' ? '-' : `-${prefix}-`;
            listClassMap[`ant-col-${sizeName}${prefixClass}${embedded[prefix]}`] =
              embedded && isNotNil(embedded[prefix]);
          });
        }
      }
    });
    return listClassMap;
  }

  constructor(
    private elementRef: ElementRef,
    @Optional() @Host() public nzRowDirective: NzRowDirective,
    public renderer: Renderer2,
    @Optional() private directionality: Directionality
  ) {}

  ngOnInit(): void {
    this.dir = this.directionality.value;
    this.directionality.change.pipe(takeUntil(this.destroy$)).subscribe((direction: Direction) => {
      this.dir = direction;
      console.log('dir')
      this.setHostClassMap();
    });

    // this.setHostClassMap();
    this.setHostFlexStyle();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setHostClassMap();
    const { nzFlex } = changes;
    if (nzFlex) {
      this.setHostFlexStyle();
    }
  }

  ngAfterViewInit(): void {
    if (this.nzRowDirective) {
      this.nzRowDirective.actualGutter$
        .pipe(takeUntil(this.destroy$))
        .subscribe(([horizontalGutter, verticalGutter]) => {
          const renderGutter = (name: string, gutter: number | null): void => {
            const nativeElement = this.elementRef.nativeElement;
            if (gutter !== null) {
              this.renderer.setStyle(nativeElement, name, `${gutter / 2}px`);
            }
          };
          renderGutter('padding-left', horizontalGutter);
          renderGutter('padding-right', horizontalGutter);
          renderGutter('padding-top', verticalGutter);
          renderGutter('padding-bottom', verticalGutter);
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
