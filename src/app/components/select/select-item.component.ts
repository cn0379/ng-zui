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
  ViewEncapsulation,
  OnInit
} from '@angular/core';

import { ZSafeAny } from '../core/types';

@Component({
  selector: 'nz-select-item',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
      <ng-container *nzStringTemplateOutlet="contentTemplateOutlet; context: { $implicit: contentTemplateOutletContext }">
        <div class="ant-select-selection-item-content" *ngIf="deletable; else labelTemplate">{{ label }}--3</div>
        <ng-template #labelTemplate>{{ label }}</ng-template>
      </ng-container>
      <span *ngIf="deletable && !disabled" class="ant-select-selection-item-remove" (click)="onDelete($event)">
        <i nz-icon nzType="close" *ngIf="!removeIcon; else removeIcon"></i>
      </span>
    `,
  host: {
    class: 'ant-select-selection-item',
    '[attr.title]': 'label',
    '[class.ant-select-selection-item-disabled]': 'disabled'
  }
})
export class NzSelectItemComponent {
  @Input() disabled = false;
  @Input() label: string | number | null | undefined = null;
  @Input() deletable = false;
  @Input() removeIcon: TemplateRef<ZSafeAny> | null = null;
  @Input() contentTemplateOutletContext: ZSafeAny | null = null;
  @Input() contentTemplateOutlet: string | TemplateRef<ZSafeAny> | null = null;
  @Output() readonly delete = new EventEmitter<MouseEvent>();

  constructor() { }
  ngOnInit() {
    console.log('contentTemplateOutlet', this.contentTemplateOutlet)
  }


  onDelete(e: MouseEvent): void {
    e.preventDefault();
    e.stopPropagation();
    if (!this.disabled) {
      this.delete.next(e);
    }
  }
}
