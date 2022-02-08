/*
 * @Author: zhangshaolong
 * @Date: 2022-01-31 10:34:36
 */
import { ESCAPE, hasModifierKey } from '@angular/cdk/keycodes';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  Renderer2,
  SimpleChanges,
  ViewContainerRef
} from '@angular/core';

import { BehaviorSubject, combineLatest, EMPTY, fromEvent, merge, Subject } from 'rxjs';
import { auditTime, distinctUntilChanged, filter, map, mapTo, switchMap, takeUntil } from 'rxjs/operators';

import { ZConfigKey, ZConfigService, WithConfig } from '../core/config';
import { POSITION_MAP } from '../core/overlay';
import { BooleanInput, IndexableObject } from '../core/types';
import { InputBoolean } from '../core/util';

import { ZDropdownMenuComponent, ZPlacementType } from './dropdown-menu.component';

const Z_CONFIG_MODULE_NAME: ZConfigKey = 'dropDown';

const listOfPositions = [
  POSITION_MAP.bottomLeft,
  POSITION_MAP.bottomRight,
  POSITION_MAP.topRight,
  POSITION_MAP.topLeft
];

@Directive({
  selector: '[z-dropdown]',
  exportAs: 'zDropdown',
  host: {
    class: 'z-dropdown-trigger'
  }
})
export class ZDropDownDirective implements AfterViewInit, OnDestroy, OnChanges {
  readonly _zModuleName: ZConfigKey = Z_CONFIG_MODULE_NAME;

  static ngAcceptInputType_zBackdrop: BooleanInput;
  static ngAcceptInputType_zClickHide: BooleanInput;
  static ngAcceptInputType_zDisabled: BooleanInput;
  static ngAcceptInputType_zVisible: BooleanInput;

  private portal?: TemplatePortal;
  private overlayRef: OverlayRef | null = null;
  private destroy$ = new Subject();
  private positionStrategy = this.overlay
    .position()
    .flexibleConnectedTo(this.elementRef.nativeElement)
    .withLockedPosition()
    .withTransformOriginOn('.z-dropdown');
  private inputVisible$ = new BehaviorSubject<boolean>(false);
  private nzTrigger$ = new BehaviorSubject<'click' | 'hover'>('hover');
  private overlayClose$ = new Subject<boolean>();
  @Input() zDropdownMenu: ZDropdownMenuComponent | null = null;
  @Input() nzTrigger: 'click' | 'hover' = 'hover';
  @Input() nzMatchWidthElement: ElementRef | null = null;
  @Input() @WithConfig<boolean>() @InputBoolean() nzBackdrop = false;
  @Input() @InputBoolean() nzClickHide = true;
  @Input() @InputBoolean() nzDisabled = false;
  @Input() @InputBoolean() nzVisible = false;
  @Input() nzOverlayClassName: string = '';
  @Input() nzOverlayStyle: IndexableObject = {};
  @Input() nzPlacement: ZPlacementType = 'bottomLeft';
  @Output() readonly nzVisibleChange: EventEmitter<boolean> = new EventEmitter();

  setDropdownMenuValue<T extends keyof ZDropdownMenuComponent>(key: T, value: ZDropdownMenuComponent[T]): void {
    if (this.zDropdownMenu) {
      this.zDropdownMenu.setValue(key, value);
    }
  }

  constructor(
    public readonly nzConfigService: ZConfigService,
    public elementRef: ElementRef,
    private overlay: Overlay,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef,
    private platform: Platform
  ) {}

  ngAfterViewInit(): void {
    if (this.zDropdownMenu) {
      const nativeElement: HTMLElement = this.elementRef.nativeElement;
      /** host mouse state **/
      const hostMouseState$ = merge(
        fromEvent(nativeElement, 'mouseenter').pipe(mapTo(true)),
        fromEvent(nativeElement, 'mouseleave').pipe(mapTo(false))
      );
      /** menu mouse state **/
      const menuMouseState$ = this.zDropdownMenu.mouseState$;
      /** merged mouse state **/
      const mergedMouseState$ = merge(menuMouseState$, hostMouseState$);
      /** host click state **/
      const hostClickState$ = fromEvent(nativeElement, 'click').pipe(map(() => !this.nzVisible));
      /** visible state switch by nzTrigger **/
      const visibleStateByTrigger$ = this.nzTrigger$.pipe(
        switchMap(trigger => {
          if (trigger === 'hover') {
            return mergedMouseState$;
          } else if (trigger === 'click') {
            return hostClickState$;
          } else {
            return EMPTY;
          }
        })
      );
      const descendantMenuItemClick$ = this.zDropdownMenu.descendantMenuItemClick$.pipe(
        filter(() => this.nzClickHide),
        mapTo(false)
      );
      const domTriggerVisible$ = merge(visibleStateByTrigger$, descendantMenuItemClick$, this.overlayClose$).pipe(
        filter(() => !this.nzDisabled)
      );
      const visible$ = merge(this.inputVisible$, domTriggerVisible$);
      combineLatest([visible$, this.zDropdownMenu.isChildSubMenuOpen$])
        .pipe(
          map(([visible, sub]) => visible || sub),
          auditTime(150),
          distinctUntilChanged(),
          filter(() => this.platform.isBrowser),
          takeUntil(this.destroy$)
        )
        .subscribe((visible: boolean) => {
          const element = this.nzMatchWidthElement ? this.nzMatchWidthElement.nativeElement : nativeElement;
          const triggerWidth = element.getBoundingClientRect().width;
          if (this.nzVisible !== visible) {
            this.nzVisibleChange.emit(visible);
          }
          this.nzVisible = visible;
          if (visible) {
            /** set up overlayRef **/
            if (!this.overlayRef) {
              /** new overlay **/
              this.overlayRef = this.overlay.create({
                positionStrategy: this.positionStrategy,
                minWidth: triggerWidth,
                disposeOnNavigation: true,
                hasBackdrop: this.nzBackdrop && this.nzTrigger === 'click',
                scrollStrategy: this.overlay.scrollStrategies.reposition()
              });
              merge(
                this.overlayRef.backdropClick(),
                this.overlayRef.detachments(),
                this.overlayRef
                  .outsidePointerEvents()
                  .pipe(filter((e: MouseEvent) => !this.elementRef.nativeElement.contains(e.target))),
                this.overlayRef.keydownEvents().pipe(filter(e => e.keyCode === ESCAPE && !hasModifierKey(e)))
              )
                .pipe(takeUntil(this.destroy$))
                .subscribe(() => {
                  this.overlayClose$.next(false);
                });
            } else {
              /** update overlay config **/
              const overlayConfig = this.overlayRef.getConfig();
              overlayConfig.minWidth = triggerWidth;
            }
            /** open dropdown with animation **/
            this.positionStrategy.withPositions([POSITION_MAP[this.nzPlacement], ...listOfPositions]);
            /** reset portal if needed **/
            if (!this.portal || this.portal.templateRef !== this.zDropdownMenu!.templateRef) {
              this.portal = new TemplatePortal(this.zDropdownMenu!.templateRef, this.viewContainerRef);
            }
            this.overlayRef.attach(this.portal);
          } else {
            /** detach overlayRef if needed **/
            if (this.overlayRef) {
              this.overlayRef.detach();
            }
          }
        });

      this.zDropdownMenu!.animationStateChange$.pipe(takeUntil(this.destroy$)).subscribe(event => {
        if (event.toState === 'void') {
          if (this.overlayRef) {
            this.overlayRef.dispose();
          }
          this.overlayRef = null;
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { nzVisible, nzDisabled, nzOverlayClassName, nzOverlayStyle, nzTrigger } = changes;
    if (nzTrigger) {
      this.nzTrigger$.next(this.nzTrigger);
    }
    if (nzVisible) {
      this.inputVisible$.next(this.nzVisible);
    }
    if (nzDisabled) {
      const nativeElement = this.elementRef.nativeElement;
      if (this.nzDisabled) {
        this.renderer.setAttribute(nativeElement, 'disabled', '');
        this.inputVisible$.next(false);
      } else {
        this.renderer.removeAttribute(nativeElement, 'disabled');
      }
    }
    if (nzOverlayClassName) {
      this.setDropdownMenuValue('nzOverlayClassName', this.nzOverlayClassName);
    }
    if (nzOverlayStyle) {
      this.setDropdownMenuValue('nzOverlayStyle', this.nzOverlayStyle);
    }
  }
}
