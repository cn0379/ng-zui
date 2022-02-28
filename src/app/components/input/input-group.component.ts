/*
 * @Author: zhangshaolong
 * @Date: 2022-02-21 18:02:48
 */
import { FocusMonitor } from '@angular/cdk/a11y';
import { Direction, Directionality } from '@angular/cdk/bidi';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { merge, Subject } from 'rxjs';

import { map, mergeMap, startWith, switchMap, takeUntil } from 'rxjs/operators';

import { BooleanInput, ZSizeLDSType } from '../core/types';
import { InputBoolean } from '../core/util';

import { NzInputDirective } from './input.directive';

@Directive({
  selector: `nz-input-group[nzSuffix], nz-input-group[nzPrefix]`
})
export class NzInputGroupWhitSuffixOrPrefixDirective {
  constructor(public elementRef: ElementRef) {}
}

@Component({
  selector: 'nz-input-group',
  exportAs: 'nzInputGroup',
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template:`
<span class="z-input-wrapper z-input-group" *ngIf="isAddOn; else noAddOnTemplate">
      <span
        *ngIf="nzAddOnBefore || nzAddOnBeforeIcon"
        nz-input-group-slot
        type="addon"
        [icon]="nzAddOnBeforeIcon"
        [template]="nzAddOnBefore"
      ></span>
      <span
        *ngIf="isAffix; else contentTemplate"
        class="z-input-affix-wrapper"
        [class.z-input-affix-wrapper-sm]="isSmall"
        [class.z-input-affix-wrapper-lg]="isLarge"
      >
        <ng-template [ngTemplateOutlet]="affixTemplate"></ng-template>
      </span>
      <span
        *ngIf="nzAddOnAfter || nzAddOnAfterIcon"
        nz-input-group-slot
        type="addon"
        [icon]="nzAddOnAfterIcon"
        [template]="nzAddOnAfter"
      ></span>
    </span>
    <ng-template #noAddOnTemplate>
      <ng-template [ngIf]="isAffix" [ngIfElse]="contentTemplate">
        <ng-template [ngTemplateOutlet]="affixTemplate"></ng-template>
      </ng-template>
    </ng-template>
    <ng-template #affixTemplate>
      <span
        *ngIf="nzPrefix || nzPrefixIcon"
        nz-input-group-slot
        type="prefix"
        [icon]="nzPrefixIcon"
        [template]="nzPrefix"
      ></span>
      <ng-template [ngTemplateOutlet]="contentTemplate"></ng-template>
      <span
        *ngIf="nzSuffix || nzSuffixIcon"
        nz-input-group-slot
        type="suffix"
        [icon]="nzSuffixIcon"
        [template]="nzSuffix"
      ></span>
    </ng-template>
    <ng-template #contentTemplate>
      <ng-content></ng-content>
    </ng-template>
  `,
  host: {
    '[class.z-input-group-compact]': `nzCompact`,
    '[class.z-input-search-enter-button]': `nzSearch`,
    '[class.z-input-search]': `nzSearch`,
    '[class.z-input-search-rtl]': `dir === 'rtl'`,
    '[class.z-input-search-sm]': `nzSearch && isSmall`,
    '[class.z-input-search-large]': `nzSearch && isLarge`,
    '[class.z-input-group-wrapper]': `isAddOn`,
    '[class.z-input-group-wrapper-rtl]': `dir === 'rtl'`,
    '[class.z-input-group-wrapper-lg]': `isAddOn && isLarge`,
    '[class.z-input-group-wrapper-sm]': `isAddOn && isSmall`,
    '[class.z-input-affix-wrapper]': `isAffix && !isAddOn`,
    '[class.z-input-affix-wrapper-rtl]': `dir === 'rtl'`,
    '[class.z-input-affix-wrapper-focused]': `isAffix && focused`,
    '[class.z-input-affix-wrapper-disabled]': `isAffix && disabled`,
    '[class.z-input-affix-wrapper-lg]': `isAffix && !isAddOn && isLarge`,
    '[class.z-input-affix-wrapper-sm]': `isAffix && !isAddOn && isSmall`,
    '[class.z-input-group]': `!isAffix && !isAddOn`,
    '[class.z-input-group-rtl]': `dir === 'rtl'`,
    '[class.z-input-group-lg]': `!isAffix && !isAddOn && isLarge`,
    '[class.z-input-group-sm]': `!isAffix && !isAddOn && isSmall`
  }
})
export class NzInputGroupComponent implements AfterContentInit, OnChanges, OnInit, OnDestroy {
  static ngAcceptInputType_nzSearch: BooleanInput;
  static ngAcceptInputType_nzCompact: BooleanInput;

  @ContentChildren(NzInputDirective) listOfNzInputDirective!: QueryList<NzInputDirective>;
  @Input() nzAddOnBeforeIcon?: string | null = null;
  @Input() nzAddOnAfterIcon?: string | null = null;
  @Input() nzPrefixIcon?: string | null = null;
  @Input() nzSuffixIcon?: string | null = null;
  @Input() nzAddOnBefore?: string | TemplateRef<void>;
  @Input() nzAddOnAfter?: string | TemplateRef<void>;
  @Input() nzPrefix?: string | TemplateRef<void>;
  @Input() nzSuffix?: string | TemplateRef<void>;
  @Input() nzSize: ZSizeLDSType = 'default';
  @Input() @InputBoolean() nzSearch = false;
  @Input() @InputBoolean() nzCompact = false;
  isLarge = false;
  isSmall = false;
  isAffix = false;
  isAddOn = false;
  focused = false;
  disabled = false;
  dir: Direction = 'ltr';
  private destroy$ = new Subject<void>();

  constructor(
    private focusMonitor: FocusMonitor,
    private elementRef: ElementRef,
    private cdr: ChangeDetectorRef,
    @Optional() private directionality: Directionality
  ) {}

  ngOnInit(): void {
    this.focusMonitor
      .monitor(this.elementRef, true)
      .pipe(takeUntil(this.destroy$))
      .subscribe(focusOrigin => {
        this.focused = !!focusOrigin;
        this.cdr.markForCheck();
      });

    this.dir = this.directionality.value;
    this.directionality.change?.pipe(takeUntil(this.destroy$)).subscribe((direction: Direction) => {
      this.dir = direction;
    });
  }

  updateChildrenInputSize(): void {
    if (this.listOfNzInputDirective) {
      this.listOfNzInputDirective.forEach(item => (item.nzSize = this.nzSize));
    }
  }

  ngAfterContentInit(): void {
    this.updateChildrenInputSize();
    const listOfInputChange$ = this.listOfNzInputDirective.changes.pipe(startWith(this.listOfNzInputDirective));
    listOfInputChange$
      .pipe(
        switchMap(list => merge(...[listOfInputChange$, ...list.map((input: NzInputDirective) => input.disabled$)])),
        mergeMap(() => listOfInputChange$),
        map(list => list.some((input: NzInputDirective) => input.disabled)),
        takeUntil(this.destroy$)
      )
      .subscribe(disabled => {
        this.disabled = disabled;
        this.cdr.markForCheck();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const {
      nzSize,
      nzSuffix,
      nzPrefix,
      nzPrefixIcon,
      nzSuffixIcon,
      nzAddOnAfter,
      nzAddOnBefore,
      nzAddOnAfterIcon,
      nzAddOnBeforeIcon
    } = changes;
    console.log('nzAddOnBefore',nzAddOnBefore);
    console.log('nzAddOnAfter',nzAddOnAfter);

    if (nzSize) {
      this.updateChildrenInputSize();
      this.isLarge = this.nzSize === 'large';
      this.isSmall = this.nzSize === 'small';
    }
    if (nzSuffix || nzPrefix || nzPrefixIcon || nzSuffixIcon) {
      this.isAffix = !!(this.nzSuffix || this.nzPrefix || this.nzPrefixIcon || this.nzSuffixIcon);
    }
    if (nzAddOnAfter || nzAddOnBefore || nzAddOnAfterIcon || nzAddOnBeforeIcon) {
      this.isAddOn = !!(this.nzAddOnAfter || this.nzAddOnBefore || this.nzAddOnAfterIcon || this.nzAddOnBeforeIcon);
    }
  }
  ngOnDestroy(): void {
    this.focusMonitor.stopMonitoring(this.elementRef);
    this.destroy$.next();
    this.destroy$.complete();
  }

}
