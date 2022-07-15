/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { ChangeDetectionStrategy, Component, Input, TemplateRef, ViewEncapsulation } from '@angular/core';

import { ZSafeAny } from '../core/types';

@Component({
    selector: 'nz-select-placeholder',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
     <ng-container *nzStringTemplateOutlet="placeholder">
       {{ placeholder }}
     </ng-container>
   `,
    host: { class: 'ant-select-selection-placeholder' }
})
export class NzSelectPlaceholderComponent {
    @Input() placeholder: TemplateRef<ZSafeAny> | string | null = null;

    constructor() { }
}
