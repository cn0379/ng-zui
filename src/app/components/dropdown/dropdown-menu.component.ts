/*
 * @Author: zhangshaolong
 * @Date: 2022-02-03 17:52:25
 */
import { AnimationEvent } from '@angular/animations';
import { Direction, Directionality } from '@angular/cdk/bidi';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Host,
  OnDestroy,
  OnInit,
  Optional,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { slideMotion } from '../core/animation';
import { ZNoAnimationDirective } from '../core/no-animation';
import { IndexableObject, ZSafeAny } from '../core/types';
import { MenuService, ZIsMenuInsideDropDownToken } from '../menu';

export type ZPlacementType = 'bottomLeft' | 'bottomCenter' | 'bottomRight' | 'topLeft' | 'topCenter' | 'topRight';

@Component({
  selector: `z-dropdown-menu`,
  exportAs: `zDropdownMenu`,
  animations: [slideMotion],
  providers: [
    MenuService,
    /** menu is inside dropdown-menu component **/
    {
      provide: ZIsMenuInsideDropDownToken,
      useValue: true
    }
  ],
  template: `
    <ng-template>
      <div
        class="z-dropdown"
        [class.z-dropdown-rtl]="dir === 'rtl'"
        [ngClass]="nzOverlayClassName"
        [ngStyle]="nzOverlayStyle"
        @slideMotion
        (@slideMotion.done)="onAnimationEvent($event)"
        [@.disabled]="noAnimation?.nzNoAnimation"
        [nzNoAnimation]="noAnimation?.nzNoAnimation"
        (mouseenter)="setMouseState(true)"
        (mouseleave)="setMouseState(false)"
      >
        <ng-content></ng-content>
      </div>
    </ng-template>
  `,
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ZDropdownMenuComponent implements AfterContentInit, OnDestroy, OnInit {
  mouseState$ = new BehaviorSubject<boolean>(false);
  isChildSubMenuOpen$ = this.nzMenuService.isChildSubMenuOpen$;
  descendantMenuItemClick$ = this.nzMenuService.descendantMenuItemClick$;
  animationStateChange$ = new EventEmitter<AnimationEvent>();
  nzOverlayClassName: string = '';
  nzOverlayStyle: IndexableObject = {};
  @ViewChild(TemplateRef, { static: true }) templateRef!: TemplateRef<ZSafeAny>;

  dir: Direction = 'ltr';
  private destroy$ = new Subject<void>();

  onAnimationEvent(event: AnimationEvent): void {
    this.animationStateChange$.emit(event);
  }

  setMouseState(visible: boolean): void {
    this.mouseState$.next(visible);
  }

  setValue<T extends keyof ZDropdownMenuComponent>(key: T, value: this[T]): void {
    this[key] = value;
    this.cdr.markForCheck();
  }

  constructor(
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    public viewContainerRef: ViewContainerRef,
    public nzMenuService: MenuService,
    @Optional() private directionality: Directionality,
    @Host() @Optional() public noAnimation?: ZNoAnimationDirective
  ) {}
  ngOnInit(): void {
    console.log(4444)
    this.directionality.change?.pipe(takeUntil(this.destroy$)).subscribe((direction: Direction) => {
      this.dir = direction;
      this.cdr.detectChanges();
    });

    this.dir = this.directionality.value;
  }

  ngAfterContentInit(): void {
    this.renderer.removeChild(this.renderer.parentNode(this.elementRef.nativeElement), this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
