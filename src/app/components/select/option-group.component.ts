/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { ChangeDetectionStrategy, Component, Input, OnChanges, TemplateRef, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';

import { ZSafeAny } from '../core/types';

@Component({
    selector: 'nz-option-group',
    exportAs: 'nzOptionGroup',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: ` <ng-content></ng-content> `
})
export class NzOptionGroupComponent implements OnChanges {
    @Input() nzLabel: string | number | TemplateRef<ZSafeAny> | null = null;
    changes = new Subject<void>();
    ngOnChanges(): void {
        this.changes.next();
    }
}
