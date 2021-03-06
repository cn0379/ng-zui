/*
 * @Author: zhangshaolong
 * @Date: 2021-12-25 15:11:58
 */
import { Direction, Directionality } from '@angular/cdk/bidi';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  OnDestroy,
  OnInit,
  Optional,
  QueryList,
  ViewEncapsulation
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ZSideComponent } from './sider.component';

@Component({
  selector:'z-layout',
  exportAs:'zLayout',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  template: ` <ng-content></ng-content> `,
  host: {
    class: 'z-layout',
    '[class.z-layout-rtl]': `dir === 'rtl'`,
    '[class.z-layout-has-sider]': 'listOfNzSiderComponent.length > 0'
  }
})
export class ZLayoutComponents implements OnDestroy, OnInit {
  @ContentChildren(ZSideComponent) listOfNzSiderComponent!: QueryList<ZSideComponent>;

  dir: Direction = 'ltr';
  private destroy$ = new Subject<void>();

  constructor(@Optional() private directionality: Directionality) {}
  ngOnInit(): void {

    this.dir = this.directionality.value;
    this.directionality.change?.pipe(takeUntil(this.destroy$)).subscribe((direction: Direction) => {
      this.dir = direction;
    });
  }

  ngAfterContentInit(): void {
    //Called after ngOnInit when the component's or directive's content has been initialized.
    //Add 'implements AfterContentInit' to the class.
  }

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();
  }
}
