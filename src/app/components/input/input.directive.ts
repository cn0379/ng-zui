/*
 * @Author: zhangshaolong
 * @Date: 2022-02-21 18:02:56
 */
import { Direction, Directionality } from '@angular/cdk/bidi';
import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Renderer2,
  Self,
  SimpleChanges
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { BooleanInput, ZSizeLDSType } from '../core/types';
import { InputBoolean } from '../core/util';


@Directive({
  selector: 'input[nz-input],textarea[nz-input]',
  exportAs: 'nzInput',
  host: {
    '[class.z-input-disabled]': 'disabled',
    '[class.z-input-borderless]': 'nzBorderless',
    '[class.z-input-lg]': `nzSize === 'large'`,
    '[class.z-input-sm]': `nzSize === 'small'`,
    '[attr.disabled]': 'disabled || null',
    '[class.z-input-rtl]': `dir=== 'rtl'`
  }
})
export class NzInputDirective implements OnChanges, OnInit, OnDestroy {
  static ngAcceptInputType_disabled: BooleanInput;
  static ngAcceptInputType_nzBorderless: BooleanInput;
  @Input() @InputBoolean() nzBorderless = false;
  @Input() nzSize: ZSizeLDSType = 'default';
  @Input()
  get disabled(): boolean {
    if (this.ngControl && this.ngControl.disabled !== null) {
      return this.ngControl.disabled;
    }
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = value != null && `${value}` !== 'false';
  }
  _disabled = false;
  disabled$ = new Subject<boolean>();
  dir: Direction = 'ltr';
  private destroy$ = new Subject<void>();

  constructor(
    @Optional() @Self() public ngControl: NgControl,
    renderer: Renderer2,
    elementRef: ElementRef,
    @Optional() private directionality: Directionality
  ) {
    renderer.addClass(elementRef.nativeElement, 'z-input');
  }

  ngOnInit(): void {
    if (this.ngControl) {
      this.ngControl.statusChanges
        ?.pipe(
          filter(() => this.ngControl.disabled !== null),
          takeUntil(this.destroy$)
        )
        .subscribe(() => {
          this.disabled$.next(this.ngControl.disabled!);
        });
    }

    this.dir = this.directionality.value;
    this.directionality.change?.pipe(takeUntil(this.destroy$)).subscribe((direction: Direction) => {
      this.dir = direction;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { disabled } = changes;
    if (disabled) {
      this.disabled$.next(this.disabled);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
