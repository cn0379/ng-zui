/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
    TemplateRef,
    ViewEncapsulation
} from '@angular/core';

import { ZSafeAny } from '../core/types';

@Component({
    selector: 'nz-select-clear',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
      <i
        nz-icon
        nzType="close-circle"
        nzTheme="fill"
        *ngIf="!clearIcon; else clearIcon"
        class="ant-select-close-icon"
      ></i>
    `,
    host: {
        class: 'ant-select-clear',
        '(click)': 'onClick($event)'
    }
})
export class NzSelectClearComponent {
    @Input() clearIcon: TemplateRef<ZSafeAny> | null = null;
    @Output() readonly clear = new EventEmitter<MouseEvent>();

    constructor() { }

    onClick(e: MouseEvent): void {
        e.preventDefault();
        e.stopPropagation();
        this.clear.emit(e);
    }
}
