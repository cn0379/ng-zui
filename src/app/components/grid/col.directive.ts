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

}
