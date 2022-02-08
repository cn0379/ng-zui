/*
 * @Author: zhangshaolong
 * @Date: 2022-02-08 10:17:54
 */
import { Direction, Directionality } from '@angular/cdk/bidi';
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Renderer2,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { filter, startWith, takeUntil } from 'rxjs/operators';

import { ZConfigKey, ZConfigService, WithConfig } from '../core/config';
import { BooleanInput } from '../core/types';
import { InputBoolean } from '../core/util';

export type NzButtonType = 'primary' | 'default' | 'dashed' | 'link' | 'text' | null;
export type NzButtonShape = 'circle' | 'round' | null;
export type NzButtonSize = 'large' | 'default' | 'small';

const NZ_CONFIG_MODULE_NAME: ZConfigKey = 'button';

@Component({
  selector: 'button[z-button], a[z-button]',
  exportAs: 'zButton',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <i nz-icon nzType="loading" *ngIf="nzLoading"></i>
    <ng-content></ng-content>
  `,
  host: {
    class: 'z-btn',
    '[class.z-btn-primary]': `nzType === 'primary'`,
    '[class.z-btn-dashed]': `nzType === 'dashed'`,
    '[class.z-btn-link]': `nzType === 'link'`,
    '[class.z-btn-text]': `nzType === 'text'`,
    '[class.z-btn-circle]': `nzShape === 'circle'`,
    '[class.z-btn-round]': `nzShape === 'round'`,
    '[class.z-btn-lg]': `nzSize === 'large'`,
    '[class.z-btn-sm]': `nzSize === 'small'`,
    '[class.z-btn-dangerous]': `nzDanger`,
    '[class.z-btn-loading]': `nzLoading`,
    '[class.z-btn-background-ghost]': `nzGhost`,
    '[class.z-btn-block]': `nzBlock`,
    '[class.z-input-search-button]': `nzSearch`,
    '[class.z-btn-rtl]': `dir === 'rtl'`,
    '[attr.tabindex]': 'disabled ? -1 : (tabIndex === null ? null : tabIndex)',
    '[attr.disabled]': 'disabled || null'
  }
})
export class ZButtonComponent implements OnDestroy, OnChanges, AfterViewInit, AfterContentInit, OnInit {
  readonly _nzModuleName: ZConfigKey = NZ_CONFIG_MODULE_NAME;
  static ngAcceptInputType_nzBlock: BooleanInput;
  static ngAcceptInputType_nzGhost: BooleanInput;
  static ngAcceptInputType_nzSearch: BooleanInput;
  static ngAcceptInputType_nzLoading: BooleanInput;
  static ngAcceptInputType_nzDanger: BooleanInput;
  static ngAcceptInputType_disabled: BooleanInput;

  @Input() @InputBoolean() nzBlock: boolean = false;
  @Input() @InputBoolean() nzGhost: boolean = false;
  @Input() @InputBoolean() nzSearch: boolean = false;
  @Input() @InputBoolean() nzLoading: boolean = false;
  @Input() @InputBoolean() nzDanger: boolean = false;
  @Input() @InputBoolean() disabled: boolean = false;
  @Input() tabIndex: number | string | null = null;
  @Input() nzType: NzButtonType = null;
  @Input() nzShape: NzButtonShape = null;
  @Input() @WithConfig() nzSize: NzButtonSize = 'default';
  dir: Direction = 'ltr';
  private destroy$ = new Subject<void>();
  private loading$ = new Subject<boolean>();

  insertSpan(nodes: NodeList, renderer: Renderer2): void {
    nodes.forEach(node => {
      if (node.nodeName === '#text') {
        const span = renderer.createElement('span');
        const parent = renderer.parentNode(node);
        renderer.insertBefore(parent, span, node);
        renderer.appendChild(span, node);
      }
    });
  }

  assertIconOnly(element: HTMLButtonElement, renderer: Renderer2): void {
    const listOfNode = Array.from(element.childNodes);
    const iconCount = listOfNode.filter(node => node.nodeName === 'I').length;
    const noText = listOfNode.every(node => node.nodeName !== '#text');
    const noSpan = listOfNode.every(node => node.nodeName !== 'SPAN');
    const isIconOnly = noSpan && noText && iconCount >= 1;
    if (isIconOnly) {
      renderer.addClass(element, 'z-btn-icon-only');
    }
  }

  constructor(
    private ngZone: NgZone,
    private elementRef: ElementRef,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    public nzConfigService: ZConfigService,
    @Optional() private directionality: Directionality
  ) {
    this.nzConfigService
      .getConfigChangeEventForComponent(NZ_CONFIG_MODULE_NAME)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.cdr.markForCheck();
      });
  }

  ngOnInit(): void {
    this.directionality.change?.pipe(takeUntil(this.destroy$)).subscribe((direction: Direction) => {
      this.dir = direction;
      this.cdr.detectChanges();
    });

    this.dir = this.directionality.value;

    this.ngZone.runOutsideAngular(() => {
      // Caretaker note: this event listener could've been added through `host.click` or `HostListener`.
      // The compiler generates the `ɵɵlistener` instruction which wraps the actual listener internally into the
      // function, which runs `markDirty()` before running the actual listener (the decorated class method).
      // Since we're preventing the default behavior and stopping event propagation this doesn't require Angular to run the change detection.
      fromEvent<MouseEvent>(this.elementRef.nativeElement, 'click')
        .pipe(takeUntil(this.destroy$))
        .subscribe(event => {
          if (this.disabled && (event.target as HTMLElement)?.tagName === 'A') {
            event.preventDefault();
            event.stopImmediatePropagation();
          }
        });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { nzLoading } = changes;
    if (nzLoading) {
      this.loading$.next(this.nzLoading);
    }
  }

  ngAfterViewInit(): void {
    this.assertIconOnly(this.elementRef.nativeElement, this.renderer);
    this.insertSpan(this.elementRef.nativeElement.childNodes, this.renderer);
  }

  ngAfterContentInit(): void {

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

