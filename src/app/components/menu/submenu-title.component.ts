/*
 * @Author: zhangshaolong
 * @Date: 2022-01-12 23:38:52
 */
import { Direction, Directionality } from '@angular/cdk/bidi';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ZMenuModeType } from './menu.types';

@Component({
  selector: '[z-submenu-title]',
  exportAs: 'zSubmenuTitle',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *nzStringTemplateOutlet="zTitle">
      <span>{{ zTitle }}</span>
    </ng-container>
    <ng-content></ng-content>
    <span
      *ngIf="isMenuInsideDropDown; else notDropdownTpl"
      class="z-dropdown-menu-submenu-expand-icon"
    >
      <i class="z-dropdown-menu-submenu-arrow-icon"></i>
      <!-- <i *ngSwitchCase="'rtl'" nz-icon nzType="left" class="ant-dropdown-menu-submenu-arrow-icon"></i> -->
      <!-- <i *ngSwitchDefault nz-icon nzType="right" class="ant-dropdown-menu-submenu-arrow-icon"></i> -->
    </span>
    <ng-template #notDropdownTpl>
      <i class="z-menu-submenu-arrow"></i>
    </ng-template>
  `,
  host:{
    '[class.z-dropdown-menu-submenu-title]': 'isMenuInsideDropDown',
    '[class.z-menu-submenu-title]': '!isMenuInsideDropDown',
    '[style.paddingLeft.px]': `dir === 'rtl' ? null : paddingLeft `,
    '[style.paddingRight.px]': `dir === 'rtl' ? paddingLeft : null`,
    '(click)': 'clickTitle()',
    '(mouseenter)': 'setMouseState(true)',
    '(mouseleave)': 'setMouseState(false)'
  }
})
export class ZSubMenuTitleComponent implements OnDestroy, OnInit {
  @Input() nzIcon: string | null = null;
  @Input() zTitle: string | TemplateRef<void> | null = null;
  @Input() isMenuInsideDropDown = false;
  @Input() nzDisabled = false;
  @Input() paddingLeft: number | null = null;
  @Input() mode: ZMenuModeType = 'vertical';
  @Output() readonly toggleSubMenu = new EventEmitter();
  @Output() readonly subMenuMouseState = new EventEmitter<boolean>();

  dir: Direction = 'ltr';
  private destroy$ = new Subject<void>();
  constructor(
    private cdr: ChangeDetectorRef,
    @Optional() private directionality: Directionality
  ) {}

  ngOnInit(): void {
    this.dir = this.directionality.value;
    this.directionality.change
      ?.pipe(takeUntil(this.destroy$))
      .subscribe((direction: Direction) => {
        this.dir = direction;
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setMouseState(state: boolean): void {
    if (!this.nzDisabled) {
      this.subMenuMouseState.next(state);
    }
  }

  clickTitle(): void {
    if (this.mode === 'inline' && !this.nzDisabled) {
      this.toggleSubMenu.emit();
    }
  }

}
