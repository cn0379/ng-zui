/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnChanges,
    OnInit,
    Optional,
    TemplateRef,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';

import { ZDestroyService } from '../core/services';
import { BooleanInput, ZSafeAny } from '../core/types';
import { InputBoolean } from '../core/util';

import { NzOptionGroupComponent } from './option-group.component';

@Component({
    selector: 'nz-option',
    exportAs: 'nzOption',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ZDestroyService],
    template: `
      <ng-template>
        <ng-content></ng-content>
      </ng-template>
    `
})
export class NzOptionComponent implements OnChanges, OnInit {
    static ngAcceptInputType_nzDisabled: BooleanInput;
    static ngAcceptInputType_nzHide: BooleanInput;
    static ngAcceptInputType_nzCustomContent: BooleanInput;

    changes = new Subject();
    groupLabel: string | number | TemplateRef<ZSafeAny> | null = null;
    @ViewChild(TemplateRef, { static: true }) template!: TemplateRef<ZSafeAny>;
    @Input() nzLabel: string | number | null = null;
    @Input() nzValue: ZSafeAny | null = null;
    @Input() @InputBoolean() nzDisabled = false;
    @Input() @InputBoolean() nzHide = false;
    @Input() @InputBoolean() nzCustomContent = false;

    constructor(@Optional() private nzOptionGroupComponent: NzOptionGroupComponent, private destroy$: ZDestroyService) { }

    ngOnInit(): void {
        if (this.nzOptionGroupComponent) {
            this.nzOptionGroupComponent.changes.pipe(startWith(true), takeUntil(this.destroy$)).subscribe(() => {
                this.groupLabel = this.nzOptionGroupComponent.nzLabel;
            });
        }
    }

    ngOnChanges(): void {
        this.changes.next();
    }
}
