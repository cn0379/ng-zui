/*
 * @Author: zhangshaolong
 * @Date: 2022-02-21 18:02:42
 */
import { ChangeDetectionStrategy, Component, Input, TemplateRef, ViewEncapsulation } from '@angular/core';



@Component({
  selector: '[nz-input-group-slot]',
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <i  *ngIf="icon">@</i>
    <ng-container *nzStringTemplateOutlet="template">{{ template }}</ng-container>
  `,
  host: {
    '[class.z-input-group-addon]': `type === 'addon'`,
    '[class.z-input-prefix]': `type === 'prefix'`,
    '[class.z-input-suffix]': `type === 'suffix'`
  }
})
export class NzInputGroupSlotComponent {
  @Input() icon?: string | null = null;
  @Input() type: 'addon' | 'prefix' | 'suffix' | null = null;
  @Input() template?: string | TemplateRef<void> | null = null;
}
