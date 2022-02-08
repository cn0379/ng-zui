/*
 * @Author: zhangshaolong
 * @Date: 2022-02-08 10:18:20
 */
import { Direction, Directionality } from '@angular/cdk/bidi';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  ViewEncapsulation
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export type NzButtonGroupSize = 'large' | 'default' | 'small';


@Component({
  selector: 'nz-button-group',
  exportAs: 'nzButtonGroup',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'z-btn-group',
    '[class.z-btn-group-lg]': `nzSize === 'large'`,
    '[class.z-btn-group-sm]': `nzSize === 'small'`,
    '[class.z-btn-group-rtl]': `dir === 'rtl'`
  },
  preserveWhitespaces: false,
  template: ` <ng-content></ng-content> `
})
export class ZButtonGroupComponent implements OnDestroy, OnInit {
  @Input() nzSize: NzButtonGroupSize = 'default';

  dir: Direction = 'ltr';

  private destroy$ = new Subject<void>();

  constructor(@Optional() private directionality: Directionality) {}
  ngOnInit(): void {
    this.dir = this.directionality.value;
    this.directionality.change?.pipe(takeUntil(this.destroy$)).subscribe((direction: Direction) => {
      this.dir = direction;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
