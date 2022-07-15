/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { TemplateRef } from '@angular/core';

import { ZSafeAny } from '../core/types';

export type NzSelectModeType = 'default' | 'multiple' | 'tags';
export interface NzSelectItemInterface {
  template?: TemplateRef<ZSafeAny> | null;
  nzLabel: string | number | null;
  nzValue: ZSafeAny | null;
  nzDisabled?: boolean;
  nzHide?: boolean;
  nzCustomContent?: boolean;
  groupLabel?: string | number | TemplateRef<ZSafeAny> | null;
  type?: string;
  key?: ZSafeAny;
}

export interface NzSelectOptionInterface {
  label: string | number | null | TemplateRef<ZSafeAny>;
  value: ZSafeAny | null;
  disabled?: boolean;
  hide?: boolean;
  groupLabel?: string | number | TemplateRef<ZSafeAny> | null;
}

export type NzSelectTopControlItemType = Partial<NzSelectItemInterface> & {
  contentTemplateOutlet: TemplateRef<ZSafeAny> | null;
  contentTemplateOutletContext: ZSafeAny;
};

export type NzFilterOptionType = (input: string, option: NzSelectItemInterface) => boolean;
